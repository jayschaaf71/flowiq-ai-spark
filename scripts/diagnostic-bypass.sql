-- Diagnostic Script (Bypasses Role Checks)
-- This script checks what's actually in the database without role restrictions

-- 1. Check what tables exist
SELECT 
  'Table Existence Check:' as check_type,
  table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t.table_name) 
    THEN '✅ Exists'
    ELSE '❌ Missing'
  END as status
FROM (VALUES 
  ('tenants'),
  ('profiles'),
  ('platform_alerts'),
  ('platform_performance'),
  ('platform_revenue'),
  ('system_metrics'),
  ('tenant_usage_metrics'),
  ('system_monitoring'),
  ('system_alerts'),
  ('subscriptions'),
  ('payments')
) AS t(table_name);

-- 2. Check actual data in key tables
SELECT 
  'Tenants Data:' as check_type,
  COUNT(*) as total_tenants,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_tenants
FROM public.tenants;

SELECT 
  'Profiles Data:' as check_type,
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'platform_admin' THEN 1 END) as platform_admins,
  COUNT(CASE WHEN role = 'practice_admin' THEN 1 END) as practice_admins
FROM public.profiles;

-- 3. Check if platform_performance table has data
SELECT 
  'Platform Performance Data:' as check_type,
  COUNT(*) as performance_records,
  AVG(response_time_ms) as avg_response_time,
  AVG(cpu_usage_percent) as avg_cpu_usage
FROM public.platform_performance;

-- 4. Check if platform_revenue table has data
SELECT 
  'Platform Revenue Data:' as check_type,
  COUNT(*) as revenue_records,
  COALESCE(SUM(amount), 0) as total_revenue
FROM public.platform_revenue;

-- 5. Check if platform_alerts table has data
SELECT 
  'Platform Alerts Data:' as check_type,
  COUNT(*) as total_alerts,
  COUNT(CASE WHEN severity = 'critical' AND status = 'active' THEN 1 END) as critical_alerts
FROM public.platform_alerts;

-- 6. Check if new tables exist (from our implementation)
SELECT 
  'New Tables Check:' as check_type,
  table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t.table_name) 
    THEN '✅ Exists'
    ELSE '❌ Missing'
  END as status
FROM (VALUES 
  ('system_monitoring'),
  ('system_alerts'),
  ('subscriptions'),
  ('payments')
) AS t(table_name);

-- 7. Check if functions exist
SELECT 
  'Function Existence:' as check_type,
  function_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = f.function_name) 
    THEN '✅ Exists'
    ELSE '❌ Missing'
  END as status
FROM (VALUES 
  ('get_platform_stats'),
  ('get_enhanced_platform_stats'),
  ('insert_system_metrics'),
  ('generate_system_alert'),
  ('calculate_monthly_revenue')
) AS f(function_name);

-- 8. Show all users and their roles
SELECT 
  'User Roles:' as check_type,
  u.email,
  p.role,
  p.first_name,
  p.last_name
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
ORDER BY p.role, u.email; 