
-- Create schedule_notifications table for real-time notifications
CREATE TABLE public.schedule_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('booking', 'optimization', 'reminder', 'conflict', 'waitlist')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  read BOOLEAN NOT NULL DEFAULT false,
  action_required BOOLEAN NOT NULL DEFAULT false,
  notification_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create schedule_iq_config table for AI configuration
CREATE TABLE public.schedule_iq_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  practice_id TEXT NOT NULL,
  ai_optimization_enabled BOOLEAN NOT NULL DEFAULT true,
  auto_booking_enabled BOOLEAN NOT NULL DEFAULT true,
  waitlist_enabled BOOLEAN NOT NULL DEFAULT true,
  reminder_settings JSONB NOT NULL DEFAULT '{"email": true, "sms": true, "intervals": [24, 2]}'::jsonb,
  working_hours JSONB NOT NULL DEFAULT '{"start": "09:00", "end": "17:00", "days": [1,2,3,4,5]}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(practice_id)
);

-- Create schedule_optimizations table for tracking AI optimizations
CREATE TABLE public.schedule_optimizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id TEXT NOT NULL,
  date DATE NOT NULL,
  improvements JSONB NOT NULL DEFAULT '{}'::jsonb,
  reasoning TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.schedule_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_iq_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_optimizations ENABLE ROW LEVEL SECURITY;

-- Create policies for schedule_notifications (allow all operations for now)
CREATE POLICY "Enable all operations for schedule_notifications" ON public.schedule_notifications
  FOR ALL USING (true) WITH CHECK (true);

-- Create policies for schedule_iq_config (allow all operations for now)
CREATE POLICY "Enable all operations for schedule_iq_config" ON public.schedule_iq_config
  FOR ALL USING (true) WITH CHECK (true);

-- Create policies for schedule_optimizations (allow all operations for now)
CREATE POLICY "Enable all operations for schedule_optimizations" ON public.schedule_optimizations
  FOR ALL USING (true) WITH CHECK (true);

-- Add trigger for updated_at timestamps
CREATE TRIGGER update_schedule_notifications_updated_at
  BEFORE UPDATE ON public.schedule_notifications
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_schedule_iq_config_updated_at
  BEFORE UPDATE ON public.schedule_iq_config
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_schedule_optimizations_updated_at
  BEFORE UPDATE ON public.schedule_optimizations
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
