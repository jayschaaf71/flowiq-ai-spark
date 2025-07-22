-- Fix critical security definer views (simplified approach)
-- This addresses the 4 ERROR-level security issues from the linter

-- Drop existing security definer views that are causing security issues
DROP VIEW IF EXISTS public.phi_access_summary;
DROP VIEW IF EXISTS public.platform_user_management;
DROP VIEW IF EXISTS public.appointment_availability;
DROP VIEW IF EXISTS public.appointment_analytics;

-- Create secure function replacements with proper RLS enforcement

-- 1. Replace phi_access_summary view with secure function
CREATE OR REPLACE FUNCTION public.get_phi_access_summary()
RETURNS TABLE (
  access_date timestamp with time zone,
  access_count bigint,
  unique_users bigint,
  unique_records bigint,
  table_name text,
  action text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    date_trunc('day', created_at) as access_date,
    count(*) as access_count,
    count(distinct user_id) as unique_users,
    count(distinct record_id) as unique_records,
    table_name,
    action
  FROM public.audit_logs 
  WHERE table_name IN ('patients', 'medical_records', 'sleep_studies', 'prescriptions')
    AND (has_staff_access(auth.uid()) OR is_platform_admin(auth.uid()))
  GROUP BY date_trunc('day', created_at), table_name, action
  ORDER BY access_date DESC;
$$;

-- 2. Replace platform_user_management view with secure function
CREATE OR REPLACE FUNCTION public.get_platform_user_management()
RETURNS TABLE (
  id uuid,
  role app_role,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  current_tenant_id uuid,
  tenant_user_active boolean,
  first_name text,
  last_name text,
  full_name text,
  email text,
  tenant_name text,
  status text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    p.id,
    p.role,
    p.created_at,
    p.updated_at,
    p.current_tenant_id,
    tu.is_active as tenant_user_active,
    p.first_name,
    p.last_name,
    CONCAT(p.first_name, ' ', p.last_name) as full_name,
    p.contact_email as email,
    t.name as tenant_name,
    CASE 
      WHEN tu.is_active THEN 'active'
      ELSE 'inactive'
    END as status
  FROM public.profiles p
  LEFT JOIN public.tenant_users tu ON p.id = tu.user_id
  LEFT JOIN public.tenants t ON tu.tenant_id = t.id
  WHERE is_platform_admin(auth.uid());
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_phi_access_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_platform_user_management() TO authenticated;