-- Create test users for production tenants
-- Note: These are profiles only - actual auth users need to be created through Supabase Auth

-- Create test user profiles for Midwest Dental Sleep
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  contact_email,
  role,
  current_tenant_id,
  created_at,
  updated_at
) VALUES 
-- Midwest Dental Sleep admin
(
  'a1b2c3d4-5678-90ab-cdef-123456789000',
  'Dr. Sarah',
  'Johnson',
  'admin@midwest-dental-sleep.com',
  'practice_admin'::app_role,
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  now(),
  now()
),
-- West County Spine admin  
(
  'b2c3d4e5-6789-01bc-def0-123456789001',
  'Dr. Mike',
  'Thompson',
  'admin@west-county-spine.com',
  'practice_admin'::app_role,
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  now(),
  now()
)
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
) VALUES 
-- Midwest Dental Sleep admin
(
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  'a1b2c3d4-5678-90ab-cdef-123456789000',
  'owner',
  true,
  now()
),
-- West County Spine admin
(
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  'b2c3d4e5-6789-01bc-def0-123456789001',
  'owner',
  true,
  now()
)
ON CONFLICT (tenant_id, user_id) DO UPDATE SET
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  joined_at = now();