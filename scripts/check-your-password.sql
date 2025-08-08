-- Check Your Platform Admin Account
-- This script checks your platform admin account details

-- Check if your user exists and has a password
SELECT 
  'Your Account Status:' as check_type,
  email,
  CASE 
    WHEN encrypted_password IS NOT NULL AND encrypted_password != '' 
    THEN '✅ Has password set'
    ELSE '❌ No password set'
  END as password_status,
  created_at
FROM auth.users 
WHERE email = 'jayschaaf71@gmail.com';

-- Check your profile
SELECT 
  'Your Profile:' as check_type,
  contact_email,
  role,
  first_name,
  last_name
FROM public.profiles 
WHERE contact_email = 'jayschaaf71@gmail.com';

-- Check your tenant link
SELECT 
  'Your Tenant Link:' as check_type,
  tu.role as tenant_role,
  tu.is_active
FROM public.tenant_users tu
JOIN public.profiles p ON tu.user_id = p.id
WHERE p.contact_email = 'jayschaaf71@gmail.com';

-- Show all your accounts
SELECT 
  'All Your Accounts:' as check_type,
  u.email,
  p.role,
  tu.role as tenant_role,
  CASE 
    WHEN u.encrypted_password IS NOT NULL AND u.encrypted_password != '' 
    THEN '✅ Has password'
    ELSE '❌ No password'
  END as password_status
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.tenant_users tu ON u.id = tu.user_id
WHERE u.email = 'jayschaaf71@gmail.com'; 