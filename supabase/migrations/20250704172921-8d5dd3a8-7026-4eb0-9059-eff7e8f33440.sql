-- Create RLS policies for core database tables (part 2)

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