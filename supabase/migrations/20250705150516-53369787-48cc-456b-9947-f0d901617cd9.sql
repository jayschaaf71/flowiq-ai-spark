-- Create insurance_providers table
CREATE TABLE IF NOT EXISTS public.insurance_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'health',
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient_insurance table for patient insurance coverage
CREATE TABLE IF NOT EXISTS public.patient_insurance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  insurance_provider_id UUID NOT NULL,
  policy_number TEXT NOT NULL,
  group_number TEXT,
  subscriber_name TEXT,
  subscriber_relationship TEXT DEFAULT 'self',
  effective_date DATE,
  expiration_date DATE,
  is_primary BOOLEAN DEFAULT false,
  copay_amount DECIMAL(10,2),
  deductible_amount DECIMAL(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE,
  FOREIGN KEY (insurance_provider_id) REFERENCES public.insurance_providers(id) ON DELETE CASCADE
);

-- Enable RLS on both tables
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;

-- RLS policies for insurance_providers
CREATE POLICY "Anyone can view active insurance providers" 
ON public.insurance_providers FOR SELECT 
USING (is_active = true);

CREATE POLICY "Staff can manage insurance providers" 
ON public.insurance_providers FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- RLS policies for patient_insurance
CREATE POLICY "Users can view their own insurance" 
ON public.patient_insurance FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id OR auth.role() = 'staff'::text);

CREATE POLICY "Staff can manage all patient insurance" 
ON public.patient_insurance FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

CREATE POLICY "Users can manage their own insurance" 
ON public.patient_insurance FOR ALL 
TO authenticated 
USING (auth.uid() = patient_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_insurance_providers_updated_at
  BEFORE UPDATE ON public.insurance_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_patient_insurance_updated_at
  BEFORE UPDATE ON public.patient_insurance
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_insurance_providers_active ON public.insurance_providers(is_active);
CREATE INDEX idx_patient_insurance_patient_id ON public.patient_insurance(patient_id);
CREATE INDEX idx_patient_insurance_provider_id ON public.patient_insurance(insurance_provider_id);
CREATE INDEX idx_patient_insurance_is_primary ON public.patient_insurance(is_primary);

-- Insert some common insurance providers
INSERT INTO public.insurance_providers (name, type, phone, website) VALUES
('Blue Cross Blue Shield', 'health', '1-800-810-2583', 'https://www.bcbs.com'),
('Aetna', 'health', '1-800-872-3862', 'https://www.aetna.com'),
('Cigna', 'health', '1-800-244-6224', 'https://www.cigna.com'),
('UnitedHealthcare', 'health', '1-888-815-3286', 'https://www.uhc.com'),
('Humana', 'health', '1-800-448-6262', 'https://www.humana.com'),
('Kaiser Permanente', 'health', '1-800-464-4000', 'https://www.kp.org'),
('Medicare', 'government', '1-800-633-4227', 'https://www.medicare.gov'),
('Medicaid', 'government', '1-800-633-4227', 'https://www.medicaid.gov');