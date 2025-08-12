-- Simple Platform Admin Test
-- This script checks if the platform admin user exists and has correct setup

-- 1. Check if user exists in auth.users
SELECT 
  'User exists in auth.users' as check_type,
  email,
  created_at
FROM auth.users 
WHERE email = 'platform.admin@flow-iq.ai';

-- 2. Check if profile exists
SELECT 
  'Profile exists' as check_type,
  contact_email,
  role,
  first_name,
  last_name
FROM public.profiles 
WHERE contact_email = 'platform.admin@flow-iq.ai';

-- 3. Check if user has password
SELECT 
  'User has password' as check_type,
  email,
  CASE 
    WHEN encrypted_password IS NOT NULL AND encrypted_password != '' 
    THEN 'Yes'
    ELSE 'No'
  END as has_password
FROM auth.users 
WHERE email = 'platform.admin@flow-iq.ai';

-- 4. Check tenant link
SELECT 
  'Tenant link' as check_type,
  tu.role as tenant_role,
  tu.is_active
FROM public.tenant_users tu
JOIN public.profiles p ON tu.user_id = p.id
WHERE p.contact_email = 'platform.admin@flow-iq.ai';

-- 5. Show all users with platform_admin role
SELECT 
  'All platform admins' as check_type,
  u.email,
  p.role,
  tu.role as tenant_role
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.tenant_users tu ON u.id = tu.user_id
WHERE p.role = 'platform_admin'; 