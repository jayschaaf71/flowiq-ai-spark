-- Create comprehensive HIPAA audit triggers and functions
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
    current_setting('request.headers')::json->>'user-agent',
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for all PHI-containing tables
DROP TRIGGER IF EXISTS audit_patients_trigger ON public.patients;
CREATE TRIGGER audit_patients_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.log_phi_access();

DROP TRIGGER IF EXISTS audit_appointments_trigger ON public.appointments;
CREATE TRIGGER audit_appointments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.log_phi_access();

DROP TRIGGER IF EXISTS audit_medical_records_trigger ON public.medical_records;
CREATE TRIGGER audit_medical_records_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.medical_records
  FOR EACH ROW EXECUTE FUNCTION public.log_phi_access();

DROP TRIGGER IF EXISTS audit_prescriptions_trigger ON public.prescriptions;
CREATE TRIGGER audit_prescriptions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.log_phi_access();

DROP TRIGGER IF EXISTS audit_medical_conditions_trigger ON public.medical_conditions;
CREATE TRIGGER audit_medical_conditions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.medical_conditions
  FOR EACH ROW EXECUTE FUNCTION public.log_phi_access();

-- Create session tracking table for HIPAA compliance
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text NOT NULL,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  last_activity timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  is_active boolean DEFAULT true,
  logout_reason text
);

-- Enable RLS on user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- System can manage sessions
CREATE POLICY "System can manage sessions" ON public.user_sessions
FOR ALL TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE public.user_sessions 
  SET is_active = false, logout_reason = 'expired'
  WHERE expires_at < now() AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create PHI access summary view for compliance reporting
CREATE OR REPLACE VIEW public.phi_access_summary AS
SELECT 
  DATE(created_at) as access_date,
  table_name,
  action,
  COUNT(*) as access_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT record_id) as unique_records
FROM public.audit_logs 
WHERE table_name IN ('patients', 'medical_records', 'prescriptions', 'medical_conditions', 'appointments')
GROUP BY DATE(created_at), table_name, action
ORDER BY access_date DESC;

-- Ensure audit logs cannot be modified (HIPAA requirement)
ALTER TABLE public.audit_logs DROP POLICY IF EXISTS "Staff can view all audit logs";
ALTER TABLE public.audit_logs DROP POLICY IF EXISTS "System can insert audit logs";

-- Create new restrictive policies
CREATE POLICY "Staff can view audit logs" ON public.audit_logs
FOR SELECT TO authenticated
USING (get_user_role(auth.uid()) = 'staff');

CREATE POLICY "System can insert audit logs only" ON public.audit_logs
FOR INSERT TO authenticated
WITH CHECK (true);

-- NO UPDATE OR DELETE allowed on audit logs for HIPAA compliance