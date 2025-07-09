-- Update your user to be a platform admin
UPDATE profiles 
SET role = 'platform_admin' 
WHERE id = auth.uid();