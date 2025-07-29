-- Basic admin users creation for FlowIQ Pilot Practices
-- This script creates only the essential admin users

-- Admin for Midwest Dental Sleep Medicine Institute
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
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

-- Admin for West County Spine and Joint
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
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

-- Create profiles for the admin users
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  contact_email,
  role,
  created_at,
  updated_at
) 
SELECT 
  u.id,
  'Admin',
  'Midwest',
  'admin@midwestdental.com',
  'practice_admin',
  now(),
  now()
FROM auth.users u 
WHERE u.email = 'admin@midwestdental.com';

INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  contact_email,
  role,
  created_at,
  updated_at
) 
SELECT 
  u.id,
  'Admin',
  'WestCounty',
  'admin@westcountyspine.com',
  'practice_admin',
  now(),
  now()
FROM auth.users u 
WHERE u.email = 'admin@westcountyspine.com';

-- Link admin users to their respective tenants
INSERT INTO public.tenant_users (
  tenant_id,
  user_id,
  role,
  is_active,
  joined_at
) 
SELECT 
  'd52278c3-bf0d-4731-bfa9-a40f032fa305', -- Midwest Dental Sleep
  u.id,
  'practice_admin',
  true,
  now()
FROM auth.users u 
WHERE u.email = 'admin@midwestdental.com';

INSERT INTO public.tenant_users (
  tenant_id,
  user_id,
  role,
  is_active,
  joined_at
) 
SELECT 
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2', -- West County Spine
  u.id,
  'practice_admin',
  true,
  now()
FROM auth.users u 
WHERE u.email = 'admin@westcountyspine.com';

-- Print success message
SELECT 'Admin users created successfully!' as message; 