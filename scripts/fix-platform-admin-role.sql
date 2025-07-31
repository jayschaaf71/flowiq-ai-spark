-- Fix Platform Admin Role
-- This script ensures the platform admin user has the correct role and permissions

-- Update the profile to ensure platform_admin role
UPDATE public.profiles 
SET role = 'platform_admin'
WHERE contact_email = 'platform.admin@flow-iq.ai';

-- Ensure tenant_users entry exists with correct role
INSERT INTO public.tenant_users (
  tenant_id, user_id, role, is_active, created_at, updated_at
)
SELECT 
  '00000000-0000-0000-0000-000000000000', -- Main platform tenant
  p.id,
  'platform_admin',
  true,
  now(),
  now()
FROM public.profiles p
WHERE p.contact_email = 'platform.admin@flow-iq.ai'
ON CONFLICT (tenant_id, user_id) 
DO UPDATE SET 
  role = 'platform_admin',
  is_active = true,
  updated_at = now();

-- Verify the fix
SELECT 
  'Platform Admin Status After Fix:' as status,
  u.email,
  p.role as profile_role,
  tu.role as tenant_role,
  tu.is_active
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.tenant_users tu ON u.id = tu.user_id
WHERE u.email = 'platform.admin@flow-iq.ai';

-- Show final credentials
SELECT 
  'Final Platform Admin Credentials:' as info_type,
  'platform.admin@flow-iq.ai' as email,
  'PlatformAdmin2024!' as password,
  'Try logging in now' as note; 