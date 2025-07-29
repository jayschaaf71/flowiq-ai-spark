-- Fix Tenant Assignments and Roles for FlowIQ Admin Users
-- This script fixes the tenant assignments and role issues

-- First, let's see what users we have
SELECT '=== CURRENT USERS ===' as status;
SELECT id, email, created_at FROM auth.users WHERE email LIKE '%admin%' OR email LIKE '%midwest%' OR email LIKE '%westcounty%';

SELECT '=== CURRENT PROFILES ===' as status;
SELECT id, first_name, last_name, contact_email, role FROM public.profiles WHERE contact_email LIKE '%admin%' OR contact_email LIKE '%midwest%' OR contact_email LIKE '%westcounty%';

SELECT '=== CURRENT TENANT USERS ===' as status;
SELECT 
  tu.tenant_id, 
  tu.user_id, 
  tu.role as tenant_role, 
  t.name as tenant_name,
  p.contact_email
FROM public.tenant_users tu 
JOIN public.tenants t ON tu.tenant_id = t.id
JOIN public.profiles p ON tu.user_id = p.id
WHERE p.contact_email LIKE '%admin%' OR p.contact_email LIKE '%midwest%' OR p.contact_email LIKE '%westcounty%';

-- Clean up existing tenant assignments
SELECT '=== CLEANING UP EXISTING ASSIGNMENTS ===' as status;
DELETE FROM public.tenant_users 
WHERE user_id IN (
  SELECT p.id FROM public.profiles p 
  WHERE p.contact_email LIKE '%admin%' OR p.contact_email LIKE '%midwest%' OR p.contact_email LIKE '%westcounty%'
);

-- Update profiles to have correct roles
SELECT '=== UPDATING PROFILE ROLES ===' as status;
UPDATE public.profiles 
SET role = 'staff'
WHERE contact_email LIKE '%admin%' OR contact_email LIKE '%midwest%' OR contact_email LIKE '%westcounty%';

-- Create correct tenant assignments
SELECT '=== CREATING CORRECT TENANT ASSIGNMENTS ===' as status;

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
WHERE p.contact_email = 'admin.westcounty@flowiq.test';

SELECT '=== VERIFICATION ===' as status;

-- Verify Midwest admin
SELECT 
  'Midwest Admin:' as user_type, 
  u.email, 
  p.role as profile_role, 
  tu.role as tenant_role,
  t.name as tenant_name
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.tenant_users tu ON u.id = tu.user_id
JOIN public.tenants t ON tu.tenant_id = t.id
WHERE u.email = 'midwest.admin@flowiq.test';

-- Verify West County admin
SELECT 
  'West County Admin:' as user_type, 
  u.email, 
  p.role as profile_role, 
  tu.role as tenant_role,
  t.name as tenant_name
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.tenant_users tu ON u.id = tu.user_id
JOIN public.tenants t ON tu.tenant_id = t.id
WHERE u.email = 'admin.westcounty@flowiq.test';

SELECT '=== LOGIN CREDENTIALS ===' as status;
SELECT 'Midwest Dental Sleep:' as practice, 'midwest.admin@flowiq.test' as email, 'MidwestAdmin2024!' as password;
SELECT 'West County Spine:' as practice, 'admin.westcounty@flowiq.test' as email, 'WestCountyAdmin2024!' as password; 