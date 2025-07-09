-- Fix the platform admin policy to avoid querying auth.users table
DROP POLICY IF EXISTS "Platform admins can view all profiles" ON profiles;

-- Create a simpler policy that only uses JWT metadata
CREATE POLICY "Platform admins can view all profiles" 
ON profiles 
FOR SELECT 
USING (
  -- Only check JWT claims, don't query auth.users table
  (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'platform_admin'
);