-- Apply RLS policies only to tables that exist and have tenant_id columns
-- First, create audit triggers and performance indexes

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables that have updated_at column
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND column_name = 'updated_at'
          AND table_name IN ('patients', 'providers', 'tenants', 'referrals', 'prior_authorizations', 'drip_campaigns', 'soap_notes', 'payer_connections')
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%s_updated_at ON public.%s;
            CREATE TRIGGER update_%s_updated_at
                BEFORE UPDATE ON public.%s
                FOR EACH ROW
                EXECUTE FUNCTION public.update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END $$;

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

-- Apply audit triggers to sensitive tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN ('patients', 'appointments', 'claims', 'referrals', 'prior_authorizations', 'eligibility_verifications', 'patient_education', 'soap_notes')
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS audit_%s ON public.%s;
            CREATE TRIGGER audit_%s
                AFTER INSERT OR UPDATE OR DELETE ON public.%s
                FOR EACH ROW
                EXECUTE FUNCTION public.enhanced_audit_trigger();
        ', t, t, t, t);
    END LOOP;
END $$;

-- Create performance indexes for existing tables
CREATE INDEX IF NOT EXISTS idx_patients_tenant_id ON public.patients(tenant_id) WHERE tenant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_patients_profile_id ON public.patients(profile_id) WHERE profile_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_providers_tenant_id ON public.providers(tenant_id) WHERE tenant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_providers_user_id ON public.providers(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON public.tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON public.tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id ON public.appointments(tenant_id) WHERE tenant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_claims_tenant_id ON public.claims(tenant_id) WHERE tenant_id IS NOT NULL;