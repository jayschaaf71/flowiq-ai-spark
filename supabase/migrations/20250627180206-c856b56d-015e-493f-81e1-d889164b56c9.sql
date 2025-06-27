
-- Add phone field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- Create patient check-in table
CREATE TABLE IF NOT EXISTS public.patient_checkins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id uuid REFERENCES public.appointments(id) NOT NULL,
  patient_id uuid REFERENCES public.patients(id) NOT NULL,
  checked_in_at timestamp with time zone NOT NULL DEFAULT now(),
  check_in_method text NOT NULL DEFAULT 'manual', -- manual, qr_code, kiosk
  forms_completed boolean NOT NULL DEFAULT false,
  insurance_verified boolean NOT NULL DEFAULT false,
  copay_collected boolean NOT NULL DEFAULT false,
  copay_amount numeric DEFAULT 0,
  notes text,
  checked_in_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create notification templates table
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL, -- email, sms, push
  subject text, -- for email
  message_template text NOT NULL,
  variables text[] DEFAULT '{}', -- available variables like {patient_name}, {appointment_date}
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create scheduled notifications table  
CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id uuid REFERENCES public.appointments(id) NOT NULL,
  template_id uuid REFERENCES public.notification_templates(id) NOT NULL,
  recipient_email text,
  recipient_phone text,
  scheduled_for timestamp with time zone NOT NULL,
  sent_at timestamp with time zone,
  status text NOT NULL DEFAULT 'pending', -- pending, sent, failed, cancelled
  retry_count integer NOT NULL DEFAULT 0,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create provider schedules table
CREATE TABLE IF NOT EXISTS public.provider_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id uuid REFERENCES public.providers(id) NOT NULL,
  day_of_week integer NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
  start_time time NOT NULL,
  end_time time NOT NULL,
  break_start_time time,
  break_end_time time,
  is_available boolean NOT NULL DEFAULT true,
  effective_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date, -- null means ongoing
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create provider time off table
CREATE TABLE IF NOT EXISTS public.provider_time_off (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id uuid REFERENCES public.providers(id) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  start_time time, -- null means all day
  end_time time, -- null means all day
  reason text,
  is_approved boolean NOT NULL DEFAULT false,
  approved_by uuid REFERENCES public.profiles(id),
  approved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.patient_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_time_off ENABLE ROW LEVEL SECURITY;

-- RLS policies for patient_checkins
CREATE POLICY "Staff can manage all checkins" ON public.patient_checkins
  FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));

CREATE POLICY "Patients can view their own checkins" ON public.patient_checkins
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid())
  );

-- RLS policies for notification_templates  
CREATE POLICY "Staff can manage notification templates" ON public.notification_templates
  FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));

-- RLS policies for scheduled_notifications
CREATE POLICY "Staff can manage scheduled notifications" ON public.scheduled_notifications
  FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));

-- RLS policies for provider_schedules
CREATE POLICY "Staff can manage provider schedules" ON public.provider_schedules
  FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));

CREATE POLICY "Providers can view their own schedules" ON public.provider_schedules
  FOR SELECT USING (
    provider_id IN (SELECT id FROM public.providers WHERE email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
  );

-- RLS policies for provider_time_off
CREATE POLICY "Staff can manage time off requests" ON public.provider_time_off
  FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));

CREATE POLICY "Providers can manage their own time off" ON public.provider_time_off
  FOR ALL USING (
    provider_id IN (SELECT id FROM public.providers WHERE email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
  );

-- Insert some default notification templates
INSERT INTO public.notification_templates (name, type, subject, message_template, variables) VALUES
('Appointment Confirmation', 'email', 'Appointment Confirmed - {appointment_date}', 
 'Dear {patient_name}, your appointment on {appointment_date} at {appointment_time} has been confirmed. Please arrive 15 minutes early.', 
 ARRAY['patient_name', 'appointment_date', 'appointment_time']),
('Appointment Reminder 24h', 'email', 'Appointment Reminder - Tomorrow', 
 'Dear {patient_name}, this is a reminder that you have an appointment tomorrow ({appointment_date}) at {appointment_time}.', 
 ARRAY['patient_name', 'appointment_date', 'appointment_time']),
('SMS Reminder', 'sms', NULL, 
 'Reminder: You have an appointment on {appointment_date} at {appointment_time}. Reply CONFIRM to confirm.', 
 ARRAY['patient_name', 'appointment_date', 'appointment_time']);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patient_checkins_appointment ON public.patient_checkins(appointment_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_appointment ON public.scheduled_notifications(appointment_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_scheduled_for ON public.scheduled_notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_provider_schedules_provider ON public.provider_schedules(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_time_off_provider ON public.provider_time_off(provider_id);
