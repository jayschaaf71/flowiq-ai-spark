-- Add specialty field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN specialty text DEFAULT 'General Practice';

-- Update existing users with default specialty
UPDATE public.profiles 
SET specialty = 'General Practice' 
WHERE specialty IS NULL;