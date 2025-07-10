-- Set up Plaud configurations for the two specific tenants

-- Insert Plaud configuration for Midwest Dental Sleep Medicine Institute
INSERT INTO public.plaud_configurations (
  tenant_id,
  is_active,
  webhook_url,
  auto_sync,
  transcription_settings,
  metadata
) VALUES (
  '4b3f6c47-b7cd-4716-b6f5-98fe45238166',
  true,
  'https://jzusvsbkprwkjhhozaup.supabase.co/functions/v1/plaud-webhook',
  true,
  jsonb_build_object(
    'language', 'en',
    'model', 'whisper-1',
    'enable_soap_extraction', true,
    'enable_summary', true
  ),
  jsonb_build_object(
    'tenant_name', 'Midwest Dental Sleep Medicine Institute',
    'setup_date', now()
  )
);

-- We need to create West County Spine and Joint tenant first if it doesn't exist
-- Let's create it as a chiropractic practice
INSERT INTO public.tenants (
  name,
  subdomain, 
  specialty,
  practice_type,
  owner_id,
  is_active
) VALUES (
  'West County Spine and Joint',
  'west-county-spine-joint',
  'chiropractic',
  'private_practice',
  auth.uid(),
  true
) ON CONFLICT (subdomain) DO NOTHING
RETURNING id;

-- Insert Plaud configuration for West County Spine and Joint
INSERT INTO public.plaud_configurations (
  tenant_id,
  is_active, 
  webhook_url,
  auto_sync,
  transcription_settings,
  metadata
) 
SELECT 
  t.id,
  true,
  'https://jzusvsbkprwkjhhozaup.supabase.co/functions/v1/plaud-webhook',
  true,
  jsonb_build_object(
    'language', 'en',
    'model', 'whisper-1',
    'enable_soap_extraction', true,
    'enable_summary', true
  ),
  jsonb_build_object(
    'tenant_name', 'West County Spine and Joint',
    'setup_date', now()
  )
FROM public.tenants t 
WHERE t.name = 'West County Spine and Joint'
ON CONFLICT (tenant_id) DO UPDATE SET
  is_active = EXCLUDED.is_active,
  webhook_url = EXCLUDED.webhook_url,
  auto_sync = EXCLUDED.auto_sync,
  transcription_settings = EXCLUDED.transcription_settings,
  metadata = EXCLUDED.metadata;