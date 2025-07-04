-- Create patient notifications table
CREATE TABLE public.patient_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('appointment', 'billing', 'medical', 'system', 'education')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_reminders BOOLEAN NOT NULL DEFAULT true,
  treatment_updates BOOLEAN NOT NULL DEFAULT true,
  educational_content BOOLEAN NOT NULL DEFAULT true,
  billing_notifications BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create two-factor authentication table
CREATE TABLE public.user_2fa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  secret TEXT NOT NULL,
  backup_codes TEXT[],
  enabled BOOLEAN NOT NULL DEFAULT false,
  enabled_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_patient_notifications_patient_id ON public.patient_notifications(patient_id);
CREATE INDEX idx_patient_notifications_created_at ON public.patient_notifications(created_at DESC);
CREATE INDEX idx_patient_notifications_unread ON public.patient_notifications(patient_id, is_read) WHERE is_read = false;

-- Enable RLS on all tables
ALTER TABLE public.patient_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patient_notifications
CREATE POLICY "Patients can view their own notifications" 
ON public.patient_notifications FOR SELECT 
TO authenticated 
USING (patient_id = auth.uid());

CREATE POLICY "Patients can update their own notifications" 
ON public.patient_notifications FOR UPDATE 
TO authenticated 
USING (patient_id = auth.uid());

CREATE POLICY "Staff can manage all patient notifications" 
ON public.patient_notifications FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('staff', 'admin')
  )
);

-- RLS Policies for notification_preferences
CREATE POLICY "Users can manage their own notification preferences" 
ON public.notification_preferences FOR ALL 
TO authenticated 
USING (user_id = auth.uid());

-- RLS Policies for user_2fa
CREATE POLICY "Users can manage their own 2FA settings" 
ON public.user_2fa FOR ALL 
TO authenticated 
USING (user_id = auth.uid());

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_patient_notifications_updated_at
  BEFORE UPDATE ON public.patient_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_2fa_updated_at
  BEFORE UPDATE ON public.user_2fa
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();