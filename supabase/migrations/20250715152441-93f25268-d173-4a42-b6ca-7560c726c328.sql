-- Fix the audit logging trigger to properly handle UUID conversion
CREATE OR REPLACE FUNCTION public.log_phi_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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
    COALESCE(NEW.id, OLD.id), -- This should be UUID, not text
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown'),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$