-- Update the appointments RLS policy to use the correct role function
DROP POLICY IF EXISTS "Users can manage appointments in their tenant" ON public.appointments;

-- Create updated policy using the has_staff_access function
CREATE POLICY "Staff can manage appointments in their tenant"
  ON public.appointments
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_users.tenant_id
      FROM tenant_users
      WHERE tenant_users.user_id = auth.uid() 
      AND tenant_users.is_active = true
    ) 
    AND has_staff_access(auth.uid())
  )
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_users.tenant_id
      FROM tenant_users
      WHERE tenant_users.user_id = auth.uid() 
      AND tenant_users.is_active = true
    ) 
    AND has_staff_access(auth.uid())
  );