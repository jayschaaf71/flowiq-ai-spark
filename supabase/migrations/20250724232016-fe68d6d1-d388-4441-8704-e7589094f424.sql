-- Set up profiles for the manually created auth users
-- This assumes the users were created with the emails specified

-- First, let's get the user IDs from auth.users and create profiles
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  contact_email,
  role,
  current_tenant_id,
  created_at,
  updated_at
)
SELECT 
  au.id,
  CASE 
    WHEN au.email = 'admin@midwest-dental-sleep.com' THEN 'Dr. Sarah'
    WHEN au.email = 'admin@west-county-spine.com' THEN 'Dr. Mike'
  END as first_name,
  CASE 
    WHEN au.email = 'admin@midwest-dental-sleep.com' THEN 'Johnson'
    WHEN au.email = 'admin@west-county-spine.com' THEN 'Thompson'
  END as last_name,
  au.email,
  'practice_admin'::app_role,
  CASE 
    WHEN au.email = 'admin@midwest-dental-sleep.com' THEN 'd52278c3-bf0d-4731-bfa9-a40f032fa305'::uuid
    WHEN au.email = 'admin@west-county-spine.com' THEN '024e36c1-a1bc-44d0-8805-3162ba59a0c2'::uuid
  END as current_tenant_id,
  now(),
  now()
FROM auth.users au
WHERE au.email IN ('admin@midwest-dental-sleep.com', 'admin@west-county-spine.com')
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  contact_email = EXCLUDED.contact_email,
  role = EXCLUDED.role,
  current_tenant_id = EXCLUDED.current_tenant_id,
  updated_at = now();

-- Associate users with their tenants
INSERT INTO public.tenant_users (
  tenant_id,
  user_id,
  role,
  is_active,
  joined_at
)
SELECT 
  CASE 
    WHEN au.email = 'admin@midwest-dental-sleep.com' THEN 'd52278c3-bf0d-4731-bfa9-a40f032fa305'::uuid
    WHEN au.email = 'admin@west-county-spine.com' THEN '024e36c1-a1bc-44d0-8805-3162ba59a0c2'::uuid
  END as tenant_id,
  au.id as user_id,
  'owner',
  true,
  now()
FROM auth.users au
WHERE au.email IN ('admin@midwest-dental-sleep.com', 'admin@west-county-spine.com')
ON CONFLICT (tenant_id, user_id) DO UPDATE SET
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  joined_at = now();