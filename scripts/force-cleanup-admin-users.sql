-- Force Cleanup and Recreate Admin Users for FlowIQ Pilot Practices
-- This script handles the specific duplicate key error

-- First, let's check what's causing the conflict
SELECT '=== CHECKING CONFLICTING ID ===' as status;
SELECT id, email, created_at FROM auth.users WHERE id = 'e36b88ea-1df9-47fc-9640-703cde5fd0b4';

SELECT '=== CHECKING ALL ADMIN USERS ===' as status;
SELECT id, email, created_at FROM auth.users WHERE email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');

SELECT '=== CHECKING ALL ADMIN PROFILES ===' as status;
SELECT id, first_name, last_name, contact_email, role FROM public.profiles WHERE contact_email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');

-- Force cleanup - delete by specific ID first
SELECT '=== FORCE CLEANUP BY ID ===' as status;

-- Delete from tenant_users for the specific conflicting ID
DELETE FROM public.tenant_users WHERE user_id = 'e36b88ea-1df9-47fc-9640-703cde5fd0b4';

-- Delete from profiles for the specific conflicting ID
DELETE FROM public.profiles WHERE id = 'e36b88ea-1df9-47fc-9640-703cde5fd0b4';

-- Delete from auth.users for the specific conflicting ID
DELETE FROM auth.users WHERE id = 'e36b88ea-1df9-47fc-9640-703cde5fd0b4';

-- Now clean up any other admin users
SELECT '=== CLEANING UP OTHER ADMIN USERS ===' as status;

-- Delete from tenant_users for all admin emails
DELETE FROM public.tenant_users 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('admin@midwestdental.com', 'admin@westcountyspine.com')
);

-- Delete from profiles for all admin emails
DELETE FROM public.profiles 
WHERE contact_email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');

-- Delete from auth.users for all admin emails
DELETE FROM auth.users 
WHERE email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');

SELECT '=== VERIFYING CLEANUP ===' as status;
SELECT 'Remaining admin users:' as check_type, COUNT(*) as count FROM auth.users WHERE email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');
SELECT 'Remaining admin profiles:' as check_type, COUNT(*) as count FROM public.profiles WHERE contact_email IN ('admin@midwestdental.com', 'admin@westcountyspine.com');

-- Now create fresh users with different IDs
SELECT '=== CREATING FRESH ADMIN USERS ===' as status;

-- Create Midwest Dental Sleep admin user with new ID
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, recovery_sent_at, last_sign_in_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@midwestdental.com',
  crypt('MidwestAdmin2024!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Admin", "last_name": "Midwest"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Create West County Spine admin user with new ID
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, recovery_sent_at, last_sign_in_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@westcountyspine.com',
  crypt('WestCountyAdmin2024!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Admin", "last_name": "WestCounty"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

SELECT '=== CREATING PROFILES ===' as status;

-- Create profiles for the admin users
INSERT INTO public.profiles (
  id, first_name, last_name, contact_email, role, created_at, updated_at
)
SELECT 
  u.id,
  'Admin',
  'Midwest',
  'admin@midwestdental.com',
  'staff',
  now(),
  now()
FROM auth.users u
WHERE u.email = 'admin@midwestdental.com';

INSERT INTO public.profiles (
  id, first_name, last_name, contact_email, role, created_at, updated_at
)
SELECT 
  u.id,
  'Admin',
  'WestCounty',
  'admin@westcountyspine.com',
  'staff',
  now(),
  now()
FROM auth.users u
WHERE u.email = 'admin@westcountyspine.com';

SELECT '=== CREATING TENANT USERS ===' as status;

-- Link Midwest admin to Midwest Dental Sleep tenant
INSERT INTO public.tenant_users (
  tenant_id, user_id, role, is_active, created_at, updated_at
)
SELECT 
  'd52278c3-bf0d-4731-bfa9-a40f032fa305', -- Midwest Dental Sleep tenant ID
  p.id,
  'staff',
  true,
  now(),
  now()
FROM public.profiles p
WHERE p.contact_email = 'admin@midwestdental.com';

-- Link West County admin to West County Spine tenant
INSERT INTO public.tenant_users (
  tenant_id, user_id, role, is_active, created_at, updated_at
)
SELECT 
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2', -- West County Spine tenant ID
  p.id,
  'staff',
  true,
  now(),
  now()
FROM public.profiles p
WHERE p.contact_email = 'admin@westcountyspine.com';

SELECT '=== FINAL VERIFICATION ===' as status;

-- Verify the users were created
SELECT 'Midwest Admin User:' as user_type, u.email, p.role as profile_role, tu.role as tenant_role
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.tenant_users tu ON u.id = tu.user_id
WHERE u.email = 'admin@midwestdental.com';

SELECT 'West County Admin User:' as user_type, u.email, p.role as profile_role, tu.role as tenant_role
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.tenant_users tu ON u.id = tu.user_id
WHERE u.email = 'admin@westcountyspine.com';

SELECT '=== LOGIN CREDENTIALS ===' as status;
SELECT 'Midwest Dental Sleep:' as practice, 'admin@midwestdental.com' as email, 'MidwestAdmin2024!' as password;
SELECT 'West County Spine:' as practice, 'admin@westcountyspine.com' as email, 'WestCountyAdmin2024!' as password; 