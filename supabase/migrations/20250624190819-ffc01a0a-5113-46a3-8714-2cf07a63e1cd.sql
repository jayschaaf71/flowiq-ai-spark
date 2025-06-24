
-- Create medical codes table first
CREATE TABLE IF NOT EXISTS public.medical_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  code_type TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  specialty TEXT,
  effective_date DATE,
  termination_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(code, code_type)
);

-- Enable RLS on medical codes table
ALTER TABLE public.medical_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for medical codes
CREATE POLICY "Staff can view medical codes" ON public.medical_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

-- Insert sample data with required email field for providers
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'providers' AND column_name = 'npi') THEN
        INSERT INTO public.providers (npi, first_name, last_name, email, specialty, taxonomy_code) VALUES
        ('1234567890', 'John', 'Smith', 'john.smith@healthcare.com', 'Family Medicine', '207Q00000X'),
        ('0987654321', 'Sarah', 'Johnson', 'sarah.johnson@healthcare.com', 'Internal Medicine', '207R00000X'),
        ('1122334455', 'Michael', 'Brown', 'michael.brown@dentalcare.com', 'Dentistry', '122300000X')
        ON CONFLICT (npi) DO NOTHING;
    END IF;
END $$;

-- Insert medical codes sample data
INSERT INTO public.medical_codes (code, code_type, description, specialty) VALUES
('99213', 'CPT', 'Office visit - established patient (Level 3)', 'general'),
('99214', 'CPT', 'Office visit - established patient (Level 4)', 'general'),
('D1110', 'CDT', 'Prophylaxis - adult', 'dental'),
('D0120', 'CDT', 'Periodic oral evaluation', 'dental'),
('98940', 'CPT', 'Chiropractic manipulative treatment; spinal, 1-2 regions', 'chiropractic'),
('M54.5', 'ICD-10-CM', 'Low back pain', 'general'),
('Z00.00', 'ICD-10-CM', 'Encounter for general adult medical examination without abnormal findings', 'general')
ON CONFLICT (code, code_type) DO NOTHING;
