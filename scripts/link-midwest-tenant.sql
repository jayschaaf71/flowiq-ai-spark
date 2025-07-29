-- Link Midwest Admin to Midwest Dental Sleep Tenant
-- This script links the newly created admin user to the correct tenant

-- First, let's find the Midwest admin user
SELECT '=== FINDING MIDWEST ADMIN USER ===' as status;
SELECT id, email, created_at FROM auth.users WHERE email = 'admin.midwest@flowiq.test';

SELECT '=== FINDING MIDWEST PROFILE ===' as status;
SELECT id, first_name, last_name, contact_email, role FROM public.profiles WHERE contact_email = 'admin.midwest@flowiq.test';

-- Link the Midwest admin to the Midwest Dental Sleep tenant
SELECT '=== LINKING TO MIDWEST TENANT ===' as status;

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
WHERE p.contact_email = 'admin.midwest@flowiq.test'
ON CONFLICT (tenant_id, user_id) DO UPDATE SET
  role = 'staff',
  is_active = true,
  updated_at = now();

SELECT '=== VERIFICATION ===' as status;

-- Verify the user is linked to the correct tenant
SELECT 
  'Midwest Admin User:' as user_type, 
  u.email, 
  p.role as profile_role, 
  tu.role as tenant_role,
  t.name as tenant_name
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.tenant_users tu ON u.id = tu.user_id
JOIN public.tenants t ON tu.tenant_id = t.id
WHERE u.email = 'admin.midwest@flowiq.test';

SELECT '=== LOGIN CREDENTIALS ===' as status;
SELECT 'Midwest Dental Sleep:' as practice, 'admin.midwest@flowiq.test' as email, 'MidwestAdmin2024!' as password; 