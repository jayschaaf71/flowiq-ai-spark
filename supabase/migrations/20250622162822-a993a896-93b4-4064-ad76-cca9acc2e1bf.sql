
-- Fix the infinite recursion in tenant_users policies
DROP POLICY IF EXISTS "Users can view their own tenant memberships" ON public.tenant_users;
DROP POLICY IF EXISTS "Platform admins can manage all tenant users" ON public.tenant_users;

-- Create a simple, non-recursive policy for users to view their own memberships
CREATE POLICY "Users can view own tenant memberships" 
ON public.tenant_users FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Create a policy for platform admins that doesn't reference tenant_users recursively
CREATE POLICY "Platform admins can manage tenant users" 
ON public.tenant_users FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
);

-- Also create a simple insert policy for new tenant user assignments
CREATE POLICY "Allow tenant user creation" 
ON public.tenant_users FOR INSERT 
TO authenticated 
WITH CHECK (
  -- Allow if inserting own user_id or if user is admin
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
);
