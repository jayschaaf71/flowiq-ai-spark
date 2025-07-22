-- Fix critical function search paths for security (only for existing functions)
DO $$ 
BEGIN
  -- Fix search paths for existing functions
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_user_role') THEN
    ALTER FUNCTION public.get_user_role(uuid) SET search_path = 'public';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_user_current_tenant') THEN
    ALTER FUNCTION public.get_user_current_tenant(uuid) SET search_path = 'public';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'user_belongs_to_tenant') THEN
    ALTER FUNCTION public.user_belongs_to_tenant(uuid, uuid) SET search_path = 'public';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'has_staff_access') THEN
    ALTER FUNCTION public.has_staff_access(uuid) SET search_path = 'public';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_user_role_text') THEN
    ALTER FUNCTION public.get_user_role_text(uuid) SET search_path = 'public';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_platform_admin') THEN
    ALTER FUNCTION public.is_platform_admin(uuid) SET search_path = 'public';
  END IF;
END $$;