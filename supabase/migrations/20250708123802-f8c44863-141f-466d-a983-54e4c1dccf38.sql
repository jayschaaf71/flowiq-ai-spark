-- Add specialty field to patients table to separate patient data by practice
ALTER TABLE public.patients 
ADD COLUMN specialty text;

-- Add index for better performance when filtering by specialty
CREATE INDEX idx_patients_specialty ON public.patients (specialty);

-- Update existing patients to have a default specialty (chiropractic) to avoid null values
UPDATE public.patients 
SET specialty = 'chiropractic' 
WHERE specialty IS NULL;