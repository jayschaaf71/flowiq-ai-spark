-- Set Password for Your Platform Admin Account
-- This script sets a password for your platform admin account

-- Update your password (replace 'YourNewPassword123!' with your desired password)
UPDATE auth.users 
SET encrypted_password = crypt('YourNewPassword123!', gen_salt('bf'))
WHERE email = 'jayschaaf71@gmail.com';

-- Verify the password was set
SELECT 
  'Password Update Status:' as status,
  email,
  CASE 
    WHEN encrypted_password IS NOT NULL AND encrypted_password != '' 
    THEN '✅ Password set successfully'
    ELSE '❌ Password not set'
  END as password_status
FROM auth.users 
WHERE email = 'jayschaaf71@gmail.com';

-- Show your updated account info
SELECT 
  'Your Updated Account:' as info_type,
  'jayschaaf71@gmail.com' as email,
  'YourNewPassword123!' as password,
  'Use these credentials to login' as note; 