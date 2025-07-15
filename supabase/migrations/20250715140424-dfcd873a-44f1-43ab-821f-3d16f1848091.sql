-- Fix Security Issues Migration

-- 1. Add RLS policies for reminder_logs table
CREATE POLICY "Users can view their own reminder logs" 
ON public.reminder_logs 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Staff can manage all reminder logs" 
ON public.reminder_logs 
FOR ALL 
USING (has_staff_access(auth.uid()));

-- 2. Fix function search path vulnerabilities by setting fixed search paths
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role::text FROM public.profiles WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_current_tenant(user_id uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT current_tenant_id FROM public.profiles WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.user_belongs_to_tenant(user_id uuid, tenant_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
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
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id := get_user_current_tenant(auth.uid());
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_phi_access()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Log any access to sensitive patient data
  INSERT INTO public.audit_logs (
    table_name,
    action,
    record_id,
    user_id,
    old_values,
    new_values,
    user_agent,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.id::text, OLD.id::text),
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown'),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.user_sessions 
  SET is_active = false, logout_reason = 'expired'
  WHERE expires_at < now() AND is_active = true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_tenant_from_onboarding(p_name text, p_subdomain text, p_specialty text, p_practice_type text, p_business_name text DEFAULT NULL::text, p_address text DEFAULT NULL::text, p_phone text DEFAULT NULL::text, p_email text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_tenant_id UUID;
  v_user_id UUID;
BEGIN
  -- Get the current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Create the tenant
  INSERT INTO public.tenants (
    name, subdomain, specialty, practice_type, owner_id,
    business_name, address, phone, email
  ) VALUES (
    p_name, p_subdomain, p_specialty, p_practice_type, v_user_id,
    p_business_name, p_address, p_phone, p_email
  ) RETURNING id INTO v_tenant_id;
  
  -- Add the user as the owner
  INSERT INTO public.tenant_users (tenant_id, user_id, role, joined_at)
  VALUES (v_tenant_id, v_user_id, 'owner', now());
  
  -- Update the user's profile to set current tenant
  UPDATE public.profiles 
  SET current_tenant_id = v_tenant_id, tenant_id = v_tenant_id
  WHERE id = v_user_id;
  
  RETURN v_tenant_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_follow_up_task_from_outcome()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_patient_id UUID;
  v_tenant_id UUID;
BEGIN
  -- Get patient_id and tenant_id from the associated voice call
  SELECT vc.patient_id, vc.tenant_id 
  INTO v_patient_id, v_tenant_id
  FROM public.voice_calls vc 
  WHERE vc.id = NEW.call_id;
  
  -- Only create follow-up task if follow_up_required is true
  IF NEW.follow_up_required AND NEW.follow_up_date IS NOT NULL THEN
    INSERT INTO public.follow_up_tasks (
      call_outcome_id,
      patient_id,
      task_type,
      scheduled_for,
      message_template,
      tenant_id
    ) VALUES (
      NEW.id,
      v_patient_id,
      COALESCE(NEW.follow_up_type, 'call'),
      NEW.follow_up_date,
      CASE 
        WHEN NEW.follow_up_type = 'sms' THEN 'Hi {{patient_name}}, following up on our recent conversation. Please let us know if you have any questions!'
        WHEN NEW.follow_up_type = 'email' THEN 'Thank you for your time today. We wanted to follow up on our conversation and see if you have any additional questions.'
        ELSE 'Follow-up call scheduled based on previous conversation'
      END,
      v_tenant_id
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_platform_admin(user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
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
 SET search_path TO 'public'
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
 SET search_path TO 'public'
AS $function$
  SELECT role = 'platform_admin'::app_role 
  FROM public.profiles 
  WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.has_staff_access(user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role IN ('platform_admin'::app_role, 'practice_admin'::app_role, 'practice_manager'::app_role, 'provider'::app_role, 'staff'::app_role)
  FROM public.profiles 
  WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role_text(user_id uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role::text FROM public.profiles WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_tenant_metrics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Update tenant usage metrics daily
  INSERT INTO public.tenant_usage_metrics (tenant_id, active_users, storage_gb, api_calls)
  SELECT 
    t.id as tenant_id,
    COUNT(DISTINCT p.id) as active_users,
    0 as storage_gb, -- placeholder for actual storage calculation
    0 as api_calls -- placeholder for actual API call counting
  FROM public.tenants t
  LEFT JOIN public.profiles p ON p.tenant_id = t.id
  WHERE t.is_active = true
  GROUP BY t.id
  ON CONFLICT (tenant_id, metric_date) 
  DO UPDATE SET 
    active_users = EXCLUDED.active_users,
    updated_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.user_can_access_tenant(tenant_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
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
 SET search_path TO 'public'
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

-- Note: handle_new_user function is already secure and doesn't need search path changes
-- as it's designed to handle potential errors safely

-- 3. Update phi_access_summary view to use SECURITY INVOKER (if it exists)
DROP VIEW IF EXISTS public.phi_access_summary;
CREATE VIEW public.phi_access_summary 
SECURITY INVOKER
AS 
SELECT 
  DATE(created_at) as access_date,
  table_name,
  action,
  COUNT(*) as access_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT record_id) as unique_records
FROM public.audit_logs
WHERE table_name IN ('patients', 'medical_records', 'prescriptions', 'appointments')
GROUP BY DATE(created_at), table_name, action;

-- 4. Update platform_user_management view to use SECURITY INVOKER (if it exists)
DROP VIEW IF EXISTS public.platform_user_management;
CREATE VIEW public.platform_user_management 
SECURITY INVOKER
AS
SELECT 
  p.id,
  p.role,
  p.created_at,
  p.updated_at,
  p.current_tenant_id,
  tu.is_active as tenant_user_active,
  p.first_name,
  p.last_name,
  CONCAT(p.first_name, ' ', p.last_name) as full_name,
  p.contact_email as email,
  t.name as tenant_name,
  CASE 
    WHEN tu.is_active THEN 'active'
    ELSE 'inactive'
  END as status
FROM public.profiles p
LEFT JOIN public.tenant_users tu ON p.id = tu.user_id
LEFT JOIN public.tenants t ON tu.tenant_id = t.id
WHERE p.role != 'patient'::app_role OR p.role IS NULL;