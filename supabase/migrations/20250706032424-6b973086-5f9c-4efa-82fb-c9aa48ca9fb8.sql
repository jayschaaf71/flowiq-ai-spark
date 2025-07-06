-- Create provider_schedules table for managing provider availability
CREATE TABLE IF NOT EXISTS public.provider_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  break_start_time TIME,
  break_end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id, day_of_week)
);

-- Enable RLS
ALTER TABLE public.provider_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view provider schedules" 
ON public.provider_schedules 
FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage provider schedules" 
ON public.provider_schedules 
FOR ALL 
USING (auth.role() = 'staff'::text);

-- Create trigger for updating timestamps
CREATE TRIGGER update_provider_schedules_updated_at
BEFORE UPDATE ON public.provider_schedules
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert default schedules for existing providers (Monday-Friday, 9 AM - 5 PM)
INSERT INTO public.provider_schedules (provider_id, day_of_week, start_time, end_time, break_start_time, break_end_time)
SELECT 
  p.id,
  d.day_of_week,
  '09:00'::TIME,
  '17:00'::TIME,
  '12:00'::TIME,
  '13:00'::TIME
FROM public.providers p
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS d(day_of_week)
WHERE p.is_active = true
ON CONFLICT (provider_id, day_of_week) DO NOTHING;