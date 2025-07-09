-- Ensure a profile exists for the current user
INSERT INTO profiles (id, role, first_name, last_name, contact_email)
SELECT 
  auth.uid(),
  'platform_admin',
  'Platform',
  'Admin',
  (SELECT email FROM auth.users WHERE id = auth.uid())
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid()
);

-- Update existing profile to platform_admin if needed
UPDATE profiles 
SET role = 'platform_admin'
WHERE id = auth.uid() AND role != 'platform_admin';