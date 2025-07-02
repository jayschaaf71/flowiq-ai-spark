-- Comprehensive database setup for Dental Sleep IQ
-- Create missing core tables and ensure proper relationships

-- 1. Enhanced patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES auth.users(id),
  tenant_id UUID,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  email TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  insurance_primary_provider TEXT,
  insurance_primary_id TEXT,
  insurance_secondary_provider TEXT,
  insurance_secondary_id TEXT,
  medical_history JSONB DEFAULT '{}',
  current_medications JSONB DEFAULT '[]',
  allergies JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Enhanced providers table
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialty TEXT,
  license_number TEXT,
  npi_number TEXT,
  is_active BOOLEAN DEFAULT true,
  working_hours JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Enhanced tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  settings JSONB DEFAULT '{}',
  subscription_status TEXT DEFAULT 'trial',
  subscription_plan TEXT DEFAULT 'basic',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Enhanced tenant_users table
CREATE TABLE IF NOT EXISTS public.tenant_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'staff',
  is_active BOOLEAN DEFAULT true,
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- 5. Enhanced profiles table updates
DO $$ 
BEGIN
  -- Add tenant_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'tenant_id') THEN
    ALTER TABLE public.profiles ADD COLUMN tenant_id UUID;
  END IF;
  
  -- Add primary_tenant_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'primary_tenant_id') THEN
    ALTER TABLE public.profiles ADD COLUMN primary_tenant_id UUID;
  END IF;
END $$;

-- 6. Referrals table for Referral iQ
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  patient_id UUID REFERENCES public.patients(id),
  referring_physician_id UUID,
  referring_physician_name TEXT NOT NULL,
  referring_physician_email TEXT,
  referring_practice TEXT,
  referral_date DATE NOT NULL DEFAULT CURRENT_DATE,
  referral_reason TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  outcome_summary TEXT,
  outcome_sent_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Prior authorizations table
CREATE TABLE IF NOT EXISTS public.prior_authorizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  patient_id UUID REFERENCES public.patients(id),
  provider_id UUID REFERENCES public.providers(id),
  insurance_provider_id UUID REFERENCES public.insurance_providers(id),
  procedure_codes TEXT[],
  diagnosis_codes TEXT[],
  requested_date DATE NOT NULL DEFAULT CURRENT_DATE,
  authorization_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
  approval_date DATE,
  expiration_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Eligibility verifications table
CREATE TABLE IF NOT EXISTS public.eligibility_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  patient_id UUID REFERENCES public.patients(id),
  insurance_provider_id UUID REFERENCES public.insurance_providers(id),
  verification_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_eligible BOOLEAN,
  coverage_details JSONB DEFAULT '{}',
  copay_amount NUMERIC,
  deductible_amount NUMERIC,
  out_of_pocket_max NUMERIC,
  status TEXT DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'failed')),
  response_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Patient education tracking
CREATE TABLE IF NOT EXISTS public.patient_education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  patient_id UUID REFERENCES public.patients(id),
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'article', 'brochure', 'interactive')),
  content_title TEXT NOT NULL,
  content_url TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completion_percentage INTEGER DEFAULT 0,
  quiz_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Drip campaigns table
CREATE TABLE IF NOT EXISTS public.drip_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('appointment_scheduled', 'post_treatment', 'follow_up', 'manual')),
  target_audience JSONB DEFAULT '{}',
  steps JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prior_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drip_campaigns ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies

-- Patients policies
CREATE POLICY "Tenant users can view patients in their tenant"
  ON public.patients FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage patients in their tenant"
  ON public.patients FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin', 'provider')));

-- Providers policies
CREATE POLICY "Tenant users can view providers in their tenant"
  ON public.providers FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Admins can manage providers in their tenant"
  ON public.providers FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('admin', 'tenant_admin')));

-- Tenant policies
CREATE POLICY "Users can view their assigned tenants"
  ON public.tenants FOR SELECT
  USING (id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Tenant admins can manage their tenant"
  ON public.tenants FOR ALL
  USING (id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role = 'tenant_admin'));

-- Tenant users policies
CREATE POLICY "Users can view tenant membership"
  ON public.tenant_users FOR SELECT
  USING (user_id = auth.uid() OR tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('admin', 'tenant_admin')));

CREATE POLICY "Admins can manage tenant users"
  ON public.tenant_users FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('admin', 'tenant_admin')));

-- Referrals policies
CREATE POLICY "Tenant users can view referrals in their tenant"
  ON public.referrals FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage referrals in their tenant"
  ON public.referrals FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin', 'provider')));

-- Prior authorizations policies
CREATE POLICY "Tenant users can view prior auths in their tenant"
  ON public.prior_authorizations FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage prior auths in their tenant"
  ON public.prior_authorizations FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin', 'provider')));

-- Eligibility verifications policies
CREATE POLICY "Tenant users can view eligibility in their tenant"
  ON public.eligibility_verifications FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage eligibility in their tenant"
  ON public.eligibility_verifications FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin', 'provider')));

-- Patient education policies
CREATE POLICY "Patients can view their education content"
  ON public.patient_education FOR SELECT
  USING (patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()));

CREATE POLICY "Staff can view patient education in their tenant"
  ON public.patient_education FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage patient education in their tenant"
  ON public.patient_education FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin', 'provider')));

-- Drip campaigns policies
CREATE POLICY "Tenant users can view campaigns in their tenant"
  ON public.drip_campaigns FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage campaigns in their tenant"
  ON public.drip_campaigns FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin')));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables that need them
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND column_name = 'updated_at'
          AND table_name IN ('patients', 'providers', 'tenants', 'referrals', 'prior_authorizations', 'drip_campaigns')
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

-- Apply audit triggers to all sensitive tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN ('patients', 'appointments', 'claims', 'referrals', 'prior_authorizations', 'eligibility_verifications', 'patient_education')
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_tenant_id ON public.patients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_patients_profile_id ON public.patients(profile_id);
CREATE INDEX IF NOT EXISTS idx_providers_tenant_id ON public.providers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_providers_user_id ON public.providers(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON public.tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON public.tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_tenant_id ON public.referrals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_referrals_patient_id ON public.referrals(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id ON public.appointments(tenant_id) WHERE tenant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_claims_tenant_id ON public.claims(tenant_id) WHERE tenant_id IS NOT NULL;