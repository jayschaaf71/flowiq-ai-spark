-- Create provider notification preferences table
CREATE TABLE public.provider_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  in_app_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  timing_minutes INTEGER DEFAULT NULL, -- For time-based notifications (e.g., 30 min before appointment)
  days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5], -- Mon-Fri = 1-5, Sat-Sun = 6-7
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tenant_id UUID,
  UNIQUE(provider_id, notification_type)
);

-- Enable Row Level Security
ALTER TABLE public.provider_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for provider notification preferences
CREATE POLICY "Providers can manage their own notification preferences" 
ON public.provider_notification_preferences 
FOR ALL 
USING (provider_id::text = auth.uid()::text);

CREATE POLICY "Staff can manage all notification preferences" 
ON public.provider_notification_preferences 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

-- Add trigger for updated_at
CREATE TRIGGER update_provider_notification_preferences_updated_at
BEFORE UPDATE ON public.provider_notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default notification preferences for common notification types
INSERT INTO public.provider_notification_preferences (
  provider_id, notification_type, email_enabled, in_app_enabled, sms_enabled, push_enabled, timing_minutes
) VALUES 
-- Default preferences (will be overridden by actual provider IDs when they set preferences)
('00000000-0000-0000-0000-000000000000', 'intake_completed', true, true, false, true, NULL),
('00000000-0000-0000-0000-000000000000', 'upcoming_appointment', true, true, false, true, 30),
('00000000-0000-0000-0000-000000000000', 'appointment_cancelled', true, true, true, true, NULL),
('00000000-0000-0000-0000-000000000000', 'appointment_rescheduled', true, true, false, true, NULL),
('00000000-0000-0000-0000-000000000000', 'no_show', true, true, false, true, NULL),
('00000000-0000-0000-0000-000000000000', 'lab_results_ready', true, true, true, true, NULL),
('00000000-0000-0000-0000-000000000000', 'prescription_ready', true, true, true, true, NULL),
('00000000-0000-0000-0000-000000000000', 'urgent_message', true, true, true, true, NULL),
('00000000-0000-0000-0000-000000000000', 'schedule_conflict', true, true, false, true, NULL),
('00000000-0000-0000-0000-000000000000', 'daily_schedule_summary', true, true, false, false, NULL)
ON CONFLICT (provider_id, notification_type) DO NOTHING;