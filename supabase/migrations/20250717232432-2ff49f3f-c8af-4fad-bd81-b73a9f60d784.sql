-- CRITICAL SECURITY FIXES
-- Fix 1: Remove insecure RLS policy that references user metadata
DROP POLICY IF EXISTS "Platform admins can view all profiles" ON profiles;

-- Fix 2: Create secure RLS policy using direct auth check (no user metadata reference)
CREATE POLICY "Platform admins can view all profiles" 
ON profiles 
FOR SELECT 
USING (
  -- Check if user has platform_admin role in profiles table (not metadata)
  EXISTS (
    SELECT 1 FROM profiles p2 
    WHERE p2.id = auth.uid() 
    AND p2.role = 'platform_admin'::app_role
  )
);

-- Fix 3: Secure all database functions with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT role::text FROM public.profiles WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_current_tenant(user_id uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT current_tenant_id FROM public.profiles WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.user_belongs_to_tenant(user_id uuid, tenant_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_users 
    WHERE user_id = $1 AND tenant_id = $2 AND is_active = true
  );
$function$;

CREATE OR REPLACE FUNCTION public.set_tenant_id()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id := get_user_current_tenant(auth.uid());
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_platform_admin(user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'platform_admin'::app_role
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_practice_admin(user_id uuid DEFAULT auth.uid(), check_tenant_id uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.tenant_users tu ON p.id = tu.user_id
    WHERE p.id = user_id 
    AND p.role IN ('practice_admin'::app_role, 'platform_admin'::app_role)
    AND (check_tenant_id IS NULL OR tu.tenant_id = check_tenant_id)
    AND tu.is_active = true
  );
$function$;

CREATE OR REPLACE FUNCTION public.can_access_platform_admin(user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT role = 'platform_admin'::app_role 
  FROM public.profiles 
  WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.has_staff_access(user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT role IN ('platform_admin'::app_role, 'practice_admin'::app_role, 'practice_manager'::app_role, 'provider'::app_role, 'staff'::app_role)
  FROM public.profiles 
  WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role_text(user_id uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT role::text FROM public.profiles WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.user_can_access_tenant(tenant_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.remove_platform_user(target_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix 4: Add missing RLS policies for tables without them
-- Check which tables need RLS policies by enabling them first

-- Enable RLS on tables that don't have it but should
ALTER TABLE IF EXISTS public.calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.calendar_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dme_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.external_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.oral_appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.platform_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.platform_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.provider_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.voice_calls ENABLE ROW LEVEL SECURITY;

-- Add basic RLS policies for these tables
CREATE POLICY "Staff can manage calendar integrations" ON public.calendar_integrations
FOR ALL USING (has_staff_access(auth.uid()));

CREATE POLICY "Staff can view calendar sync logs" ON public.calendar_sync_logs
FOR SELECT USING (has_staff_access(auth.uid()));

CREATE POLICY "Staff can manage DME orders" ON public.dme_orders
FOR ALL USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their DME orders" ON public.dme_orders
FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Staff can manage external calendar events" ON public.external_calendar_events
FOR ALL USING (has_staff_access(auth.uid()));

CREATE POLICY "Staff can manage oral appliances" ON public.oral_appliances
FOR ALL USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their oral appliances" ON public.oral_appliances
FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Platform admins can manage alerts" ON public.platform_alerts
FOR ALL USING (is_platform_admin(auth.uid()));

CREATE POLICY "Platform admins can manage revenue" ON public.platform_revenue
FOR ALL USING (is_platform_admin(auth.uid()));

CREATE POLICY "Staff can view their provider notifications" ON public.provider_notifications
FOR SELECT USING (auth.uid() = provider_id OR has_staff_access(auth.uid()));

CREATE POLICY "Staff can manage provider notifications" ON public.provider_notifications
FOR ALL USING (has_staff_access(auth.uid()));

CREATE POLICY "Users can view their team memberships" ON public.team_members
FOR SELECT USING (auth.uid() = user_id OR has_staff_access(auth.uid()));

CREATE POLICY "Staff can manage team members" ON public.team_members
FOR ALL USING (has_staff_access(auth.uid()));

CREATE POLICY "Users can view their tenant memberships" ON public.tenant_users
FOR SELECT USING (auth.uid() = user_id OR has_staff_access(auth.uid()));

CREATE POLICY "Staff can manage tenant users" ON public.tenant_users
FOR ALL USING (has_staff_access(auth.uid()));

CREATE POLICY "Users can view their own sessions" ON public.user_sessions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage user sessions" ON public.user_sessions
FOR ALL USING (true);

CREATE POLICY "Staff can manage voice calls" ON public.voice_calls
FOR ALL USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their voice calls" ON public.voice_calls
FOR SELECT USING (auth.uid() = patient_id);