-- Enable RLS on tenants table if not already enabled
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read tenants they belong to
CREATE POLICY "Users can read their tenant data" ON tenants
FOR SELECT
USING (
  id IN (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
  OR 
  id IN (
    SELECT tenant_id 
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