
-- Create scheduled_reminders table for automated reminder system
CREATE TABLE IF NOT EXISTS public.scheduled_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES appointments(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  template_id UUID REFERENCES notification_templates(id),
  recipient_phone TEXT,
  recipient_email TEXT,
  message_content TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivery_status TEXT NOT NULL DEFAULT 'pending',
  retry_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create provider_notifications table for real-time provider alerts
CREATE TABLE IF NOT EXISTS public.provider_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID REFERENCES patients(id),
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create patient_status_updates table for real-time patient updates
CREATE TABLE IF NOT EXISTS public.patient_status_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id),
  appointment_id UUID REFERENCES appointments(id),
  status_type TEXT NOT NULL,
  status_value TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables (only if they don't already have it)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'scheduled_reminders' AND rowsecurity = true) THEN
    ALTER TABLE public.scheduled_reminders ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'provider_notifications' AND rowsecurity = true) THEN
    ALTER TABLE public.provider_notifications ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'patient_status_updates' AND rowsecurity = true) THEN
    ALTER TABLE public.patient_status_updates ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies for scheduled_reminders
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scheduled_reminders' AND policyname = 'Users can view their own reminders') THEN
    CREATE POLICY "Users can view their own reminders" 
      ON public.scheduled_reminders 
      FOR SELECT 
      USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scheduled_reminders' AND policyname = 'System can insert reminders') THEN
    CREATE POLICY "System can insert reminders" 
      ON public.scheduled_reminders 
      FOR INSERT 
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scheduled_reminders' AND policyname = 'System can update reminders') THEN
    CREATE POLICY "System can update reminders" 
      ON public.scheduled_reminders 
      FOR UPDATE 
      USING (true);
  END IF;
END $$;

-- Create RLS policies for provider_notifications
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'provider_notifications' AND policyname = 'Providers can view their own notifications') THEN
    CREATE POLICY "Providers can view their own notifications" 
      ON public.provider_notifications 
      FOR SELECT 
      USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'provider_notifications' AND policyname = 'System can create provider notifications') THEN
    CREATE POLICY "System can create provider notifications" 
      ON public.provider_notifications 
      FOR INSERT 
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'provider_notifications' AND policyname = 'Providers can update their notifications') THEN
    CREATE POLICY "Providers can update their notifications" 
      ON public.provider_notifications 
      FOR UPDATE 
      USING (true);
  END IF;
END $$;

-- Create RLS policies for patient_status_updates
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_status_updates' AND policyname = 'Patients can view their own status updates') THEN
    CREATE POLICY "Patients can view their own status updates" 
      ON public.patient_status_updates 
      FOR SELECT 
      USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_status_updates' AND policyname = 'System can create status updates') THEN
    CREATE POLICY "System can create status updates" 
      ON public.patient_status_updates 
      FOR INSERT 
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_scheduled_for ON public.scheduled_reminders(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_status ON public.scheduled_reminders(delivery_status);
CREATE INDEX IF NOT EXISTS idx_provider_notifications_provider ON public.provider_notifications(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_notifications_unread ON public.provider_notifications(provider_id, is_read);
CREATE INDEX IF NOT EXISTS idx_patient_status_updates_patient ON public.patient_status_updates(patient_id);
