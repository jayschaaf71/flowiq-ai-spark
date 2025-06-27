
-- Create schedule optimizations table
CREATE TABLE IF NOT EXISTS public.schedule_optimizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id text NOT NULL DEFAULT 'default-provider',
  date date NOT NULL,
  improvements jsonb NOT NULL DEFAULT '{}'::jsonb,
  reasoning text,
  applied_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on schedule_optimizations
ALTER TABLE public.schedule_optimizations ENABLE ROW LEVEL SECURITY;

-- RLS policies for schedule_optimizations
CREATE POLICY "Staff can manage schedule optimizations" ON public.schedule_optimizations
  FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schedule_optimizations_provider ON public.schedule_optimizations(provider_id);
CREATE INDEX IF NOT EXISTS idx_schedule_optimizations_date ON public.schedule_optimizations(date);
