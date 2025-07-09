-- Create a comprehensive view for platform user management
CREATE OR REPLACE VIEW platform_user_management AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  CONCAT(p.first_name, ' ', p.last_name) as full_name,
  p.contact_email as email,
  p.role,
  p.created_at,
  p.updated_at,
  p.current_tenant_id,
  t.name as tenant_name,
  tu.is_active as tenant_user_active,
  CASE 
    WHEN tu.is_active = true THEN 'active'
    WHEN tu.is_active = false THEN 'inactive'
    ELSE 'pending'
  END as status
FROM profiles p
LEFT JOIN tenant_users tu ON p.id = tu.user_id AND tu.is_active = true
LEFT JOIN tenants t ON tu.tenant_id = t.id
WHERE p.role != 'patient'::app_role
ORDER BY p.created_at DESC;

-- Create RLS policy for platform admins to view all users
CREATE POLICY "Platform admins can view all platform users" 
ON profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profile 
    WHERE admin_profile.id = auth.uid() 
    AND admin_profile.role = 'platform_admin'::app_role
  )
);

-- Create function to safely remove a user from the platform
CREATE OR REPLACE FUNCTION remove_platform_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_role app_role;
BEGIN
  -- Check if current user is platform admin
  SELECT role INTO current_user_role 
  FROM profiles 
  WHERE id = auth.uid();
  
  IF current_user_role != 'platform_admin'::app_role THEN
    RAISE EXCEPTION 'Only platform admins can remove users';
  END IF;
  
  -- Prevent removing other platform admins
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = target_user_id 
    AND role = 'platform_admin'::app_role
  ) THEN
    RAISE EXCEPTION 'Cannot remove platform admin users';
  END IF;
  
  -- Deactivate user in all tenants
  UPDATE tenant_users 
  SET is_active = false, 
      updated_at = now()
  WHERE user_id = target_user_id;
  
  -- Update user profile to inactive status
  UPDATE profiles 
  SET updated_at = now(),
      current_tenant_id = NULL
  WHERE id = target_user_id;
  
  -- Log the action
  INSERT INTO audit_logs (
    table_name, action, record_id, user_id, 
    new_values, created_at
  ) VALUES (
    'profiles', 'USER_REMOVED', target_user_id, auth.uid(),
    jsonb_build_object('removed_by', auth.uid(), 'removed_at', now()),
    now()
  );
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users (will be restricted by function logic)
GRANT EXECUTE ON FUNCTION remove_platform_user(UUID) TO authenticated;