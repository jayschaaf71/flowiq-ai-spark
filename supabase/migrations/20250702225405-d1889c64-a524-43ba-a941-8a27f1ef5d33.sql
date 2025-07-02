-- Simple audit and security setup for existing tables only

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

-- Apply audit triggers to critical existing tables
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

-- Update existing profiles table to support roles if column doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role' AND table_schema = 'public') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'patient';
  END IF;
END $$;

-- Create basic sample data for testing AI agents
-- Insert into intake_forms if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'intake_forms' AND table_schema = 'public') THEN
    INSERT INTO public.intake_forms (title, description, form_fields, is_active)
    VALUES 
    ('Dental Sleep Medicine Intake', 'Comprehensive intake form for sleep apnea patients', 
     '[{"type": "text", "label": "Patient Name", "required": true}, {"type": "email", "label": "Email", "required": true}, {"type": "phone", "label": "Phone", "required": true}]', 
     true)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Insert into appointment_types if table exists  
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointment_types' AND table_schema = 'public') THEN
    INSERT INTO public.appointment_types (name, duration_minutes, specialty, description)
    VALUES 
    ('Sleep Study Consultation', 60, 'Dental Sleep Medicine', 'Initial consultation for sleep apnea'),
    ('Appliance Fitting', 30, 'Dental Sleep Medicine', 'Oral appliance fitting appointment'),
    ('Follow-up Visit', 30, 'Dental Sleep Medicine', 'Follow-up after treatment')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Insert into billing_codes if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'billing_codes' AND table_schema = 'public') THEN
    INSERT INTO public.billing_codes (code, code_type, description, default_fee, specialty)
    VALUES 
    ('D0150', 'CDT', 'Comprehensive oral evaluation', 200.00, 'Dental Sleep Medicine'),
    ('D5999', 'CDT', 'Unspecified removable prosthetic procedure', 1500.00, 'Dental Sleep Medicine'),
    ('E0486', 'HCPCS', 'Oral device/appliance for sleep apnea', 2000.00, 'Dental Sleep Medicine')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;