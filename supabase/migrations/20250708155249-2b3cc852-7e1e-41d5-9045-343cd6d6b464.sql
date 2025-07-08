-- Create comprehensive multi-tenant infrastructure with HIPAA compliance

-- Create tenants table for practice isolation
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  specialty TEXT NOT NULL,
  practice_type TEXT NOT NULL,
  owner_id UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Business information
  business_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  
  -- Branding
  primary_color TEXT DEFAULT '#06b6d4',
  secondary_color TEXT DEFAULT '#22d3ee',
  logo_url TEXT,
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  CONSTRAINT valid_subdomain CHECK (subdomain ~* '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'),
  CONSTRAINT subdomain_length CHECK (char_length(subdomain) >= 3 AND char_length(subdomain) <= 50)
);

-- Create tenant_users table for user-tenant relationships
CREATE TABLE public.tenant_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  invited_by UUID,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(tenant_id, user_id),
  CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'staff', 'provider'))
);

-- Add tenant_id to all existing tables for data isolation
ALTER TABLE public.patients ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.appointments ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.providers ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.team_members ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.intake_forms ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.intake_submissions ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.medical_records ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.medical_conditions ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.prescriptions ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.claims ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.patient_insurance ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.patient_checkins ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.file_attachments ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.communication_logs ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.patient_notifications ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.provider_notifications ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.provider_schedules ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.appointment_waitlist ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.reminder_logs ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.audit_logs ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.sms_templates ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.email_templates ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Add tenant_id to profiles table and update it to track user's current tenant
ALTER TABLE public.profiles ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN current_tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX idx_tenants_subdomain ON public.tenants(subdomain);
CREATE INDEX idx_tenants_owner ON public.tenants(owner_id);
CREATE INDEX idx_tenant_users_tenant ON public.tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_user ON public.tenant_users(user_id);

-- Add tenant_id indexes to all tables for HIPAA compliance and performance
CREATE INDEX idx_patients_tenant ON public.patients(tenant_id);
CREATE INDEX idx_appointments_tenant ON public.appointments(tenant_id);
CREATE INDEX idx_providers_tenant ON public.providers(tenant_id);
CREATE INDEX idx_team_members_tenant ON public.team_members(tenant_id);
CREATE INDEX idx_intake_forms_tenant ON public.intake_forms(tenant_id);
CREATE INDEX idx_intake_submissions_tenant ON public.intake_submissions(tenant_id);
CREATE INDEX idx_medical_records_tenant ON public.medical_records(tenant_id);
CREATE INDEX idx_medical_conditions_tenant ON public.medical_conditions(tenant_id);
CREATE INDEX idx_prescriptions_tenant ON public.prescriptions(tenant_id);
CREATE INDEX idx_claims_tenant ON public.claims(tenant_id);
CREATE INDEX idx_patient_insurance_tenant ON public.patient_insurance(tenant_id);
CREATE INDEX idx_patient_checkins_tenant ON public.patient_checkins(tenant_id);
CREATE INDEX idx_file_attachments_tenant ON public.file_attachments(tenant_id);
CREATE INDEX idx_communication_logs_tenant ON public.communication_logs(tenant_id);
CREATE INDEX idx_patient_notifications_tenant ON public.patient_notifications(tenant_id);
CREATE INDEX idx_provider_notifications_tenant ON public.provider_notifications(tenant_id);
CREATE INDEX idx_provider_schedules_tenant ON public.provider_schedules(tenant_id);
CREATE INDEX idx_appointment_waitlist_tenant ON public.appointment_waitlist(tenant_id);
CREATE INDEX idx_reminder_logs_tenant ON public.reminder_logs(tenant_id);
CREATE INDEX idx_audit_logs_tenant ON public.audit_logs(tenant_id);
CREATE INDEX idx_sms_templates_tenant ON public.sms_templates(tenant_id);
CREATE INDEX idx_email_templates_tenant ON public.email_templates(tenant_id);

-- Enable RLS on tenant tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;

-- Create function to get user's current tenant
CREATE OR REPLACE FUNCTION public.get_user_current_tenant(user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT current_tenant_id FROM public.profiles WHERE id = user_id;
$$;

-- Create function to check if user belongs to tenant
CREATE OR REPLACE FUNCTION public.user_belongs_to_tenant(user_id uuid, tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_users 
    WHERE user_id = $1 AND tenant_id = $2 AND is_active = true
  );
$$;

-- Create RLS policies for tenants table
CREATE POLICY "Users can view tenants they belong to" ON public.tenants
FOR SELECT
USING (
  id IN (
    SELECT tenant_id FROM public.tenant_users 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Users can update tenants they own" ON public.tenants
FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can create tenants" ON public.tenants
FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- Create RLS policies for tenant_users table
CREATE POLICY "Users can view their tenant memberships" ON public.tenant_users
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Tenant owners can manage users" ON public.tenant_users
FOR ALL
USING (
  tenant_id IN (
    SELECT id FROM public.tenants WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can join tenants when invited" ON public.tenant_users
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Update existing RLS policies to include tenant isolation
-- This ensures HIPAA compliance by isolating data per tenant

-- Update patients policies
DROP POLICY IF EXISTS "Staff can manage patients" ON public.patients;
DROP POLICY IF EXISTS "Staff can view all patients" ON public.patients;
DROP POLICY IF EXISTS "Users can view their own patient record" ON public.patients;

CREATE POLICY "Users can manage patients in their tenant" ON public.patients
FOR ALL
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users 
    WHERE user_id = auth.uid() AND is_active = true
  ) AND get_user_role(auth.uid()) = 'staff'
);

CREATE POLICY "Patients can view their own record" ON public.patients
FOR SELECT
USING (auth.uid() = id);

-- Update appointments policies
DROP POLICY IF EXISTS "Staff can manage appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;

CREATE POLICY "Users can manage appointments in their tenant" ON public.appointments
FOR ALL
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users 
    WHERE user_id = auth.uid() AND is_active = true
  ) AND get_user_role(auth.uid()) = 'staff'
);

CREATE POLICY "Patients can view their own appointments" ON public.appointments
FOR SELECT
USING (auth.uid() = patient_id);

-- Create trigger to automatically set tenant_id on inserts
CREATE OR REPLACE FUNCTION public.set_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id := get_user_current_tenant(auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers to ensure tenant_id is always set
CREATE TRIGGER set_tenant_id_patients
  BEFORE INSERT ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_appointments
  BEFORE INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_providers
  BEFORE INSERT ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

-- Create function to handle tenant creation during onboarding
CREATE OR REPLACE FUNCTION public.create_tenant_from_onboarding(
  p_name TEXT,
  p_subdomain TEXT,
  p_specialty TEXT,
  p_practice_type TEXT,
  p_business_name TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tenant_id UUID;
  v_user_id UUID;
BEGIN
  -- Get the current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Create the tenant
  INSERT INTO public.tenants (
    name, subdomain, specialty, practice_type, owner_id,
    business_name, address, phone, email
  ) VALUES (
    p_name, p_subdomain, p_specialty, p_practice_type, v_user_id,
    p_business_name, p_address, p_phone, p_email
  ) RETURNING id INTO v_tenant_id;
  
  -- Add the user as the owner
  INSERT INTO public.tenant_users (tenant_id, user_id, role, joined_at)
  VALUES (v_tenant_id, v_user_id, 'owner', now());
  
  -- Update the user's profile to set current tenant
  UPDATE public.profiles 
  SET current_tenant_id = v_tenant_id, tenant_id = v_tenant_id
  WHERE id = v_user_id;
  
  RETURN v_tenant_id;
END;
$$;

-- Update the updated_at trigger function for tenants
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tenant_users_updated_at
  BEFORE UPDATE ON public.tenant_users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();