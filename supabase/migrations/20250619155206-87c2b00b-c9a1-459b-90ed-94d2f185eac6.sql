
-- Create sequence first, before tables that reference it
CREATE SEQUENCE patient_number_seq START 1;

-- Create comprehensive database schema for production EHR system

-- 1. Patients table (comprehensive patient management)
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_number TEXT UNIQUE NOT NULL DEFAULT 'P' || LPAD(NEXTVAL('patient_number_seq')::TEXT, 6, '0'),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone TEXT,
  email TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  preferred_language TEXT DEFAULT 'English',
  marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed', 'separated')),
  occupation TEXT,
  employer TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- 2. Insurance providers table
CREATE TABLE public.insurance_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Patient insurance table
CREATE TABLE public.patient_insurance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  insurance_provider_id UUID NOT NULL REFERENCES public.insurance_providers(id),
  policy_number TEXT NOT NULL,
  group_number TEXT,
  subscriber_name TEXT,
  subscriber_relationship TEXT CHECK (subscriber_relationship IN ('self', 'spouse', 'child', 'other')),
  effective_date DATE,
  expiration_date DATE,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  copay_amount DECIMAL(10,2),
  deductible_amount DECIMAL(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Medical history table
CREATE TABLE public.medical_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  condition_name TEXT NOT NULL,
  diagnosis_date DATE,
  status TEXT CHECK (status IN ('active', 'resolved', 'chronic', 'managed')) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 5. Medications table
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  prescribed_date DATE,
  prescribed_by TEXT,
  status TEXT CHECK (status IN ('active', 'discontinued', 'completed')) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 6. Allergies table
CREATE TABLE public.allergies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  allergen TEXT NOT NULL,
  reaction TEXT,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe', 'life-threatening')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 7. SOAP notes table
CREATE TABLE public.soap_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id),
  provider_id UUID NOT NULL REFERENCES public.providers(id),
  visit_date DATE NOT NULL,
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  chief_complaint TEXT,
  vital_signs JSONB,
  diagnosis_codes TEXT[], -- ICD-10 codes
  procedure_codes TEXT[], -- CPT codes for medical, CDT for dental
  status TEXT CHECK (status IN ('draft', 'signed', 'amended')) DEFAULT 'draft',
  signed_at TIMESTAMP WITH TIME ZONE,
  signed_by UUID REFERENCES auth.users(id),
  is_ai_generated BOOLEAN DEFAULT false,
  ai_confidence_score DECIMAL(3,2),
  template_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- 8. SOAP note templates
CREATE TABLE public.soap_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL, -- 'dental', 'chiropractic', 'general'
  template_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 9. Treatment plans (for dental/chiro)
CREATE TABLE public.treatment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id),
  title TEXT NOT NULL,
  description TEXT,
  estimated_cost DECIMAL(10,2),
  estimated_sessions INTEGER,
  status TEXT CHECK (status IN ('proposed', 'accepted', 'in_progress', 'completed', 'cancelled')) DEFAULT 'proposed',
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 10. Treatment plan items
CREATE TABLE public.treatment_plan_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  treatment_plan_id UUID NOT NULL REFERENCES public.treatment_plans(id) ON DELETE CASCADE,
  procedure_code TEXT NOT NULL,
  procedure_name TEXT NOT NULL,
  tooth_number TEXT, -- for dental
  surface TEXT, -- for dental
  estimated_cost DECIMAL(10,2),
  status TEXT CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'planned',
  completed_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Billing codes table
CREATE TABLE public.billing_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  code_type TEXT CHECK (code_type IN ('CPT', 'CDT', 'ICD-10')) NOT NULL,
  description TEXT NOT NULL,
  specialty TEXT, -- 'dental', 'chiropractic', 'general'
  default_fee DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. Claims table
CREATE TABLE public.claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_number TEXT UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  insurance_provider_id UUID NOT NULL REFERENCES public.insurance_providers(id),
  provider_id UUID NOT NULL REFERENCES public.providers(id),
  service_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  insurance_amount DECIMAL(10,2),
  patient_amount DECIMAL(10,2),
  status TEXT CHECK (status IN ('draft', 'submitted', 'accepted', 'rejected', 'paid')) DEFAULT 'draft',
  submitted_date DATE,
  response_date DATE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 13. Claim line items
CREATE TABLE public.claim_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES public.claims(id) ON DELETE CASCADE,
  procedure_code TEXT NOT NULL,
  procedure_description TEXT,
  quantity INTEGER DEFAULT 1,
  unit_cost DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  diagnosis_codes TEXT[],
  tooth_number TEXT, -- for dental
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 14. Audit log table (HIPAA requirement)
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 15. File attachments table
CREATE TABLE public.file_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id),
  soap_note_id UUID REFERENCES public.soap_notes(id),
  appointment_id UUID REFERENCES public.appointments(id),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  description TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for staff access (simplified for now)
CREATE POLICY "Staff can manage all patient data" ON public.patients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage insurance data" ON public.insurance_providers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage patient insurance" ON public.patient_insurance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage medical history" ON public.medical_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage medications" ON public.medications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage allergies" ON public.allergies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage SOAP notes" ON public.soap_notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage SOAP templates" ON public.soap_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage treatment plans" ON public.treatment_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage treatment plan items" ON public.treatment_plan_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can view billing codes" ON public.billing_codes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage claims" ON public.claims
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage claim line items" ON public.claim_line_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Admins can view audit logs" ON public.audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Staff can manage file attachments" ON public.file_attachments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_timestamp_patients BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_patient_insurance BEFORE UPDATE ON public.patient_insurance
    FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_medical_history BEFORE UPDATE ON public.medical_history
    FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_medications BEFORE UPDATE ON public.medications
    FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_soap_notes BEFORE UPDATE ON public.soap_notes
    FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_treatment_plans BEFORE UPDATE ON public.treatment_plans
    FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_claims BEFORE UPDATE ON public.claims
    FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Insert sample data for billing codes
INSERT INTO public.billing_codes (code, code_type, description, specialty, default_fee) VALUES
-- Common medical CPT codes
('99201', 'CPT', 'Office visit - New patient (Level 1)', 'general', 150.00),
('99202', 'CPT', 'Office visit - New patient (Level 2)', 'general', 200.00),
('99211', 'CPT', 'Office visit - Established patient (Level 1)', 'general', 100.00),
('99212', 'CPT', 'Office visit - Established patient (Level 2)', 'general', 150.00),

-- Chiropractic CPT codes
('98940', 'CPT', 'Chiropractic manipulative treatment; spinal, 1-2 regions', 'chiropractic', 85.00),
('98941', 'CPT', 'Chiropractic manipulative treatment; spinal, 3-4 regions', 'chiropractic', 95.00),
('98942', 'CPT', 'Chiropractic manipulative treatment; spinal, 5 regions', 'chiropractic', 105.00),
('97110', 'CPT', 'Therapeutic procedure, therapeutic exercises', 'chiropractic', 75.00),

-- Dental CDT codes
('D0120', 'CDT', 'Periodic oral evaluation - established patient', 'dental', 85.00),
('D0150', 'CDT', 'Comprehensive oral evaluation - new or established patient', 'dental', 125.00),
('D0210', 'CDT', 'Intraoral - complete series of radiographic images', 'dental', 175.00),
('D1110', 'CDT', 'Prophylaxis - adult', 'dental', 95.00),
('D2140', 'CDT', 'Amalgam - one surface, primary or permanent', 'dental', 165.00),
('D2150', 'CDT', 'Amalgam - two surfaces, primary or permanent', 'dental', 195.00);

-- Insert sample insurance providers
INSERT INTO public.insurance_providers (name, phone, website) VALUES
('Blue Cross Blue Shield', '1-800-BCBS-123', 'https://www.bcbs.com'),
('Aetna', '1-800-AETNA-1', 'https://www.aetna.com'),
('United Healthcare', '1-800-UHC-1234', 'https://www.uhc.com'),
('Cigna', '1-800-CIGNA-24', 'https://www.cigna.com'),
('Humana', '1-800-HUMANA-1', 'https://www.humana.com'),
('Delta Dental', '1-800-DELTA-1', 'https://www.deltadental.com'),
('MetLife Dental', '1-800-METLIFE', 'https://www.metlife.com');
