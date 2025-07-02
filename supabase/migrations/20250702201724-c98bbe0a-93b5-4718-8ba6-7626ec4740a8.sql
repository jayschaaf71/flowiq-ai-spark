-- Create a Dental Sleep Medicine tenant
INSERT INTO tenants (
  id,
  name,
  brand_name,
  specialty,
  primary_color,
  secondary_color,
  tagline,
  slug,
  subscription_tier,
  is_active,
  custom_branding_enabled
) VALUES (
  '8a8b8c8d-8e8f-4890-9192-939495969798',
  'Dental Sleep IQ',
  'Dental Sleep IQ',
  'dental-sleep-medicine',
  '#8b5cf6',
  '#a78bfa',
  'Restoring quality sleep through dental solutions',
  'dental-sleep',
  'enterprise',
  true,
  true
);

-- Update the user's profile to be assigned to the Dental Sleep IQ tenant
UPDATE profiles 
SET tenant_id = '8a8b8c8d-8e8f-4890-9192-939495969798'
WHERE id = '55fc1856-d515-4934-a0ed-33fe58af9110';