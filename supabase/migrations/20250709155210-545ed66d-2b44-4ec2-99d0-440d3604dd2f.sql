-- Create session tracking table for HIPAA compliance
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
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

-- Create session policies
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can manage sessions" ON public.user_sessions
FOR ALL TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active, expires_at);

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