-- Phase 2.1: Complete Appointment System Enhancement

-- Create appointment availability view for real-time availability checking
CREATE OR REPLACE VIEW appointment_availability AS
SELECT 
  ps.provider_id,
  ps.day_of_week,
  ps.start_time,
  ps.end_time,
  ps.break_start_time,
  ps.break_end_time,
  p.first_name || ' ' || p.last_name as provider_name,
  p.specialty,
  ps.is_available
FROM provider_schedules ps
JOIN providers p ON ps.provider_id = p.id
WHERE ps.is_available = true AND p.is_active = true;

-- Create function to get real-time availability
CREATE OR REPLACE FUNCTION get_available_slots(
  p_provider_id UUID,
  p_date DATE,
  p_duration INTEGER DEFAULT 60
)
RETURNS TABLE (
  time_slot TIME,
  is_available BOOLEAN,
  appointment_id UUID
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  day_of_week INTEGER;
  schedule_record RECORD;
  slot_start TIME;
  slot_end TIME;
  current_slot TIME;
BEGIN
  -- Get day of week (0 = Sunday, 1 = Monday, etc.)
  day_of_week := EXTRACT(DOW FROM p_date);
  
  -- Get provider schedule for this day
  SELECT * INTO schedule_record
  FROM provider_schedules 
  WHERE provider_id = p_provider_id 
    AND day_of_week = day_of_week 
    AND is_available = true;
  
  IF NOT FOUND THEN
    RETURN; -- No schedule for this day
  END IF;
  
  -- Generate time slots from start to end time
  current_slot := schedule_record.start_time;
  
  WHILE current_slot < schedule_record.end_time LOOP
    slot_end := current_slot + (p_duration || ' minutes')::INTERVAL;
    
    -- Skip break time
    IF schedule_record.break_start_time IS NOT NULL AND schedule_record.break_end_time IS NOT NULL THEN
      IF current_slot >= schedule_record.break_start_time AND current_slot < schedule_record.break_end_time THEN
        current_slot := current_slot + INTERVAL '30 minutes';
        CONTINUE;
      END IF;
    END IF;
    
    -- Check if slot is available (no overlapping appointments)
    time_slot := current_slot;
    SELECT a.id INTO appointment_id
    FROM appointments a
    WHERE a.provider_id = p_provider_id
      AND a.date = p_date
      AND a.status NOT IN ('cancelled', 'no-show')
      AND (
        (a.time <= current_slot AND (a.time + (a.duration || ' minutes')::INTERVAL) > current_slot) OR
        (a.time < slot_end AND a.time >= current_slot)
      );
    
    is_available := appointment_id IS NULL;
    
    RETURN NEXT;
    
    current_slot := current_slot + INTERVAL '30 minutes';
  END LOOP;
END;
$$;

-- Create appointment reminder system
CREATE TABLE IF NOT EXISTS appointment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('sms', 'email', 'call')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  message_template TEXT,
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  tenant_id UUID REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on appointment reminders
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for appointment reminders
CREATE POLICY "Staff can manage appointment reminders" 
ON appointment_reminders 
FOR ALL 
USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their own appointment reminders" 
ON appointment_reminders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM appointments a 
    WHERE a.id = appointment_reminders.appointment_id 
    AND a.patient_id = auth.uid()
  )
);

-- Create function to automatically schedule reminders
CREATE OR REPLACE FUNCTION schedule_appointment_reminders()
RETURNS TRIGGER AS $$
DECLARE
  appointment_datetime TIMESTAMPTZ;
  reminder_24h TIMESTAMPTZ;
  reminder_2h TIMESTAMPTZ;
BEGIN
  -- Calculate appointment datetime
  appointment_datetime := (NEW.date + NEW.time::TIME)::TIMESTAMPTZ;
  
  -- Skip if appointment is in the past
  IF appointment_datetime <= NOW() THEN
    RETURN NEW;
  END IF;
  
  -- Schedule 24-hour reminder
  reminder_24h := appointment_datetime - INTERVAL '24 hours';
  IF reminder_24h > NOW() THEN
    INSERT INTO appointment_reminders (
      appointment_id,
      reminder_type,
      scheduled_for,
      message_template,
      tenant_id
    ) VALUES (
      NEW.id,
      'email',
      reminder_24h,
      'You have an appointment scheduled for tomorrow at {{time}} with {{provider_name}}. Please confirm your attendance.',
      NEW.tenant_id
    );
  END IF;
  
  -- Schedule 2-hour reminder (SMS if phone available)
  reminder_2h := appointment_datetime - INTERVAL '2 hours';
  IF reminder_2h > NOW() THEN
    INSERT INTO appointment_reminders (
      appointment_id,
      reminder_type,
      scheduled_for,
      message_template,
      tenant_id
    ) VALUES (
      NEW.id,
      CASE WHEN NEW.phone IS NOT NULL THEN 'sms' ELSE 'email' END,
      reminder_2h,
      'Reminder: Your appointment is in 2 hours at {{time}} with {{provider_name}}.',
      NEW.tenant_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply reminder trigger to appointments
DROP TRIGGER IF EXISTS schedule_reminders_on_appointment ON appointments;
CREATE TRIGGER schedule_reminders_on_appointment
  AFTER INSERT ON appointments
  FOR EACH ROW EXECUTE FUNCTION schedule_appointment_reminders();

-- Create waitlist automation system
CREATE TABLE IF NOT EXISTS waitlist_automation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_entry_id UUID NOT NULL REFERENCES appointment_waitlist(id) ON DELETE CASCADE,
  target_appointment_type TEXT NOT NULL,
  target_provider_id UUID REFERENCES providers(id),
  max_days_out INTEGER DEFAULT 30,
  auto_book BOOLEAN DEFAULT false,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID REFERENCES tenants(id)
);

-- Enable RLS on waitlist automation
ALTER TABLE waitlist_automation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage waitlist automation" 
ON waitlist_automation 
FOR ALL 
USING (has_staff_access(auth.uid()));

-- Create function to auto-book from waitlist when slots become available
CREATE OR REPLACE FUNCTION check_waitlist_for_cancellation()
RETURNS TRIGGER AS $$
DECLARE
  waitlist_entry RECORD;
  available_slot RECORD;
BEGIN
  -- Only process cancellations
  IF OLD.status != 'cancelled' OR NEW.status != 'cancelled' THEN
    RETURN NEW;
  END IF;
  
  -- Find matching waitlist entries
  FOR waitlist_entry IN 
    SELECT w.*, wa.auto_book, wa.max_days_out
    FROM appointment_waitlist w
    LEFT JOIN waitlist_automation wa ON w.id = wa.waitlist_entry_id
    WHERE w.status = 'active'
      AND w.appointment_type = OLD.appointment_type
      AND (wa.target_provider_id IS NULL OR wa.target_provider_id = OLD.provider_id)
      AND w.tenant_id = OLD.tenant_id
    ORDER BY w.created_at
    LIMIT 1
  LOOP
    -- Check if the cancelled slot is suitable
    IF waitlist_entry.preferred_date IS NULL OR 
       OLD.date = waitlist_entry.preferred_date OR
       (waitlist_entry.max_days_out IS NOT NULL AND 
        OLD.date <= CURRENT_DATE + (waitlist_entry.max_days_out || ' days')::INTERVAL) THEN
       
      -- Auto-book if enabled
      IF waitlist_entry.auto_book THEN
        -- Create new appointment
        INSERT INTO appointments (
          date,
          time,
          duration,
          appointment_type,
          title,
          patient_name,
          phone,
          email,
          provider_id,
          status,
          tenant_id
        ) VALUES (
          OLD.date,
          OLD.time,
          OLD.duration,
          OLD.appointment_type,
          waitlist_entry.appointment_type || ' - From Waitlist',
          waitlist_entry.patient_name,
          waitlist_entry.phone,
          waitlist_entry.email,
          OLD.provider_id,
          'scheduled',
          OLD.tenant_id
        );
        
        -- Update waitlist status
        UPDATE appointment_waitlist 
        SET status = 'booked', updated_at = NOW()
        WHERE id = waitlist_entry.id;
        
      ELSE
        -- Send notification about available slot
        INSERT INTO patient_notifications (
          patient_id,
          type,
          title,
          message,
          priority,
          metadata,
          tenant_id
        ) VALUES (
          NULL, -- Will be handled by notification system
          'appointment_available',
          'Appointment Available',
          'A ' || OLD.appointment_type || ' appointment is now available on ' || OLD.date || ' at ' || OLD.time,
          'normal',
          jsonb_build_object(
            'waitlist_id', waitlist_entry.id,
            'appointment_date', OLD.date,
            'appointment_time', OLD.time,
            'provider_id', OLD.provider_id,
            'patient_phone', waitlist_entry.phone,
            'patient_email', waitlist_entry.email
          ),
          OLD.tenant_id
        );
        
        UPDATE waitlist_automation 
        SET notification_sent = true 
        WHERE waitlist_entry_id = waitlist_entry.id;
      END IF;
      
      EXIT; -- Only process first matching waitlist entry
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply waitlist trigger
DROP TRIGGER IF EXISTS check_waitlist_on_cancellation ON appointments;
CREATE TRIGGER check_waitlist_on_cancellation
  AFTER UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION check_waitlist_for_cancellation();

-- Create appointment analytics view
CREATE OR REPLACE VIEW appointment_analytics AS
SELECT 
  a.tenant_id,
  COUNT(*) as total_appointments,
  COUNT(CASE WHEN a.status = 'scheduled' THEN 1 END) as scheduled_count,
  COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_count,
  COUNT(CASE WHEN a.status = 'cancelled' THEN 1 END) as cancelled_count,
  COUNT(CASE WHEN a.status = 'no-show' THEN 1 END) as no_show_count,
  ROUND(
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END)::NUMERIC / 
    NULLIF(COUNT(CASE WHEN a.status IN ('completed', 'no-show') THEN 1 END), 0) * 100, 
    2
  ) as show_rate,
  AVG(a.duration) as avg_duration,
  DATE_TRUNC('day', a.date) as appointment_date
FROM appointments a
WHERE a.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY a.tenant_id, DATE_TRUNC('day', a.date)
ORDER BY appointment_date DESC;