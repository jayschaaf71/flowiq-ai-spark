-- Update Jason's account to platform admin
UPDATE profiles 
SET role = 'platform_admin'::app_role
WHERE contact_email = 'jayschaaf71@gmail.com';