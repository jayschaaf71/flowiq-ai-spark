-- Create user communication preferences table
CREATE TABLE public.user_communication_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_reminders_enabled BOOLEAN NOT NULL DEFAULT true,
  appointment_reminders_method TEXT NOT NULL DEFAULT 'both' CHECK (appointment_reminders_method IN ('email', 'sms', 'both', 'none')),
  test_results_enabled BOOLEAN NOT NULL DEFAULT true,
  test_results_method TEXT NOT NULL DEFAULT 'email' CHECK (test_results_method IN ('email', 'sms', 'both', 'none')),
  billing_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  billing_notifications_method TEXT NOT NULL DEFAULT 'email' CHECK (billing_notifications_method IN ('email', 'sms', 'both', 'none')),
  educational_content_enabled BOOLEAN NOT NULL DEFAULT false,
  educational_content_method TEXT NOT NULL DEFAULT 'email' CHECK (educational_content_method IN ('email', 'sms', 'both', 'none')),
  general_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_communication_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own communication preferences" 
ON public.user_communication_preferences 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own communication preferences" 
ON public.user_communication_preferences 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own communication preferences" 
ON public.user_communication_preferences 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_user_communication_preferences_updated_at
BEFORE UPDATE ON public.user_communication_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();