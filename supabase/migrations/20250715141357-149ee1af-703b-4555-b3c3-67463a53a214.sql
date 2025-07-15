-- Comprehensive security fixes for Supabase database - Part 2

-- Fix the views without SECURITY INVOKER syntax (recreate them properly)
DROP VIEW IF EXISTS public.phi_access_summary;
CREATE VIEW public.phi_access_summary 
AS
SELECT 
  date_trunc('day', created_at) as access_date,
  count(*) as access_count,
  count(distinct user_id) as unique_users,
  count(distinct record_id) as unique_records,
  table_name,
  action
FROM public.audit_logs 
WHERE table_name IN ('patients', 'medical_records', 'sleep_studies', 'prescriptions')
GROUP BY date_trunc('day', created_at), table_name, action
ORDER BY access_date DESC;

DROP VIEW IF EXISTS public.platform_user_management;
CREATE VIEW public.platform_user_management
AS
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
LEFT JOIN public.tenants t ON tu.tenant_id = t.id;