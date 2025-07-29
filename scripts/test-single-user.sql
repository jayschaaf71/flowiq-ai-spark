-- Test Single User Creation for FlowIQ
-- This script creates just one test user to verify the login system works

-- First, let's see what's in the database
SELECT '=== DATABASE STATE ===' as status;
SELECT COUNT(*) as total_users FROM auth.users;
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Create just one test user with a very unique email
SELECT '=== CREATING TEST USER ===' as status;

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
  'test.user.2024.07.28@flowiq.test',
  crypt('TestPassword2024!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Test", "last_name": "User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

SELECT '=== CREATING PROFILE ===' as status;

-- Create profile for the test user
INSERT INTO public.profiles (
  id, first_name, last_name, contact_email, role, created_at, updated_at
)
SELECT 
  u.id,
  'Test',
  'User',
  'test.user.2024.07.28@flowiq.test',
  'staff',
  now(),
  now()
FROM auth.users u
WHERE u.email = 'test.user.2024.07.28@flowiq.test';

SELECT '=== CREATING TENANT USER ===' as status;

-- Link test user to Midwest Dental Sleep tenant
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
WHERE p.contact_email = 'test.user.2024.07.28@flowiq.test';

SELECT '=== VERIFICATION ===' as status;

-- Verify the test user was created
SELECT 'Test User:' as user_type, u.email, p.role as profile_role, tu.role as tenant_role
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.tenant_users tu ON u.id = tu.user_id
WHERE u.email = 'test.user.2024.07.28@flowiq.test';

SELECT '=== TEST LOGIN CREDENTIALS ===' as status;
SELECT 'Test User:' as user_type, 'test.user.2024.07.28@flowiq.test' as email, 'TestPassword2024!' as password; 