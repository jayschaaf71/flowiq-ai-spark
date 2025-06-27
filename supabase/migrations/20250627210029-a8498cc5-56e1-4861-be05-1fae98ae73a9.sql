
-- Create Schedule iQ configuration table
CREATE TABLE IF NOT EXISTS public.schedule_iq_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  practice_id text NOT NULL,
  ai_optimization_enabled boolean NOT NULL DEFAULT true,
  auto_booking_enabled boolean NOT NULL DEFAULT true,
  waitlist_enabled boolean NOT NULL DEFAULT true,
  reminder_settings jsonb NOT NULL DEFAULT '{"email": true, "sms": true, "intervals": [24, 2]}'::jsonb,
  working_hours jsonb NOT NULL DEFAULT '{"start": "09:00", "end": "17:00", "days": [1,2,3,4,5]}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(practice_id)
);

-- Enable RLS on schedule_iq_config
ALTER TABLE public.schedule_iq_config ENABLE ROW LEVEL SECURITY;

-- RLS policies for schedule_iq_config
CREATE POLICY "Staff can manage schedule config" ON public.schedule_iq_config
  FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));
