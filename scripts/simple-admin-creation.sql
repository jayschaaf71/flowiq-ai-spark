-- Simple Admin User Creation for FlowIQ Pilot Practices
-- This script creates admin users with new email addresses to avoid conflicts

-- First, let's see what admin users currently exist
SELECT '=== CURRENT ADMIN USERS ===' as status;
SELECT id, email, created_at FROM auth.users WHERE email LIKE '%admin%' OR email LIKE '%midwest%' OR email LIKE '%westcounty%';

SELECT '=== CURRENT ADMIN PROFILES ===' as status;
SELECT id, first_name, last_name, contact_email, role FROM public.profiles WHERE contact_email LIKE '%admin%' OR contact_email LIKE '%midwest%' OR contact_email LIKE '%westcounty%';

-- Create completely new admin users with different email addresses
SELECT '=== CREATING NEW ADMIN USERS ===' as status;

-- Create Midwest Dental Sleep admin user with new email
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
  'midwest.admin@flowiq.test',
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

-- Create West County Spine admin user with new email
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
  'westcounty.admin@flowiq.test',
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
  'midwest.admin@flowiq.test',
  'staff',
  now(),
  now()
FROM auth.users u
WHERE u.email = 'midwest.admin@flowiq.test';

INSERT INTO public.profiles (
  id, first_name, last_name, contact_email, role, created_at, updated_at
)
SELECT 
  u.id,
  'Admin',
  'WestCounty',
  'westcounty.admin@flowiq.test',
  'staff',
  now(),
  now()
FROM auth.users u
WHERE u.email = 'westcounty.admin@flowiq.test';

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
WHERE p.contact_email = 'midwest.admin@flowiq.test';

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
WHERE p.contact_email = 'westcounty.admin@flowiq.test';

SELECT '=== VERIFICATION ===' as status;

-- Verify the users were created
SELECT 'Midwest Admin User:' as user_type, u.email, p.role as profile_role, tu.role as tenant_role
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.tenant_users tu ON u.id = tu.user_id
WHERE u.email = 'midwest.admin@flowiq.test';

SELECT 'West County Admin User:' as user_type, u.email, p.role as profile_role, tu.role as tenant_role
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.tenant_users tu ON u.id = tu.user_id
WHERE u.email = 'westcounty.admin@flowiq.test';

SELECT '=== NEW LOGIN CREDENTIALS ===' as status;
SELECT 'Midwest Dental Sleep:' as practice, 'midwest.admin@flowiq.test' as email, 'MidwestAdmin2024!' as password;
SELECT 'West County Spine:' as practice, 'westcounty.admin@flowiq.test' as email, 'WestCountyAdmin2024!' as password; 