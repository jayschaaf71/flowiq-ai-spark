-- Check if admin users exist and display their information

-- Check auth.users table
SELECT 
  'auth.users' as table_name,
  id,
  email,
  role,
  created_at
FROM auth.users 
WHERE email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');

-- Check profiles table
SELECT 
  'profiles' as table_name,
  id,
  first_name,
  last_name,
  contact_email,
  role,
  created_at
FROM public.profiles 
WHERE contact_email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');

-- Check tenant_users table
SELECT 
  'tenant_users' as table_name,
  tu.tenant_id,
  tu.user_id,
  tu.role,
  tu.is_active,
  p.contact_email
FROM public.tenant_users tu
JOIN public.profiles p ON tu.user_id = p.id
WHERE p.contact_email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');

-- Display login credentials
SELECT 
  'LOGIN CREDENTIALS' as info,
  'Midwest Dental Sleep: admin@midwestdental.com / MidwestAdmin2024!' as credential_1,
  'West County Spine: admin@westcountyspine.com / WestCountyAdmin2024!' as credential_2; 