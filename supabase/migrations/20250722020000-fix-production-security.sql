
-- Fix incomplete patients table RLS policy migration
-- Complete the truncated migration from 20250702225246

-- Create comprehensive RLS policies for patients table
CREATE POLICY "Tenant users can view patients in their tenant" 
ON public.patients 
FOR SELECT 
USING (
  tenant_id IN (
    SELECT tu.tenant_id 
    FROM tenant_users tu 
    JOIN profiles p ON tu.user_id = p.id
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true 
    AND p.role IN ('platform_admin', 'practice_admin', 'practice_manager', 'provider', 'staff')
  )
);

CREATE POLICY "Staff can manage patients in their tenant" 
ON public.patients 
FOR ALL 
USING (
  tenant_id IN (
    SELECT tu.tenant_id 
    FROM tenant_users tu 
    JOIN profiles p ON tu.user_id = p.id
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true 
    AND p.role IN ('platform_admin', 'practice_admin', 'practice_manager', 'provider', 'staff')
  )
);

-- Add missing RLS policies for rate_limits table
CREATE POLICY "System can manage rate limits for security" 
ON public.rate_limits 
FOR ALL 
USING (true);

-- Add missing RLS policy for appointment_analytics
CREATE POLICY "Staff can view appointment analytics in their tenant" 
ON public.appointment_analytics 
FOR SELECT 
USING (
  tenant_id IN (
    SELECT tu.tenant_id 
    FROM tenant_users tu 
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true
  ) 
  AND has_staff_access(auth.uid())
);

-- Fix security definer functions to prevent potential privilege escalation
CREATE OR REPLACE FUNCTION public.user_can_access_tenant(check_tenant_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Get user role safely
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  
  -- Platform admins can access all tenants
  IF user_role = 'platform_admin'::app_role THEN
    RETURN TRUE;
  END IF;
  
  -- Regular users can access tenants they own or belong to
  RETURN EXISTS (
    SELECT 1 FROM public.tenants t 
    WHERE t.id = check_tenant_id AND t.owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.tenant_users tu 
    WHERE tu.tenant_id = check_tenant_id 
    AND tu.user_id = auth.uid() 
    AND tu.is_active = true
  );
END;
$$;

-- Create audit function for security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  event_details jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO audit_logs (
    table_name,
    action,
    record_id,
    user_id,
    new_values,
    created_at
  ) VALUES (
    'security_events',
    event_type,
    gen_random_uuid(),
    auth.uid(),
    event_details,
    now()
  );
END;
$$;
