-- Fix admin user roles to allow access to the dashboard

-- Update profiles table to set role to 'staff'
UPDATE public.profiles 
SET role = 'staff'
WHERE contact_email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');

-- Update tenant_users table to set role to 'staff'
UPDATE public.tenant_users 
SET role = 'staff'
WHERE user_id IN (
  SELECT id FROM public.profiles 
  WHERE contact_email IN ('admin@midwestdental.com', 'admin@westcountyspine.com')
);

-- Verify the changes
SELECT 
  'Updated profiles' as table_name,
  id,
  first_name,
  last_name,
  contact_email,
  role,
  updated_at
FROM public.profiles 
WHERE contact_email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');

SELECT 
  'Updated tenant_users' as table_name,
  tu.tenant_id,
  tu.user_id,
  tu.role,
  tu.is_active,
  p.contact_email
FROM public.tenant_users tu
JOIN public.profiles p ON tu.user_id = p.id
WHERE p.contact_email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');

-- Display updated login credentials
SELECT 
  'UPDATED LOGIN CREDENTIALS' as info,
  'Midwest Dental Sleep: admin@midwestdental.com / MidwestAdmin2024!' as credential_1,
  'West County Spine: admin@westcountyspine.com / WestCountyAdmin2024!' as credential_2,
  'Role: staff (should now have access)' as note; 