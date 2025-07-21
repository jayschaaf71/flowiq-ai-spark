-- Fix database security issues identified by linter

-- 1. Fix function search paths for security
ALTER FUNCTION public.get_user_role(uuid) SET search_path = 'public';
ALTER FUNCTION public.update_calendar_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.get_user_current_tenant(uuid) SET search_path = 'public';
ALTER FUNCTION public.user_belongs_to_tenant(uuid, uuid) SET search_path = 'public';
ALTER FUNCTION public.set_tenant_id() SET search_path = 'public';
ALTER FUNCTION public.update_profitability_status() SET search_path = 'public';
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.log_phi_access() SET search_path = 'public';
ALTER FUNCTION public.is_platform_admin(uuid) SET search_path = 'public';
ALTER FUNCTION public.is_practice_admin(uuid, uuid) SET search_path = 'public';
ALTER FUNCTION public.can_access_platform_admin(uuid) SET search_path = 'public';
ALTER FUNCTION public.has_staff_access(uuid) SET search_path = 'public';
ALTER FUNCTION public.get_user_role_text(uuid) SET search_path = 'public';
ALTER FUNCTION public.create_tenant_from_onboarding(text, text, text, text, text, text, text, text) SET search_path = 'public';
ALTER FUNCTION public.create_follow_up_task_from_outcome() SET search_path = 'public';
ALTER FUNCTION public.get_platform_stats() SET search_path = 'public';
ALTER FUNCTION public.is_platform_admin_check() SET search_path = 'public';
ALTER FUNCTION public.calculate_tenant_metrics() SET search_path = 'public';
ALTER FUNCTION public.handle_updated_at() SET search_path = 'public';
ALTER FUNCTION public.user_can_access_tenant(uuid) SET search_path = 'public';
ALTER FUNCTION public.remove_platform_user(uuid) SET search_path = 'public';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';

-- 2. Add missing RLS policies for platform_performance table if it exists
-- This table was referenced but may not have policies

-- Enable RLS on platform_performance if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'platform_performance') THEN
    ALTER TABLE public.platform_performance ENABLE ROW LEVEL SECURITY;
    
    -- Platform admins can manage performance data
    CREATE POLICY "platform_admins_can_manage_performance" ON public.platform_performance
      FOR ALL
      USING (is_platform_admin(auth.uid()));
  END IF;
END $$;

-- Enable RLS on platform_revenue if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'platform_revenue') THEN
    ALTER TABLE public.platform_revenue ENABLE ROW LEVEL SECURITY;
    
    -- Platform admins can manage revenue data
    CREATE POLICY "platform_admins_can_manage_revenue" ON public.platform_revenue
      FOR ALL
      USING (is_platform_admin(auth.uid()));
  END IF;
END $$;

-- Enable RLS on platform_alerts if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'platform_alerts') THEN
    ALTER TABLE public.platform_alerts ENABLE ROW LEVEL SECURITY;
    
    -- Platform admins can manage alerts
    CREATE POLICY "platform_admins_can_manage_alerts" ON public.platform_alerts
      FOR ALL
      USING (is_platform_admin(auth.uid()));
  END IF;
END $$;

-- Enable RLS on tenant_usage_metrics if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tenant_usage_metrics') THEN
    ALTER TABLE public.tenant_usage_metrics ENABLE ROW LEVEL SECURITY;
    
    -- Platform admins can view all metrics
    CREATE POLICY "platform_admins_can_view_all_metrics" ON public.tenant_usage_metrics
      FOR SELECT
      USING (is_platform_admin(auth.uid()));
      
    -- Tenant admins can view their own metrics
    CREATE POLICY "tenant_admins_can_view_own_metrics" ON public.tenant_usage_metrics
      FOR SELECT
      USING (
        tenant_id IN (
          SELECT tenant_users.tenant_id
          FROM tenant_users
          WHERE tenant_users.user_id = auth.uid() 
          AND tenant_users.is_active = true
        )
      );
  END IF;
END $$;