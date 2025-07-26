-- Phase 1: Fix Database Inconsistencies
-- Update user profiles to have correct specialty based on their tenant

-- Update users with dental-sleep tenant to have dental-sleep-medicine specialty
UPDATE profiles 
SET specialty = 'dental-sleep-medicine'
WHERE current_tenant_id = 'd52278c3-bf0d-4731-bfa9-a40f032fa305';

-- Update users with chiropractic tenant to have chiropractic-care specialty  
UPDATE profiles
SET specialty = 'chiropractic-care'
WHERE current_tenant_id = '024e36c1-a1bc-44d0-8805-3162ba59a0c2';

-- Create function to automatically sync user specialty with tenant
CREATE OR REPLACE FUNCTION sync_user_specialty()
RETURNS TRIGGER AS $$
BEGIN
    -- If current_tenant_id is being updated, sync the specialty
    IF NEW.current_tenant_id IS NOT NULL AND (OLD.current_tenant_id IS NULL OR OLD.current_tenant_id != NEW.current_tenant_id) THEN
        -- Map tenant to specialty
        IF NEW.current_tenant_id = 'd52278c3-bf0d-4731-bfa9-a40f032fa305' THEN
            NEW.specialty = 'dental-sleep-medicine';
        ELSIF NEW.current_tenant_id = '024e36c1-a1bc-44d0-8805-3162ba59a0c2' THEN
            NEW.specialty = 'chiropractic-care';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically sync specialty when tenant changes
DROP TRIGGER IF EXISTS trigger_sync_user_specialty ON profiles;
CREATE TRIGGER trigger_sync_user_specialty
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_specialty();