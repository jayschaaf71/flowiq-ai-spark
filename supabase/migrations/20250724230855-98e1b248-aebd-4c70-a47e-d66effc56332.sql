-- Insert production tenant records for subdomain routing
INSERT INTO public.tenants (
  id,
  name, 
  business_name,
  subdomain,
  specialty,
  practice_type,
  primary_color,
  secondary_color,
  is_active,
  created_at,
  updated_at
) VALUES 
(
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  'Midwest Dental Sleep Medicine Institute',
  'Midwest Dental Sleep Medicine Institute', 
  'midwest-dental-sleep',
  'dental-sleep-medicine',
  'private_practice',
  '#8b5cf6',
  '#a78bfa',
  true,
  now(),
  now()
),
(
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  'West County Spine and Joint',
  'West County Spine and Joint',
  'west-county-spine', 
  'chiropractic-care',
  'private_practice',
  '#16a34a',
  '#22c55e',
  true,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  business_name = EXCLUDED.business_name,
  subdomain = EXCLUDED.subdomain,
  specialty = EXCLUDED.specialty,
  practice_type = EXCLUDED.practice_type,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  is_active = EXCLUDED.is_active,
  updated_at = now();