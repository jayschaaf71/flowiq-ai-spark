-- Check Platform Admin Functionality
-- This script verifies what's actually working vs mock data

-- 1. Check if platform_stats function works
SELECT 
  'Platform Stats Function:' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_platform_stats') 
    THEN '✅ Function exists'
    ELSE '❌ Function missing'
  END as status;

-- 2. Check if we can call the function (this will show real data)
SELECT 
  'Real Platform Stats:' as check_type,
  get_platform_stats() as stats_data;

-- 3. Check what tables exist and have data
SELECT 
  'Database Tables Status:' as check_type,
  table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t.table_name) 
    THEN '✅ Exists'
    ELSE '❌ Missing'
  END as table_exists,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t.table_name) 
    THEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = t.table_name)
    ELSE 0
  END as row_count
FROM (VALUES 
  ('tenants'),
  ('profiles'),
  ('platform_alerts'),
  ('platform_performance'),
  ('platform_revenue'),
  ('system_metrics'),
  ('tenant_usage_metrics')
) AS t(table_name);

-- 4. Check actual tenant data
SELECT 
  'Real Tenant Data:' as check_type,
  COUNT(*) as total_tenants,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_tenants
FROM public.tenants;

-- 5. Check actual user data
SELECT 
  'Real User Data:' as check_type,
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'platform_admin' THEN 1 END) as platform_admins,
  COUNT(CASE WHEN role = 'practice_admin' THEN 1 END) as practice_admins
FROM public.profiles;

-- 6. Check if alerts table has real data
SELECT 
  'Real Alert Data:' as check_type,
  COUNT(*) as total_alerts,
  COUNT(CASE WHEN severity = 'critical' AND status = 'active' THEN 1 END) as critical_alerts
FROM public.platform_alerts;

-- 7. Check if performance metrics exist
SELECT 
  'Real Performance Data:' as check_type,
  COUNT(*) as performance_records,
  AVG(response_time_ms) as avg_response_time,
  AVG(cpu_usage_percent) as avg_cpu_usage
FROM public.platform_performance;

-- 8. Check if revenue data exists
SELECT 
  'Real Revenue Data:' as check_type,
  COUNT(*) as revenue_records,
  COALESCE(SUM(amount), 0) as total_revenue
FROM public.platform_revenue; 