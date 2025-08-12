-- Check Platform Admin User Status
-- This script verifies if the platform admin user exists and has correct permissions

-- Check if platform admin user exists in auth.users
SELECT 
  'Auth Users Check:' as check_type,
  email,
  role as auth_role,
  created_at
FROM auth.users 
WHERE email = 'platform.admin@flow-iq.ai';

-- Check if platform admin profile exists
SELECT 
  'Profile Check:' as check_type,
  contact_email,
  role as profile_role,
  first_name,
  last_name
FROM public.profiles 
WHERE contact_email = 'platform.admin@flow-iq.ai';

-- Check if platform admin is linked to tenant
SELECT 
  'Tenant Users Check:' as check_type,
  tu.role as tenant_role,
  tu.is_active,
  tu.joined_at
FROM public.tenant_users tu
JOIN public.profiles p ON tu.user_id = p.id
WHERE p.contact_email = 'platform.admin@flow-iq.ai';

-- Check all users with platform_admin role
SELECT 
  'All Platform Admins:' as check_type,
  u.email,
  p.role as profile_role,
  tu.role as tenant_role,
  tu.is_active
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.tenant_users tu ON u.id = tu.user_id
WHERE p.role = 'platform_admin';

-- Show platform admin credentials (if user exists)
SELECT 
  'Platform Admin Credentials:' as info_type,
  'platform.admin@flow-iq.ai' as email,
  'PlatformAdmin2024!' as password,
  'Use these credentials to login' as note; 