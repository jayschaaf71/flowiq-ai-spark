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

-- Enable RLS on new tables
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa ENABLE ROW LEVEL SECURITY;

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
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_2fa_updated_at
  BEFORE UPDATE ON public.user_2fa
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();