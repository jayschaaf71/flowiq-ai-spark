-- Create patients table to match code expectations
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  patient_number TEXT UNIQUE,
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  insurance_provider TEXT,
  insurance_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_history TEXT,
  allergies TEXT,
  medications TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create providers table
CREATE TABLE public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialty TEXT,
  license_number TEXT,
  npi_number TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients
CREATE POLICY "Users can view their own patient record" 
ON public.patients FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Staff can view all patients" 
ON public.patients FOR SELECT 
TO authenticated 
USING (auth.role() = 'staff'::text);

CREATE POLICY "Staff can manage patients" 
ON public.patients FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- RLS Policies for providers
CREATE POLICY "Anyone can view active providers" 
ON public.providers FOR SELECT 
USING (is_active = true);

CREATE POLICY "Staff can manage providers" 
ON public.providers FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- Add triggers for updated_at timestamps using the existing function
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON public.providers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_patients_email ON public.patients(email);
CREATE INDEX idx_patients_patient_number ON public.patients(patient_number);
CREATE INDEX idx_patients_active ON public.patients(is_active);
CREATE INDEX idx_providers_email ON public.providers(email);
CREATE INDEX idx_providers_active ON public.providers(is_active);

-- Update appointments table to add missing fields
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS appointment_type TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS patient_name TEXT;