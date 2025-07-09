-- Create comprehensive HIPAA audit triggers and functions (Fixed syntax)
-- These ensure all PHI access is automatically logged for compliance

-- Function to automatically log PHI access
CREATE OR REPLACE FUNCTION public.log_phi_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log any access to sensitive patient data
  INSERT INTO public.audit_logs (
    table_name,
    action,
    record_id,
    user_id,
    old_values,
    new_values,
    user_agent,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.id::text, OLD.id::text),
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown'),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for all PHI-containing tables
CREATE TRIGGER audit_patients_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.log_phi_access();

CREATE TRIGGER audit_appointments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.log_phi_access();

CREATE TRIGGER audit_medical_records_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.medical_records
  FOR EACH ROW EXECUTE FUNCTION public.log_phi_access();

CREATE TRIGGER audit_prescriptions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.log_phi_access();

CREATE TRIGGER audit_medical_conditions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.medical_conditions
  FOR EACH ROW EXECUTE FUNCTION public.log_phi_access();