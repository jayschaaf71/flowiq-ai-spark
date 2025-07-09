-- Drop all existing policies on tenants table
DROP POLICY IF EXISTS "Users can view tenants they belong to" ON public.tenants;
DROP POLICY IF EXISTS "Users can create tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users can update tenants they own" ON public.tenants;

-- Create a simple security definer function to check tenant access
CREATE OR REPLACE FUNCTION public.user_can_access_tenant(tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Platform admins can access all tenants
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'platform_admin') THEN
    RETURN TRUE;
  END IF;
  
  -- Regular users can access tenants they own or belong to
  RETURN EXISTS (
    SELECT 1 FROM public.tenants t 
    WHERE t.id = tenant_id AND t.owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.tenant_users tu 
    WHERE tu.tenant_id = tenant_id AND tu.user_id = auth.uid() AND tu.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new non-recursive policies
CREATE POLICY "Platform admins can view all tenants"
ON public.tenants
FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'platform_admin')
);

CREATE POLICY "Users can view their own tenants"
ON public.tenants  
FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Users can create tenants"
ON public.tenants
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own tenants"
ON public.tenants
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid());