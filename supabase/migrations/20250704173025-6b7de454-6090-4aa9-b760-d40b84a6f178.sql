-- Create RLS policies for core database tables (corrected)

-- Enable RLS on the new tables that were created
DO $$ 
BEGIN
  -- Only enable RLS on tables that exist and don't already have it
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medical_records' AND table_schema = 'public') THEN
    ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'billing_invoices' AND table_schema = 'public') THEN
    ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'insurance_providers' AND table_schema = 'public') THEN
    ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patient_insurance' AND table_schema = 'public') THEN
    ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- RLS Policies for medical_records
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medical_records' AND table_schema = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'medical_records' AND policyname = 'Patients can view their own medical records') THEN
      EXECUTE 'CREATE POLICY "Patients can view their own medical records" 
      ON public.medical_records FOR SELECT 
      USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'medical_records' AND policyname = 'Staff can manage all medical records') THEN
      EXECUTE 'CREATE POLICY "Staff can manage all medical records" 
      ON public.medical_records FOR ALL 
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN (''staff'', ''admin'')))';
    END IF;
  END IF;
END $$;

-- RLS Policies for billing_invoices
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'billing_invoices' AND table_schema = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'billing_invoices' AND policyname = 'Patients can view their own invoices') THEN
      EXECUTE 'CREATE POLICY "Patients can view their own invoices" 
      ON public.billing_invoices FOR SELECT 
      USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'billing_invoices' AND policyname = 'Staff can manage all invoices') THEN
      EXECUTE 'CREATE POLICY "Staff can manage all invoices" 
      ON public.billing_invoices FOR ALL 
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN (''staff'', ''admin'')))';
    END IF;
  END IF;
END $$;

-- RLS Policies for insurance_providers
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'insurance_providers' AND table_schema = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'insurance_providers' AND policyname = 'All authenticated users can view insurance providers') THEN
      EXECUTE 'CREATE POLICY "All authenticated users can view insurance providers" 
      ON public.insurance_providers FOR SELECT 
      TO authenticated USING (true)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'insurance_providers' AND policyname = 'Staff can manage insurance providers') THEN
      EXECUTE 'CREATE POLICY "Staff can manage insurance providers" 
      ON public.insurance_providers FOR ALL 
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN (''staff'', ''admin'')))';
    END IF;
  END IF;
END $$;

-- RLS Policies for patient_insurance  
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patient_insurance' AND table_schema = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_insurance' AND policyname = 'Patients can view their own insurance') THEN
      EXECUTE 'CREATE POLICY "Patients can view their own insurance" 
      ON public.patient_insurance FOR SELECT 
      USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_insurance' AND policyname = 'Patients can update their own insurance') THEN
      EXECUTE 'CREATE POLICY "Patients can update their own insurance" 
      ON public.patient_insurance FOR UPDATE 
      USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_insurance' AND policyname = 'Staff can manage all patient insurance') THEN
      EXECUTE 'CREATE POLICY "Staff can manage all patient insurance" 
      ON public.patient_insurance FOR ALL 
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN (''staff'', ''admin'')))';
    END IF;
  END IF;
END $$;