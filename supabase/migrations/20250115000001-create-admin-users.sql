-- Create Admin Users for FlowIQ Pilot Practices
-- This migration creates admin users for both Midwest Dental Sleep and West County Spine

-- First, let's create the admin users in the auth.users table
-- Note: These are test credentials for pilot troubleshooting

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
  'midwest-admin-id',
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
) ON CONFLICT (id) DO NOTHING;

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
  'west-county-admin-id',
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
) ON CONFLICT (id) DO NOTHING;

-- Create profiles for the admin users
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  contact_email,
  role,
  is_active,
  created_at,
  updated_at
) VALUES 
(
  'midwest-admin-id',
  'Admin',
  'Midwest',
  'admin@midwestdental.com',
  'practice_admin',
  true,
  now(),
  now()
),
(
  'west-county-admin-id',
  'Admin',
  'WestCounty',
  'admin@westcountyspine.com',
  'practice_admin',
  true,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  contact_email = EXCLUDED.contact_email,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Link admin users to their respective tenants
INSERT INTO public.tenant_users (
  tenant_id,
  user_id,
  role,
  is_active,
  joined_at
) VALUES 
(
  'd52278c3-bf0d-4731-bfa9-a40f032fa305', -- Midwest Dental Sleep
  'midwest-admin-id',
  'practice_admin',
  true,
  now()
),
(
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2', -- West County Spine
  'west-county-admin-id',
  'practice_admin',
  true,
  now()
) ON CONFLICT (tenant_id, user_id) DO UPDATE SET
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = now();

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
  'midwest-provider-1',
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
  'midwest-provider-2',
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
  'west-county-provider-1',
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
  'west-county-provider-2',
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  'Dr. Robert',
  'Thompson',
  'dr.thompson@westcountyspine.com',
  '(555) 987-6544',
  'chiropractic-care',
  true,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  specialty = EXCLUDED.specialty,
  is_active = EXCLUDED.is_active,
  updated_at = now();

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
WHERE p.id IN ('midwest-provider-1', 'midwest-provider-2', 'west-county-provider-1', 'west-county-provider-2')
ON CONFLICT DO NOTHING;

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
  'midwest-patient-1',
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
  'midwest-patient-2',
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
  'west-county-patient-1',
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
  'west-county-patient-2',
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  'Lisa',
  'Brown',
  'lisa.brown@email.com',
  '(555) 222-2223',
  '1990-12-05',
  true,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  date_of_birth = EXCLUDED.date_of_birth,
  is_active = EXCLUDED.is_active,
  updated_at = now();

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
) VALUES 
-- Midwest Dental Sleep Appointments
(
  'midwest-apt-1',
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  'midwest-patient-1',
  'midwest-provider-1',
  CURRENT_DATE + INTERVAL '1 day',
  '09:00',
  '10:00',
  'Sleep Consultation',
  'confirmed',
  'Initial sleep apnea consultation',
  now(),
  now()
),
(
  'midwest-apt-2',
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  'midwest-patient-2',
  'midwest-provider-2',
  CURRENT_DATE + INTERVAL '2 days',
  '14:00',
  '15:00',
  'Oral Appliance Fitting',
  'confirmed',
  'Oral appliance fitting appointment',
  now(),
  now()
),
-- West County Spine Appointments
(
  'west-county-apt-1',
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  'west-county-patient-1',
  'west-county-provider-1',
  CURRENT_DATE + INTERVAL '1 day',
  '10:00',
  '11:00',
  'Chiropractic Adjustment',
  'confirmed',
  'Regular chiropractic adjustment',
  now(),
  now()
),
(
  'west-county-apt-2',
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  'west-county-patient-2',
  'west-county-provider-2',
  CURRENT_DATE + INTERVAL '3 days',
  '15:00',
  '16:00',
  'Initial Consultation',
  'confirmed',
  'New patient consultation',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  appointment_date = EXCLUDED.appointment_date,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  appointment_type = EXCLUDED.appointment_type,
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = now(); 