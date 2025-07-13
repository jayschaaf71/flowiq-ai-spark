-- Production Database Cleanup Migration - Step 1
-- Clean up foreign key references first

-- Step 1: Clean up team invitations for old tenants
DELETE FROM public.team_invitations 
WHERE tenant_id IN (
  '4b3f6c47-b7cd-4716-b6f5-98fe45238166', -- Old Midwest Dental Sleep
  'd20528e4-a92d-4f87-8494-4a4606976fce'  -- Old West County Spine
);

-- Step 2: Clean up any other potential references
DELETE FROM public.tenant_users 
WHERE tenant_id IN (
  '4b3f6c47-b7cd-4716-b6f5-98fe45238166',
  'd20528e4-a92d-4f87-8494-4a4606976fce'
);

-- Step 3: Now safely remove duplicate tenant entries
DELETE FROM public.tenants 
WHERE id IN (
  '4b3f6c47-b7cd-4716-b6f5-98fe45238166', -- Old Midwest Dental Sleep
  'd20528e4-a92d-4f87-8494-4a4606976fce'  -- Old West County Spine
);

-- Step 4: Remove unassigned providers (those without tenant_id)
DELETE FROM public.providers 
WHERE tenant_id IS NULL;

-- Step 5: Update current tenant reference in profiles
UPDATE public.profiles 
SET current_tenant_id = 'd52278c3-bf0d-4731-bfa9-a40f032fa305'
WHERE id = '00463e37-5591-45c5-b8b9-03e31302cb62';

-- Update other profiles with null current_tenant_id
UPDATE public.profiles 
SET current_tenant_id = NULL
WHERE current_tenant_id IN (
  '4b3f6c47-b7cd-4716-b6f5-98fe45238166',
  'd20528e4-a92d-4f87-8494-4a4606976fce'
);