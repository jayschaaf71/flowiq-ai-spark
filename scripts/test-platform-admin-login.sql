-- Test Platform Admin Login
-- This script verifies the platform admin user exists and can authenticate

-- Check if user exists in auth.users
SELECT 
  'Auth User Check:' as test_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ User exists in auth.users'
    ELSE '❌ User not found in auth.users'
  END as result,
  COUNT(*) as user_count
FROM auth.users 
WHERE email = 'platform.admin@flow-iq.ai';

-- Check if profile exists with correct role
SELECT 
  'Profile Check:' as test_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Profile exists with platform_admin role'
    ELSE '❌ Profile not found or wrong role'
  END as result,
  p.role as profile_role,
  p.first_name,
  p.last_name
FROM public.profiles p
WHERE p.contact_email = 'platform.admin@flow-iq.ai';

-- Check if user is linked to tenant
SELECT 
  'Tenant Link Check:' as test_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ User linked to platform tenant'
    ELSE '❌ User not linked to tenant'
  END as result,
  tu.role as tenant_role,
  tu.is_active
FROM public.tenant_users tu
JOIN public.profiles p ON tu.user_id = p.id
WHERE p.contact_email = 'platform.admin@flow-iq.ai';

-- Test password hash (this should work if user exists)
SELECT 
  'Password Test:' as test_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Password hash exists'
    ELSE '❌ No password hash found'
  END as result
FROM auth.users 
WHERE email = 'platform.admin@flow-iq.ai' 
  AND encrypted_password IS NOT NULL 
  AND encrypted_password != '';

-- Show all platform admin users
SELECT 
  'All Platform Admins:' as test_type,
  u.email,
  p.role as profile_role,
  tu.role as tenant_role,
  tu.is_active,
  CASE 
    WHEN u.encrypted_password IS NOT NULL AND u.encrypted_password != '' 
    THEN '✅ Has password'
    ELSE '❌ No password'
  END as password_status
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.tenant_users tu ON u.id = tu.user_id
WHERE p.role = 'platform_admin'; 