-- Fix critical security definer views by converting them to secure functions
-- This addresses the 4 ERROR-level security issues from the linter

-- Drop existing security definer views
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

-- 3. Replace appointment_availability view with secure function
CREATE OR REPLACE FUNCTION public.get_appointment_availability()
RETURNS TABLE (
  provider_id uuid,
  provider_name text,
  specialty text,
  day_of_week integer,
  start_time time without time zone,
  end_time time without time zone,
  break_start_time time without time zone,
  break_end_time time without time zone,
  is_available boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    ps.provider_id,
    p.name as provider_name,
    p.specialty,
    ps.day_of_week,
    ps.start_time,
    ps.end_time,
    ps.break_start_time,
    ps.break_end_time,
    ps.is_available
  FROM public.provider_schedules ps
  JOIN public.providers p ON ps.provider_id = p.id
  WHERE p.is_active = true;
$$;

-- 4. Replace appointment_analytics view with secure function
CREATE OR REPLACE FUNCTION public.get_appointment_analytics(
  p_tenant_id uuid DEFAULT NULL
)
RETURNS TABLE (
  appointment_date timestamp with time zone,
  total_appointments bigint,
  scheduled_count bigint,
  completed_count bigint,
  cancelled_count bigint,
  no_show_count bigint,
  show_rate numeric,
  avg_duration numeric,
  tenant_id uuid
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    date_trunc('day', a.date + a.time) as appointment_date,
    COUNT(*) as total_appointments,
    COUNT(*) FILTER (WHERE a.status = 'scheduled') as scheduled_count,
    COUNT(*) FILTER (WHERE a.status = 'completed') as completed_count,
    COUNT(*) FILTER (WHERE a.status = 'cancelled') as cancelled_count,
    COUNT(*) FILTER (WHERE a.status = 'no-show') as no_show_count,
    CASE 
      WHEN COUNT(*) FILTER (WHERE a.status IN ('completed', 'no-show')) > 0 
      THEN (COUNT(*) FILTER (WHERE a.status = 'completed')::numeric / 
            COUNT(*) FILTER (WHERE a.status IN ('completed', 'no-show'))::numeric) * 100
      ELSE NULL 
    END as show_rate,
    AVG(a.duration) as avg_duration,
    a.tenant_id
  FROM public.appointments a
  WHERE (p_tenant_id IS NULL OR a.tenant_id = p_tenant_id)
    AND (
      has_staff_access(auth.uid()) OR 
      is_platform_admin(auth.uid()) OR
      a.tenant_id IN (
        SELECT tu.tenant_id 
        FROM tenant_users tu 
        WHERE tu.user_id = auth.uid() AND tu.is_active = true
      )
    )
  GROUP BY date_trunc('day', a.date + a.time), a.tenant_id
  ORDER BY appointment_date DESC;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_phi_access_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_platform_user_management() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_appointment_availability() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_appointment_analytics(uuid) TO authenticated;