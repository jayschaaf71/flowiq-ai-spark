-- CRITICAL SECURITY FIXES - Part 2 (targeted fixes)

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

-- Fix 3: Secure remaining database functions with proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.user_sessions 
  SET is_active = false, logout_reason = 'expired'
  WHERE expires_at < now() AND is_active = true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_phi_access()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown'),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_tenant_from_onboarding(p_name text, p_subdomain text, p_specialty text, p_practice_type text, p_business_name text DEFAULT NULL::text, p_address text DEFAULT NULL::text, p_phone text DEFAULT NULL::text, p_email text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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
 SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.get_platform_stats()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  result JSON;
  total_tenants INTEGER;
  active_tenants INTEGER;
  total_users INTEGER;
  latest_performance RECORD;
  total_revenue NUMERIC;
  critical_alerts INTEGER;
BEGIN
  -- Check if user is platform admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'platform_admin'::app_role
  ) THEN
    RAISE EXCEPTION 'Access denied: Platform admin role required';
  END IF;

  -- Get tenant stats
  SELECT COUNT(*) INTO total_tenants FROM public.tenants;
  SELECT COUNT(*) INTO active_tenants FROM public.tenants WHERE is_active = true;
  
  -- Get user stats
  SELECT COUNT(*) INTO total_users FROM public.profiles;
  
  -- Get latest performance metrics
  SELECT * INTO latest_performance 
  FROM public.platform_performance 
  ORDER BY recorded_at DESC 
  LIMIT 1;
  
  -- Get total revenue (last 30 days)
  SELECT COALESCE(SUM(amount), 0) INTO total_revenue
  FROM public.platform_revenue 
  WHERE period_start >= CURRENT_DATE - INTERVAL '30 days';
  
  -- Get critical alerts count
  SELECT COUNT(*) INTO critical_alerts
  FROM public.platform_alerts 
  WHERE severity = 'critical' AND status = 'active';
  
  -- Build result
  result := json_build_object(
    'totalTenants', total_tenants,
    'activeTenants', active_tenants,
    'totalUsers', total_users,
    'averageResponseTime', COALESCE(latest_performance.response_time_ms, 120),
    'systemUptime', 99.9,
    'resourceUtilization', COALESCE(latest_performance.cpu_usage_percent, 45),
    'totalRevenue', total_revenue,
    'criticalAlerts', critical_alerts,
    'lastUpdated', EXTRACT(EPOCH FROM now())
  );
  
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_tenant_metrics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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

-- Fix 4: Add missing RLS policies for tables that don't have them
-- Only add policies that don't exist

-- Calendar integrations
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'calendar_integrations' 
    AND policyname = 'Staff can manage calendar integrations'
  ) THEN
    CREATE POLICY "Staff can manage calendar integrations" ON public.calendar_integrations
    FOR ALL USING (has_staff_access(auth.uid()));
  END IF;
END $$;

-- Voice calls  
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'voice_calls' 
    AND policyname = 'Staff can manage voice calls'
  ) THEN
    CREATE POLICY "Staff can manage voice calls" ON public.voice_calls
    FOR ALL USING (has_staff_access(auth.uid()));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'voice_calls' 
    AND policyname = 'Patients can view their voice calls'
  ) THEN
    CREATE POLICY "Patients can view their voice calls" ON public.voice_calls
    FOR SELECT USING (auth.uid() = patient_id);
  END IF;
END $$;