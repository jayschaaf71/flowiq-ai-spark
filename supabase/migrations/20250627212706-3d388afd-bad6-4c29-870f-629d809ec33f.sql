
-- Create providers table if it doesn't exist (referenced by other tables)
CREATE TABLE IF NOT EXISTS public.providers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  specialty text,
  license_number text,
  is_active boolean NOT NULL DEFAULT true,
  working_hours jsonb DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on providers
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- RLS policies for providers
CREATE POLICY "Staff can manage providers" ON public.providers
  FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));

CREATE POLICY "Users can view providers" ON public.providers
  FOR SELECT USING (true);

-- Insert default provider for testing
INSERT INTO public.providers (first_name, last_name, email, specialty) VALUES
('Dr. Sarah', 'Johnson', 'dr.johnson@clinic.com', 'General Practice')
ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_providers_active ON public.providers(is_active);
