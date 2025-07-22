-- Phase 1.2: Fix Critical Database Constraints and Data Validation

-- First, fix the foreign key constraint issues causing the postgres errors
-- The main issue is inconsistent patient_id references across tables

-- Drop problematic foreign keys that reference non-existent or inconsistent tables
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_patient_id_fkey;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS fk_appointments_provider;

-- Clean up invalid data that might cause constraint violations
DELETE FROM appointments WHERE patient_id NOT IN (SELECT id FROM auth.users);

-- Re-add proper foreign key constraints
ALTER TABLE appointments 
ADD CONSTRAINT appointments_patient_id_fkey 
FOREIGN KEY (patient_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix chat system foreign keys
ALTER TABLE chat_conversations DROP CONSTRAINT IF EXISTS fk_chat_conversations_patient;
ALTER TABLE chat_conversations DROP CONSTRAINT IF EXISTS fk_chat_conversations_staff;
ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS fk_chat_messages_sender;

-- Re-add proper chat foreign keys
ALTER TABLE chat_conversations 
ADD CONSTRAINT fk_chat_conversations_patient 
FOREIGN KEY (patient_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE chat_conversations 
ADD CONSTRAINT fk_chat_conversations_staff 
FOREIGN KEY (staff_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE chat_messages 
ADD CONSTRAINT fk_chat_messages_sender 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add missing RLS policies for tables that have RLS enabled but no policies
CREATE POLICY "Users can view their own user sessions" 
ON user_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own user sessions" 
ON user_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own user sessions" 
ON user_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add constraint validation for critical fields
ALTER TABLE appointments 
ADD CONSTRAINT appointments_date_future 
CHECK (date >= CURRENT_DATE - INTERVAL '1 year');

ALTER TABLE appointments 
ADD CONSTRAINT appointments_duration_positive 
CHECK (duration > 0 AND duration <= 480); -- Max 8 hours

-- Add data validation for intake submissions
ALTER TABLE intake_submissions 
ADD CONSTRAINT intake_submissions_priority_valid 
CHECK (priority_level IN ('low', 'normal', 'high', 'urgent'));

-- Add constraint for appointment status
ALTER TABLE appointments 
ADD CONSTRAINT appointments_status_valid 
CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'));

-- Add tenant_id validation trigger
CREATE OR REPLACE FUNCTION validate_tenant_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user has access to the tenant they're trying to use
  IF NEW.tenant_id IS NOT NULL AND NOT user_can_access_tenant(NEW.tenant_id) THEN
    RAISE EXCEPTION 'Access denied to tenant';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply validation trigger to key tables
DROP TRIGGER IF EXISTS validate_tenant_access_appointments ON appointments;
CREATE TRIGGER validate_tenant_access_appointments
  BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION validate_tenant_access();

DROP TRIGGER IF EXISTS validate_tenant_access_intake_submissions ON intake_submissions;  
CREATE TRIGGER validate_tenant_access_intake_submissions
  BEFORE INSERT OR UPDATE ON intake_submissions
  FOR EACH ROW EXECUTE FUNCTION validate_tenant_access();

-- Add updated_at triggers for tables missing them
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intake_submissions_updated_at
  BEFORE UPDATE ON intake_submissions  
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();