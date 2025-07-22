-- Phase 1.2 Continued: Complete Data Validation & Security Setup

-- Drop the existing trigger that's causing conflict, then recreate properly
DROP TRIGGER IF EXISTS update_intake_submissions_updated_at ON intake_submissions;

-- Create the updated_at trigger properly
CREATE TRIGGER update_intake_submissions_updated_at
  BEFORE UPDATE ON intake_submissions  
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add input sanitization function for form data
CREATE OR REPLACE FUNCTION sanitize_form_data(input_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result JSONB := '{}';
  key TEXT;
  value TEXT;
BEGIN
  -- Sanitize each key-value pair in the JSON
  FOR key, value IN SELECT * FROM jsonb_each_text(input_data)
  LOOP
    -- Remove potentially dangerous characters and limit length
    value := LEFT(TRIM(value), 1000);
    value := REGEXP_REPLACE(value, '[<>''";]', '', 'g');
    result := result || jsonb_build_object(key, value);
  END LOOP;
  
  RETURN result;
END;
$$;

-- Create function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Create function to validate phone format
CREATE OR REPLACE FUNCTION is_valid_phone(phone TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Allow various phone formats: (123) 456-7890, 123-456-7890, 123.456.7890, +1234567890
  RETURN phone ~* '^\+?[1-9]\d{1,14}$|^\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$';
END;
$$;

-- Add email validation to tables with email fields
ALTER TABLE appointments 
ADD CONSTRAINT appointments_email_valid 
CHECK (email IS NULL OR is_valid_email(email));

-- Add phone validation 
ALTER TABLE appointments 
ADD CONSTRAINT appointments_phone_valid 
CHECK (phone IS NULL OR is_valid_phone(phone));

-- Add validation trigger for intake submissions to sanitize data
CREATE OR REPLACE FUNCTION validate_intake_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Sanitize submission data
  NEW.submission_data := sanitize_form_data(NEW.submission_data);
  
  -- Validate required fields based on form type
  IF NEW.submission_data ? 'email' THEN
    IF NOT is_valid_email(NEW.submission_data->>'email') THEN
      RAISE EXCEPTION 'Invalid email format';
    END IF;
  END IF;
  
  IF NEW.submission_data ? 'phone' THEN
    IF NOT is_valid_phone(NEW.submission_data->>'phone') THEN
      RAISE EXCEPTION 'Invalid phone format';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_intake_submission_trigger ON intake_submissions;
CREATE TRIGGER validate_intake_submission_trigger
  BEFORE INSERT OR UPDATE ON intake_submissions
  FOR EACH ROW EXECUTE FUNCTION validate_intake_submission();

-- Enable password strength validation
UPDATE auth.config 
SET password_min_length = 8;

-- Rate limiting for sensitive operations (prevent brute force)
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user ID
  action TEXT NOT NULL, -- login, signup, password_reset
  attempts INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on rate_limits table
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow system to manage rate limits
CREATE POLICY "System can manage rate limits" 
ON rate_limits 
FOR ALL 
USING (true);

-- Create function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_action TEXT,
  p_limit INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_attempts INTEGER;
BEGIN
  -- Clean up old entries
  DELETE FROM rate_limits 
  WHERE window_start < NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Get current attempts in window
  SELECT COALESCE(SUM(attempts), 0) INTO current_attempts
  FROM rate_limits 
  WHERE identifier = p_identifier 
    AND action = p_action 
    AND window_start > NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- If under limit, record attempt and allow
  IF current_attempts < p_limit THEN
    INSERT INTO rate_limits (identifier, action) 
    VALUES (p_identifier, p_action)
    ON CONFLICT (identifier, action) 
    DO UPDATE SET attempts = rate_limits.attempts + 1;
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;