
-- Create a public RLS policy for basic tenant information
-- This allows anonymous users to access basic tenant info for landing pages
CREATE POLICY "Public can view basic tenant info for landing pages"
ON public.tenants
FOR SELECT
TO anon
USING (true);

-- Also ensure authenticated users can still access tenant data
CREATE POLICY "Authenticated users can view tenant data"
ON public.tenants
FOR SELECT
TO authenticated
USING (true);
