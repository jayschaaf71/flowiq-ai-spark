
-- Create audit log table for compliance tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT')),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy for audit logs - only admin can view
CREATE POLICY "Admin can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create provider assignments table
CREATE TABLE IF NOT EXISTS public.provider_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  is_primary BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on provider assignments
ALTER TABLE public.provider_assignments ENABLE ROW LEVEL SECURITY;

-- Policy for provider assignments
CREATE POLICY "Staff can manage provider assignments" ON public.provider_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

-- Enable realtime for key tables
ALTER TABLE public.patients REPLICA IDENTITY FULL;
ALTER TABLE public.medical_history REPLICA IDENTITY FULL;
ALTER TABLE public.medications REPLICA IDENTITY FULL;
ALTER TABLE public.file_attachments REPLICA IDENTITY FULL;
ALTER TABLE public.soap_notes REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medical_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.file_attachments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.soap_notes;

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    table_name,
    record_id,
    action,
    old_values,
    new_values,
    ip_address,
    session_id
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    inet_client_addr(),
    current_setting('request.jwt.claims', true)::jsonb->>'session_id'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to key tables
DROP TRIGGER IF EXISTS audit_patients ON public.patients;
CREATE TRIGGER audit_patients
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_medical_history ON public.medical_history;
CREATE TRIGGER audit_medical_history
  AFTER INSERT OR UPDATE OR DELETE ON public.medical_history
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_medications ON public.medications;
CREATE TRIGGER audit_medications
  AFTER INSERT OR UPDATE OR DELETE ON public.medications
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_soap_notes ON public.soap_notes;
CREATE TRIGGER audit_soap_notes
  AFTER INSERT OR UPDATE OR DELETE ON public.soap_notes
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
