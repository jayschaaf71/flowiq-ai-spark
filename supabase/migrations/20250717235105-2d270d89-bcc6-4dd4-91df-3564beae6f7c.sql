-- Fix infinite recursion in profiles table RLS policy

-- First, drop the problematic policy
DROP POLICY IF EXISTS "Platform admins can view all profiles" ON public.profiles;

-- Create a security definer function to check if user is platform admin
-- This avoids querying the profiles table directly in the policy
CREATE OR REPLACE FUNCTION public.is_platform_admin_check()
RETURNS BOOLEAN AS $$
DECLARE
  user_role app_role;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role = 'platform_admin'::app_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create the corrected policy using the security definer function
CREATE POLICY "Platform admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_platform_admin_check() OR auth.uid() = id);

-- Also remove duplicate policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;