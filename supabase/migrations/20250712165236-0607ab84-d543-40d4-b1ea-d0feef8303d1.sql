-- Create tenant records for the two pilot practices
INSERT INTO public.tenants (
  id,
  name,
  subdomain,
  specialty,
  practice_type,
  business_name,
  owner_id,
  primary_color,
  secondary_color,
  is_active,
  settings
) VALUES 
(
  'midwest-dental-sleep',
  'Midwest Dental Sleep Medicine Institute',
  'midwest-dental-sleep',
  'dental-sleep-medicine',
  'specialty_clinic',
  'Midwest Dental Sleep Medicine Institute',
  '00463e37-5591-45c5-b8b9-03e31302cb62', -- Your user ID
  '#8b5cf6',
  '#a78bfa',
  true,
  jsonb_build_object(
    'features', jsonb_build_object(
      'scheduling', true,
      'ehr', true,
      'sleep_studies', true,
      'dme_tracking', true,
      'oral_appliances', true,
      'claims', true,
      'patient_portal', true
    ),
    'branding', jsonb_build_object(
      'tagline', 'Advanced Sleep Medicine Care',
      'description', 'Comprehensive dental sleep medicine practice specializing in sleep apnea treatment and oral appliance therapy'
    )
  )
),
(
  'west-county-spine',
  'West County Spine and Joint',
  'west-county-spine',
  'chiropractic-care',
  'specialty_clinic',
  'West County Spine and Joint',
  '00463e37-5591-45c5-b8b9-03e31302cb62', -- Your user ID
  '#16a34a',
  '#22c55e',
  true,
  jsonb_build_object(
    'features', jsonb_build_object(
      'scheduling', true,
      'ehr', true,
      'patient_management', true,
      'claims', true,
      'patient_portal', true,
      'treatment_plans', true
    ),
    'branding', jsonb_build_object(
      'tagline', 'Expert Spine & Joint Care',
      'description', 'Full-service chiropractic clinic providing comprehensive spine and joint treatment solutions'
    )
  )
);

-- Create tenant_users records to link you as owner of both practices
INSERT INTO public.tenant_users (
  tenant_id,
  user_id,
  role,
  is_active,
  joined_at
) VALUES 
(
  'midwest-dental-sleep',
  '00463e37-5591-45c5-b8b9-03e31302cb62',
  'owner',
  true,
  now()
),
(
  'west-county-spine',
  '00463e37-5591-45c5-b8b9-03e31302cb62',
  'owner',
  true,
  now()
);

-- Update your profile to set default tenant
UPDATE public.profiles 
SET 
  current_tenant_id = 'midwest-dental-sleep',
  tenant_id = 'midwest-dental-sleep',
  role = 'platform_admin'
WHERE id = '00463e37-5591-45c5-b8b9-03e31302cb62';