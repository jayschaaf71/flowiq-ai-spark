-- Create core database schema for chiropractic patient portal

-- Enhanced medical records table
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.providers(id),
  record_type TEXT NOT NULL DEFAULT 'visit_note',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  diagnosis_codes TEXT[],
  treatment_codes TEXT[],
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  attachments JSONB DEFAULT '[]',
  is_confidential BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- File attachments table for secure file storage
CREATE TABLE IF NOT EXISTS public.file_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id),
  filename TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  storage_path TEXT NOT NULL,
  bucket_name TEXT NOT NULL DEFAULT 'patient-files',
  description TEXT,
  attachment_type TEXT NOT NULL DEFAULT 'document',
  is_patient_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Billing and invoices table
CREATE TABLE IF NOT EXISTS public.billing_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id),
  invoice_number TEXT NOT NULL UNIQUE,
  total_amount DECIMAL(10,2) NOT NULL,
  insurance_amount DECIMAL(10,2) DEFAULT 0.00,
  patient_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE NOT NULL,
  service_date DATE NOT NULL,
  description TEXT,
  line_items JSONB DEFAULT '[]',
  payment_method TEXT,
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insurance providers table
CREATE TABLE IF NOT EXISTS public.insurance_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  payer_id TEXT,
  phone TEXT,
  address TEXT,
  eligibility_phone TEXT,
  claims_address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Patient insurance information
CREATE TABLE IF NOT EXISTS public.patient_insurance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  insurance_provider_id UUID REFERENCES public.insurance_providers(id),
  policy_number TEXT NOT NULL,
  group_number TEXT,
  subscriber_name TEXT,
  subscriber_relationship TEXT DEFAULT 'self',
  effective_date DATE,
  expiration_date DATE,
  copay_amount DECIMAL(8,2),
  deductible_amount DECIMAL(10,2),
  is_primary BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for medical_records
CREATE POLICY "Patients can view their own medical records" 
ON public.medical_records FOR SELECT 
USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

CREATE POLICY "Staff can manage all medical records" 
ON public.medical_records FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin')));

-- RLS Policies for file_attachments
CREATE POLICY "Patients can view their own files" 
ON public.file_attachments FOR SELECT 
USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()) AND is_patient_visible = true);

CREATE POLICY "Staff can manage all file attachments" 
ON public.file_attachments FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin')));

-- RLS Policies for billing_invoices
CREATE POLICY "Patients can view their own invoices" 
ON public.billing_invoices FOR SELECT 
USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

CREATE POLICY "Staff can manage all invoices" 
ON public.billing_invoices FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin')));

-- RLS Policies for insurance_providers
CREATE POLICY "All authenticated users can view insurance providers" 
ON public.insurance_providers FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Staff can manage insurance providers" 
ON public.insurance_providers FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin')));

-- RLS Policies for patient_insurance
CREATE POLICY "Patients can view their own insurance" 
ON public.patient_insurance FOR SELECT 
USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

CREATE POLICY "Patients can update their own insurance" 
ON public.patient_insurance FOR UPDATE 
USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

CREATE POLICY "Staff can manage all patient insurance" 
ON public.patient_insurance FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin')));

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_medical_records_updated_at
BEFORE UPDATE ON public.medical_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_invoices_updated_at
BEFORE UPDATE ON public.billing_invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_insurance_updated_at
BEFORE UPDATE ON public.patient_insurance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_visit_date ON public.medical_records(visit_date);
CREATE INDEX IF NOT EXISTS idx_file_attachments_patient_id ON public.file_attachments(patient_id);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_patient_id ON public.billing_invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_status ON public.billing_invoices(status);
CREATE INDEX IF NOT EXISTS idx_patient_insurance_patient_id ON public.patient_insurance(patient_id);