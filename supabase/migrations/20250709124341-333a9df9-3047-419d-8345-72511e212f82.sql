-- Fix infinite recursion in tenant_users RLS policies
-- This issue occurs when RLS policies reference functions that query the same table

-- First, drop the problematic policy
DROP POLICY IF EXISTS "Tenant owners can manage users" ON public.tenant_users;

-- Create a new policy that avoids recursion by using a simpler check
CREATE POLICY "Tenant owners can manage users" ON public.tenant_users
FOR ALL 
TO authenticated
USING (
  -- Allow if user is the tenant owner (direct check without recursion)
  tenant_id IN (
    SELECT id FROM public.tenants 
    WHERE owner_id = auth.uid()
  )
);

-- Also check and fix the tenants policy if it has similar issues
DROP POLICY IF EXISTS "Users can view tenants they belong to" ON public.tenants;

-- Create a simpler tenants viewing policy
CREATE POLICY "Users can view tenants they belong to" ON public.tenants
FOR SELECT 
TO authenticated
USING (
  -- Users can view tenants they own
  owner_id = auth.uid()
  OR
  -- Users can view tenants where they are active members
  id IN (
    SELECT tenant_id FROM public.tenant_users 
    WHERE user_id = auth.uid() AND is_active = true
  )
);