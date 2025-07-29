-- Simple admin users creation for FlowIQ Pilot Practices
-- This script creates admin users without using ON CONFLICT clauses

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

-- Create some test providers for each practice
INSERT INTO public.providers (
  id,
  tenant_id,
  first_name,
  last_name,
  email,
  phone,
  specialty,
  is_active,
  created_at,
  updated_at
) VALUES 
-- Midwest Dental Sleep Providers
(
  gen_random_uuid(),
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  'Dr. Sarah',
  'Johnson',
  'dr.johnson@midwestdental.com',
  '(555) 123-4567',
  'dental-sleep-medicine',
  true,
  now(),
  now()
),
(
  gen_random_uuid(),
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  'Dr. Michael',
  'Chen',
  'dr.chen@midwestdental.com',
  '(555) 123-4568',
  'dental-sleep-medicine',
  true,
  now(),
  now()
),
-- West County Spine Providers
(
  gen_random_uuid(),
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  'Dr. Jennifer',
  'Martinez',
  'dr.martinez@westcountyspine.com',
  '(555) 987-6543',
  'chiropractic-care',
  true,
  now(),
  now()
),
(
  gen_random_uuid(),
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  'Dr. Robert',
  'Thompson',
  'dr.thompson@westcountyspine.com',
  '(555) 987-6544',
  'chiropractic-care',
  true,
  now(),
  now()
);

-- Create provider schedules for the test providers
INSERT INTO public.provider_schedules (
  provider_id,
  day_of_week,
  start_time,
  end_time,
  is_available,
  break_start_time,
  break_end_time,
  tenant_id
)
SELECT 
  p.id,
  generate_series(1, 5) as day_of_week, -- Monday to Friday
  '08:00'::time as start_time,
  '17:00'::time as end_time,
  true as is_available,
  '12:00'::time as break_start_time,
  '13:00'::time as break_end_time,
  p.tenant_id
FROM public.providers p
WHERE p.email IN ('dr.johnson@midwestdental.com', 'dr.chen@midwestdental.com', 'dr.martinez@westcountyspine.com', 'dr.thompson@westcountyspine.com');

-- Create some test patients for each practice
INSERT INTO public.patients (
  id,
  tenant_id,
  first_name,
  last_name,
  email,
  phone,
  date_of_birth,
  is_active,
  created_at,
  updated_at
) VALUES 
-- Midwest Dental Sleep Patients
(
  gen_random_uuid(),
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  'John',
  'Smith',
  'john.smith@email.com',
  '(555) 111-1111',
  '1980-01-15',
  true,
  now(),
  now()
),
(
  gen_random_uuid(),
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  'Sarah',
  'Wilson',
  'sarah.wilson@email.com',
  '(555) 111-1112',
  '1975-06-22',
  true,
  now(),
  now()
),
-- West County Spine Patients
(
  gen_random_uuid(),
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  'Mike',
  'Johnson',
  'mike.johnson@email.com',
  '(555) 222-2222',
  '1985-03-10',
  true,
  now(),
  now()
),
(
  gen_random_uuid(),
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  'Lisa',
  'Brown',
  'lisa.brown@email.com',
  '(555) 222-2223',
  '1990-12-05',
  true,
  now(),
  now()
);

-- Create some test appointments
INSERT INTO public.appointments (
  id,
  tenant_id,
  patient_id,
  provider_id,
  appointment_date,
  start_time,
  end_time,
  appointment_type,
  status,
  notes,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  p.id,
  pr.id,
  CURRENT_DATE + INTERVAL '1 day',
  '09:00',
  '10:00',
  'Sleep Consultation',
  'confirmed',
  'Initial sleep apnea consultation',
  now(),
  now()
FROM public.patients p, public.providers pr
WHERE p.email = 'john.smith@email.com' AND pr.email = 'dr.johnson@midwestdental.com'

UNION ALL

SELECT 
  gen_random_uuid(),
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  p.id,
  pr.id,
  CURRENT_DATE + INTERVAL '2 days',
  '14:00',
  '15:00',
  'Oral Appliance Fitting',
  'confirmed',
  'Oral appliance fitting appointment',
  now(),
  now()
FROM public.patients p, public.providers pr
WHERE p.email = 'sarah.wilson@email.com' AND pr.email = 'dr.chen@midwestdental.com'

UNION ALL

SELECT 
  gen_random_uuid(),
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  p.id,
  pr.id,
  CURRENT_DATE + INTERVAL '1 day',
  '10:00',
  '11:00',
  'Chiropractic Adjustment',
  'confirmed',
  'Regular chiropractic adjustment',
  now(),
  now()
FROM public.patients p, public.providers pr
WHERE p.email = 'mike.johnson@email.com' AND pr.email = 'dr.martinez@westcountyspine.com'

UNION ALL

SELECT 
  gen_random_uuid(),
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  p.id,
  pr.id,
  CURRENT_DATE + INTERVAL '3 days',
  '15:00',
  '16:00',
  'Initial Consultation',
  'confirmed',
  'New patient consultation',
  now(),
  now()
FROM public.patients p, public.providers pr
WHERE p.email = 'lisa.brown@email.com' AND pr.email = 'dr.thompson@westcountyspine.com';

-- Print success message
SELECT 'Admin users created successfully!' as message; 