
-- Check existing policies first, then create only the missing ones
-- Drop and recreate all policies to ensure consistency

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Patients can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can manage all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can create appointments" ON public.appointments;

-- Create the RLS policies
CREATE POLICY "Patients can view their own appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (patient_id = auth.uid());

CREATE POLICY "Staff can view all appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage all appointments" 
  ON public.appointments 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Patients can create appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (patient_id = auth.uid());

-- Create providers table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  specialty TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  working_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": null, "sunday": null}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on providers table
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- Create providers policies
DROP POLICY IF EXISTS "Everyone can view active providers" ON public.providers;
DROP POLICY IF EXISTS "Staff can manage providers" ON public.providers;

CREATE POLICY "Everyone can view active providers" 
  ON public.providers 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Staff can manage providers" 
  ON public.providers 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_appointments_provider'
    ) THEN
        ALTER TABLE public.appointments 
        ADD CONSTRAINT fk_appointments_provider 
        FOREIGN KEY (provider_id) REFERENCES public.providers(id);
    END IF;
END $$;

-- Insert sample providers (only if table is empty)
INSERT INTO public.providers (first_name, last_name, email, specialty, phone) 
SELECT 'Sarah', 'Johnson', 'dr.johnson@clinic.com', 'General Dentistry', '(555) 123-4567'
WHERE NOT EXISTS (SELECT 1 FROM public.providers LIMIT 1)
UNION ALL
SELECT 'Michael', 'Smith', 'dr.smith@clinic.com', 'Oral Surgery', '(555) 234-5678'
WHERE NOT EXISTS (SELECT 1 FROM public.providers LIMIT 1)
UNION ALL
SELECT 'Emily', 'Wilson', 'dr.wilson@clinic.com', 'Pediatric Dentistry', '(555) 345-6789'
WHERE NOT EXISTS (SELECT 1 FROM public.providers LIMIT 1);
