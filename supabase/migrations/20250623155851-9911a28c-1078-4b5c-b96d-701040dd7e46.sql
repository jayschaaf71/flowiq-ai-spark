
-- Update the patients table to support onboarding workflow integration
ALTER TABLE patients ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS onboarding_submission_id UUID REFERENCES intake_submissions(id);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_patients_onboarding_submission ON patients(onboarding_submission_id);

-- Update intake_submissions to link back to created patient records
ALTER TABLE intake_submissions ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES patients(id);
CREATE INDEX IF NOT EXISTS idx_intake_submissions_patient ON intake_submissions(patient_id);

-- Create a view that combines patient data with their onboarding information
CREATE OR REPLACE VIEW patient_onboarding_summary AS
SELECT 
  p.*,
  i.form_data as onboarding_data,
  i.ai_summary as onboarding_summary,
  i.status as onboarding_status,
  i.created_at as onboarding_date
FROM patients p
LEFT JOIN intake_submissions i ON p.onboarding_submission_id = i.id;
