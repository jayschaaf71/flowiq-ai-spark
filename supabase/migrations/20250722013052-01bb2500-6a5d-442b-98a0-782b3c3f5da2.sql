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