-- Create tenant_users records to link you as owner of both practices
INSERT INTO public.tenant_users (
  tenant_id,
  user_id,
  role,
  is_active,
  joined_at
) VALUES 
(
  'd52278c3-bf0d-4731-bfa9-a40f032fa305', -- Midwest Dental Sleep
  '00463e37-5591-45c5-b8b9-03e31302cb62',
  'owner',
  true,
  now()
),
(
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2', -- West County Spine
  '00463e37-5591-45c5-b8b9-03e31302cb62',
  'owner',
  true,
  now()
);

-- Update your profile to set default tenant to Midwest Dental Sleep
UPDATE public.profiles 
SET 
  current_tenant_id = 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  tenant_id = 'd52278c3-bf0d-4731-bfa9-a40f032fa305'
WHERE id = '00463e37-5591-45c5-b8b9-03e31302cb62';