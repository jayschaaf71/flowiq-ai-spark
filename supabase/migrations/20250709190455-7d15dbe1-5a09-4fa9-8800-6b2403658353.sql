-- Create profile for the user with platform admin role
INSERT INTO profiles (id, role, first_name, last_name, contact_email)
VALUES (
  '00463e37-5591-45c5-b8b9-03e31302cb62',
  'platform_admin',
  'Platform',
  'Admin', 
  'jayschaaf71@gmail.com'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'platform_admin';