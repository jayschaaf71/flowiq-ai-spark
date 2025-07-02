-- Create basic audit triggers and system functions for HIPAA compliance
-- This migration only works with existing tables and columns

-- Enhanced audit triggers for HIPAA compliance
CREATE OR REPLACE FUNCTION public.enhanced_audit_trigger()
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

-- Apply audit triggers to existing sensitive tables
DROP TRIGGER IF EXISTS audit_appointments ON public.appointments;
CREATE TRIGGER audit_appointments
    AFTER INSERT OR UPDATE OR DELETE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.enhanced_audit_trigger();

DROP TRIGGER IF EXISTS audit_claims ON public.claims;
CREATE TRIGGER audit_claims
    AFTER INSERT OR UPDATE OR DELETE ON public.claims
    FOR EACH ROW
    EXECUTE FUNCTION public.enhanced_audit_trigger();

DROP TRIGGER IF EXISTS audit_patients ON public.patients;
CREATE TRIGGER audit_patients
    AFTER INSERT OR UPDATE OR DELETE ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION public.enhanced_audit_trigger();

-- Create updated_at triggers for existing tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to existing tables with updated_at columns
DROP TRIGGER IF EXISTS update_patients_updated_at ON public.patients;
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_providers_updated_at ON public.providers;
CREATE TRIGGER update_providers_updated_at
    BEFORE UPDATE ON public.providers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tenants_updated_at ON public.tenants;
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create sample data for testing (optional)
INSERT INTO public.tenants (name, subdomain, settings) 
VALUES ('Demo Dental Sleep Practice', 'demo-dental-sleep', '{"specialty": "dental_sleep", "features": ["auth_iq", "claims_iq", "appointment_iq", "education_iq", "referral_iq", "scribe_iq"]}')
ON CONFLICT (subdomain) DO NOTHING;

-- Create a sample provider
INSERT INTO public.providers (first_name, last_name, specialty, license_number, npi_number)
VALUES ('Dr. Sarah', 'Johnson', 'Dental Sleep Medicine', 'DDS123456', '1234567890')
ON CONFLICT DO NOTHING;