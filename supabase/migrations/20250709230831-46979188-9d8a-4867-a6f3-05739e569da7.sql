-- First, drop the problematic policy that's causing infinite recursion
DROP POLICY IF EXISTS "Platform admins can view all platform users" ON profiles;

-- Drop any duplicate or conflicting policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create a clean, non-recursive policy for users to view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create a separate policy for platform admins using a more direct approach
-- This avoids recursion by not querying the profiles table within the policy
CREATE POLICY "Platform admins can view all profiles" 
ON profiles 
FOR SELECT 
USING (
  -- Direct role check from JWT claims instead of querying profiles table
  (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'platform_admin'
  OR 
  -- Fallback: check if user is specifically marked as platform admin in raw_user_meta_data
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data ->> 'role' = 'platform_admin'
  )
);

-- Ensure the platform_user_management view is accessible
-- Grant necessary permissions
GRANT SELECT ON platform_user_management TO authenticated;