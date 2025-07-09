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

-- First remove the default, then update the column type, then set new default
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;

-- Update profiles table to use the new enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE app_role USING role::app_role;

-- Set default role to patient
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'patient'::app_role;

-- Drop and recreate the get_user_role function with new return type
DROP FUNCTION IF EXISTS public.get_user_role(uuid);

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

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
CREATE OR REPLACE FUNCTION public.is_practice_admin(user_id uuid DEFAULT auth.uid(), check_tenant_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.tenant_users tu ON p.id = tu.user_id
    WHERE p.id = user_id 
    AND p.role IN ('practice_admin'::app_role, 'platform_admin'::app_role)
    AND (check_tenant_id IS NULL OR tu.tenant_id = check_tenant_id)
    AND tu.is_active = true
  );
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

-- Create a function to check if user has staff-level access
CREATE OR REPLACE FUNCTION public.has_staff_access(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role IN ('platform_admin'::app_role, 'practice_admin'::app_role, 'practice_manager'::app_role, 'provider'::app_role, 'staff'::app_role)
  FROM public.profiles 
  WHERE id = user_id;
$$;