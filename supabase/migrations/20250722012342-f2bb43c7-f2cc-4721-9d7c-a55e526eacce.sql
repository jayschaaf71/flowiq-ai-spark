-- Phase 1.2 Final: Clean Data and Complete Security Setup

-- First, clean up invalid phone data in appointments table
UPDATE appointments 
SET phone = NULL 
WHERE phone IS NOT NULL 
  AND NOT (phone ~* '^\+?[1-9]\d{1,14}$|^\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$');

-- Now add the phone validation constraint
ALTER TABLE appointments 
ADD CONSTRAINT appointments_phone_valid 
CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$|^\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$');

-- Clean up invalid email data
UPDATE appointments 
SET email = NULL 
WHERE email IS NOT NULL 
  AND NOT (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add the email validation constraint
ALTER TABLE appointments 
ADD CONSTRAINT appointments_email_valid 
CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create comprehensive input validation for form submissions
CREATE OR REPLACE FUNCTION validate_and_sanitize_submission()
RETURNS TRIGGER AS $$
DECLARE
  key TEXT;
  value TEXT;
  sanitized_data JSONB := '{}';
BEGIN
  -- Sanitize and validate each field in submission_data
  FOR key, value IN SELECT * FROM jsonb_each_text(NEW.submission_data)
  LOOP
    -- Basic sanitization: trim whitespace, limit length, remove dangerous chars
    value := LEFT(TRIM(value), 1000);
    value := REGEXP_REPLACE(value, '[<>''";\\]', '', 'g');
    
    -- Specific validation based on field names
    CASE 
      WHEN key ILIKE '%email%' THEN
        IF value != '' AND NOT (value ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
          RAISE EXCEPTION 'Invalid email format in field: %', key;
        END IF;
      WHEN key ILIKE '%phone%' THEN
        IF value != '' AND NOT (value ~* '^\+?[1-9]\d{1,14}$|^\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$') THEN
          RAISE EXCEPTION 'Invalid phone format in field: %', key;
        END IF;
      WHEN key ILIKE '%age%' OR key ILIKE '%year%' THEN
        IF value != '' AND NOT (value ~ '^\d{1,3}$' AND value::integer BETWEEN 0 AND 150) THEN
          RAISE EXCEPTION 'Invalid age/year value in field: %', key;
        END IF;
      ELSE
        -- General text validation
        NULL;
    END CASE;
    
    sanitized_data := sanitized_data || jsonb_build_object(key, value);
  END LOOP;
  
  NEW.submission_data := sanitized_data;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the validation trigger
DROP TRIGGER IF EXISTS validate_intake_submission_trigger ON intake_submissions;
CREATE TRIGGER validate_intake_submission_trigger
  BEFORE INSERT OR UPDATE ON intake_submissions
  FOR EACH ROW EXECUTE FUNCTION validate_and_sanitize_submission();

-- Create function for consistent tenant_id setting
CREATE OR REPLACE FUNCTION ensure_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  -- If tenant_id is not provided, try to get it from user's current tenant
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id := get_user_current_tenant(auth.uid());
  END IF;
  
  -- Validate user has access to this tenant
  IF NEW.tenant_id IS NOT NULL AND NOT user_can_access_tenant(NEW.tenant_id) THEN
    RAISE EXCEPTION 'User does not have access to specified tenant';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply tenant validation to critical tables
DROP TRIGGER IF EXISTS ensure_tenant_id_appointments ON appointments;
CREATE TRIGGER ensure_tenant_id_appointments
  BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION ensure_tenant_id();

DROP TRIGGER IF EXISTS ensure_tenant_id_intake_submissions ON intake_submissions;
CREATE TRIGGER ensure_tenant_id_intake_submissions
  BEFORE INSERT OR UPDATE ON intake_submissions
  FOR EACH ROW EXECUTE FUNCTION ensure_tenant_id();

-- Create audit trail for sensitive data changes
CREATE OR REPLACE FUNCTION audit_sensitive_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log changes to sensitive tables
  INSERT INTO audit_logs (
    table_name,
    action,
    record_id,
    user_id,
    old_values,
    new_values,
    tenant_id,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
    COALESCE(NEW.tenant_id, OLD.tenant_id),
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_appointments ON appointments;
CREATE TRIGGER audit_appointments
  AFTER INSERT OR UPDATE OR DELETE ON appointments
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_changes();

DROP TRIGGER IF EXISTS audit_intake_submissions ON intake_submissions;
CREATE TRIGGER audit_intake_submissions
  AFTER INSERT OR UPDATE OR DELETE ON intake_submissions
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_changes();