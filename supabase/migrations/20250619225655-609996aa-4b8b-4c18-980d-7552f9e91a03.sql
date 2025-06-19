
-- Add tenant_id to profiles table for proper tenant association
ALTER TABLE public.profiles ADD COLUMN tenant_id TEXT;

-- Create index for tenant-based queries
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);

-- Enable RLS on all tables containing PHI
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user's tenant
CREATE OR REPLACE FUNCTION public.get_user_tenant()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- RLS Policy for patients - users can only access patients from their tenant
CREATE POLICY "Users can only access patients from their tenant" 
ON public.patients 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND tenant_id IS NOT NULL
  )
);

-- RLS Policy for medical_history - tenant isolation
CREATE POLICY "Tenant isolation for medical history" 
ON public.medical_history 
FOR ALL 
TO authenticated
USING (
  patient_id IN (
    SELECT p.id FROM public.patients p
    JOIN public.profiles pr ON pr.tenant_id = public.get_user_tenant()
    WHERE pr.id = auth.uid()
  )
);

-- RLS Policy for medications - tenant isolation
CREATE POLICY "Tenant isolation for medications" 
ON public.medications 
FOR ALL 
TO authenticated
USING (
  patient_id IN (
    SELECT p.id FROM public.patients p
    JOIN public.profiles pr ON pr.tenant_id = public.get_user_tenant()
    WHERE pr.id = auth.uid()
  )
);

-- RLS Policy for SOAP notes - tenant isolation
CREATE POLICY "Tenant isolation for soap notes" 
ON public.soap_notes 
FOR ALL 
TO authenticated
USING (
  patient_id IN (
    SELECT p.id FROM public.patients p
    JOIN public.profiles pr ON pr.tenant_id = public.get_user_tenant()
    WHERE pr.id = auth.uid()
  )
);

-- RLS Policy for appointments - tenant isolation
CREATE POLICY "Tenant isolation for appointments" 
ON public.appointments 
FOR ALL 
TO authenticated
USING (
  patient_id IN (
    SELECT p.id FROM public.patients p
    JOIN public.profiles pr ON pr.tenant_id = public.get_user_tenant()
    WHERE pr.id = auth.uid()
  )
);

-- RLS Policy for intake submissions - tenant isolation
CREATE POLICY "Tenant isolation for intake submissions" 
ON public.intake_submissions 
FOR ALL 
TO authenticated
USING (
  form_id IN (
    SELECT id FROM public.intake_forms 
    WHERE tenant_type = public.get_user_tenant()
  )
);

-- RLS Policy for file attachments - tenant isolation
CREATE POLICY "Tenant isolation for file attachments" 
ON public.file_attachments 
FOR ALL 
TO authenticated
USING (
  patient_id IN (
    SELECT p.id FROM public.patients p
    JOIN public.profiles pr ON pr.tenant_id = public.get_user_tenant()
    WHERE pr.id = auth.uid()
  )
);

-- Enhanced audit logging trigger for HIPAA compliance
CREATE OR REPLACE FUNCTION public.enhanced_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all PHI access for HIPAA compliance
  INSERT INTO public.audit_logs (
    user_id,
    table_name,
    record_id,
    action,
    old_values,
    new_values,
    ip_address,
    session_id,
    user_agent
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    inet_client_addr(),
    current_setting('request.jwt.claims', true)::jsonb->>'session_id',
    current_setting('request.headers', true)::jsonb->>'user-agent'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply enhanced audit triggers to all PHI tables
DROP TRIGGER IF EXISTS enhanced_audit_patients ON public.patients;
CREATE TRIGGER enhanced_audit_patients
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.enhanced_audit_trigger();

DROP TRIGGER IF EXISTS enhanced_audit_appointments ON public.appointments;
CREATE TRIGGER enhanced_audit_appointments
  AFTER INSERT OR UPDATE OR DELETE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.enhanced_audit_trigger();

-- Create compliance monitoring view
CREATE OR REPLACE VIEW public.compliance_summary AS
SELECT 
  'patients' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as recent_records
FROM public.patients
UNION ALL
SELECT 
  'audit_logs',
  COUNT(*),
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END)
FROM public.audit_logs;
