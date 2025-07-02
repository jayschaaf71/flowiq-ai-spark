-- Create policy to allow users to read tenants they belong to
CREATE POLICY "Users can read their tenant data" ON tenants
FOR SELECT
USING (
  id::text IN (
    SELECT tenant_id::text 
    FROM profiles 
    WHERE id = auth.uid()
  )
  OR 
  id::text IN (
    SELECT tenant_id::text 
    FROM tenant_users 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Also create a policy for admins to read all tenants
CREATE POLICY "Admins can read all tenants" ON tenants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);