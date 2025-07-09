-- Create enum for application roles
CREATE TYPE public.app_role AS ENUM (
  'platform_admin',    -- FlowIQ personnel managing the overall application
  'practice_admin',    -- Admin for a specific practice/tenant
  'practice_manager',  -- Manager role within a practice
  'provider',          -- Medical providers
  'staff',            -- General staff members
  'billing',          -- Billing specialists
  'patient'           -- Patients
);

-- Update profiles table to use the new enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE app_role USING role::app_role;

-- Set default role to patient
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'patient'::app_role;

-- Create a function to check if user has platform admin privileges
CREATE OR REPLACE FUNCTION public.is_platform_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'platform_admin'::app_role
  );
$$;

-- Create a function to check if user has practice admin privileges for a tenant
CREATE OR REPLACE FUNCTION public.is_practice_admin(user_id uuid DEFAULT auth.uid(), tenant_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.tenant_users tu ON p.id = tu.user_id
    WHERE p.id = user_id 
    AND p.role IN ('practice_admin'::app_role, 'platform_admin'::app_role)
    AND (tenant_id IS NULL OR tu.tenant_id = $2)
    AND tu.is_active = true
  );
$$;

-- Update the existing get_user_role function to return the enum
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create a function to check if user can access platform admin features
CREATE OR REPLACE FUNCTION public.can_access_platform_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role = 'platform_admin'::app_role 
  FROM public.profiles 
  WHERE id = user_id;
$$;

-- Update tenant_users RLS policies to handle the new role system
DROP POLICY IF EXISTS "Users can view their tenant memberships" ON public.tenant_users;
DROP POLICY IF EXISTS "Tenant owners can manage users" ON public.tenant_users;
DROP POLICY IF EXISTS "Users can join tenants when invited" ON public.tenant_users;

-- Create new policies for tenant_users
CREATE POLICY "Users can view their tenant memberships" 
ON public.tenant_users FOR SELECT 
USING (
  user_id = auth.uid() OR 
  is_platform_admin() OR 
  is_practice_admin(auth.uid(), tenant_id)
);

CREATE POLICY "Platform and practice admins can manage tenant users" 
ON public.tenant_users FOR ALL 
USING (
  is_platform_admin() OR 
  is_practice_admin(auth.uid(), tenant_id) OR
  (tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid()))
);

CREATE POLICY "Users can join tenants when invited" 
ON public.tenant_users FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Update some key RLS policies to use the new role system
CREATE OR REPLACE FUNCTION public.has_staff_access(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role IN ('platform_admin'::app_role, 'practice_admin'::app_role, 'practice_manager'::app_role, 'provider'::app_role, 'staff'::app_role)
  FROM public.profiles 
  WHERE id = user_id;
$$;