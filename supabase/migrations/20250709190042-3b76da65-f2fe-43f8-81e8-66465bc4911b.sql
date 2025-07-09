-- Fix the infinite recursion in tenants RLS policy
DROP POLICY IF EXISTS "Users can view tenants they belong to" ON public.tenants;

-- Create a proper policy without recursion
CREATE POLICY "Users can view tenants they belong to"
ON public.tenants
FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.tenant_users tu
    WHERE tu.tenant_id = tenants.id 
    AND tu.user_id = auth.uid() 
    AND tu.is_active = true
  )
);