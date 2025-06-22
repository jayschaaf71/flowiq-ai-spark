
-- Create tenant management tables
CREATE TABLE public.tenants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  domain text UNIQUE,
  subdomain text UNIQUE,
  brand_name text NOT NULL,
  tagline text,
  logo_url text,
  primary_color text DEFAULT '#3B82F6',
  secondary_color text DEFAULT '#06B6D4',
  specialty text NOT NULL,
  subscription_tier text NOT NULL DEFAULT 'basic',
  max_forms integer DEFAULT 10,
  max_submissions integer DEFAULT 1000,
  max_users integer DEFAULT 5,
  custom_branding_enabled boolean DEFAULT false,
  api_access_enabled boolean DEFAULT false,
  white_label_enabled boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create enhanced user roles enum
DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM (
  'platform_admin',
  'tenant_admin', 
  'practice_manager',
  'staff',
  'patient'
);

-- Create tenant_users junction table for multi-tenant user management
CREATE TABLE public.tenant_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.user_role NOT NULL DEFAULT 'staff',
  permissions jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  invited_by uuid REFERENCES auth.users(id),
  invited_at timestamp with time zone,
  joined_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- Create tenant_settings table for custom configurations
CREATE TABLE public.tenant_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_templates jsonb DEFAULT '{}',
  form_templates jsonb DEFAULT '{}',
  notification_settings jsonb DEFAULT '{}',
  integration_settings jsonb DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  branding_settings jsonb DEFAULT '{}',
  api_keys jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Update profiles table to support tenant relationship
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS primary_tenant_id uuid REFERENCES public.tenants(id),
ADD COLUMN IF NOT EXISTS last_active_tenant_id uuid REFERENCES public.tenants(id);

-- Update intake_forms table to be tenant-aware
ALTER TABLE public.intake_forms 
DROP COLUMN IF EXISTS tenant_type CASCADE,
ADD COLUMN tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Update intake_submissions to be tenant-aware  
ALTER TABLE public.intake_submissions
ADD COLUMN tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX idx_tenant_users_tenant_id ON public.tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_user_id ON public.tenant_users(user_id);
CREATE INDEX idx_intake_forms_tenant_id ON public.intake_forms(tenant_id);
CREATE INDEX idx_intake_submissions_tenant_id ON public.intake_submissions(tenant_id);

-- Create RLS policies for tenant isolation
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

-- Tenant access policies
CREATE POLICY "Platform admins can manage all tenants" 
  ON public.tenants FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users 
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

CREATE POLICY "Tenant admins can view their tenant" 
  ON public.tenants FOR SELECT 
  TO authenticated 
  USING (
    id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND role IN ('tenant_admin', 'practice_manager')
    )
  );

-- Tenant users policies
CREATE POLICY "Users can view their tenant memberships" 
  ON public.tenant_users FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Tenant admins can manage their tenant users" 
  ON public.tenant_users FOR ALL 
  TO authenticated 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND role IN ('tenant_admin', 'practice_manager')
    )
  );

-- Tenant settings policies
CREATE POLICY "Tenant members can view their settings" 
  ON public.tenant_settings FOR SELECT 
  TO authenticated 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Tenant admins can manage their settings" 
  ON public.tenant_settings FOR ALL 
  TO authenticated 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND role IN ('tenant_admin', 'practice_manager')
    )
  );

-- Update existing RLS policies for intake forms and submissions
DROP POLICY IF EXISTS "Users can view intake forms" ON public.intake_forms;
CREATE POLICY "Users can view their tenant's intake forms" 
  ON public.intake_forms FOR SELECT 
  TO authenticated 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Tenant admins can manage their intake forms" 
  ON public.intake_forms FOR ALL 
  TO authenticated 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND role IN ('tenant_admin', 'practice_manager', 'staff')
    )
  );

-- Create helper functions
CREATE OR REPLACE FUNCTION public.get_user_tenant_role(user_uuid uuid, tenant_uuid uuid)
RETURNS public.user_role
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.tenant_users 
  WHERE user_id = user_uuid AND tenant_id = tenant_uuid AND is_active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_user_primary_tenant(user_uuid uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT primary_tenant_id FROM public.profiles WHERE id = user_uuid),
    (SELECT tenant_id FROM public.tenant_users WHERE user_id = user_uuid AND is_active = true LIMIT 1)
  );
$$;

-- Insert default tenants for existing system
INSERT INTO public.tenants (name, slug, brand_name, tagline, specialty, subscription_tier, custom_branding_enabled) VALUES
('FlowIQ Chiropractic', 'chiropractic', 'FlowIQ', 'AI-Powered Chiropractic Practice Management', 'Chiropractic Care', 'enterprise', true),
('FlowIQ Dental', 'dental', 'FlowIQ', 'Smart Dental Practice Solutions', 'Dental Care', 'enterprise', true),
('FlowIQ General', 'general', 'FlowIQ', 'The AI Business Operating System', 'Healthcare', 'professional', false);

-- Create trigger to update tenant_id in related tables when forms are created
CREATE OR REPLACE FUNCTION public.set_tenant_context_on_intake()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set tenant_id based on user's primary tenant
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id := public.get_user_primary_tenant(auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_intake_form_tenant_trigger
  BEFORE INSERT ON public.intake_forms
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_context_on_intake();

CREATE TRIGGER set_intake_submission_tenant_trigger
  BEFORE INSERT ON public.intake_submissions  
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_context_on_intake();

-- Update updated_at triggers
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_settings_updated_at
  BEFORE UPDATE ON public.tenant_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
