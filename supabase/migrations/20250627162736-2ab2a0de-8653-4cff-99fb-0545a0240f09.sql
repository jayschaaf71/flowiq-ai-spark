
-- First, create the get_current_user_role function that's referenced in the policies
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(role, 'patient') FROM public.profiles WHERE id = auth.uid();
$$;

-- Now fix the database schema to properly link profiles and patients
-- First, let's update the patients table to have a proper relationship with profiles
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES public.profiles(id);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_patients_profile_id ON public.patients(profile_id);

-- Update existing patients to link to profiles where possible
UPDATE public.patients 
SET profile_id = id 
WHERE profile_id IS NULL AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = patients.id);

-- Now let's update the appointments table to also reference profiles directly
-- This gives us flexibility to reference either patients or profiles
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES public.profiles(id);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_profile_id ON public.appointments(profile_id);

-- For existing appointments, try to link them to profiles via patients
UPDATE public.appointments 
SET profile_id = (SELECT profile_id FROM public.patients WHERE patients.id = appointments.patient_id)
WHERE profile_id IS NULL AND patient_id IS NOT NULL;

-- Update RLS policies to work with both patient_id and profile_id
DROP POLICY IF EXISTS "Users can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update appointments" ON public.appointments;

-- Create new RLS policies that handle both profile_id and patient_id relationships
CREATE POLICY "Users can view appointments" 
  ON public.appointments 
  FOR SELECT 
  TO authenticated
  USING (
    profile_id = auth.uid() OR 
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()) OR
    public.get_current_user_role() IN ('staff', 'admin')
  );

CREATE POLICY "Users can create appointments" 
  ON public.appointments 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    profile_id = auth.uid() OR 
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()) OR
    public.get_current_user_role() IN ('staff', 'admin')
  );

CREATE POLICY "Users can update appointments" 
  ON public.appointments 
  FOR UPDATE 
  TO authenticated
  USING (
    profile_id = auth.uid() OR 
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()) OR
    public.get_current_user_role() IN ('staff', 'admin')
  );

-- Also update patients RLS policies to work with profile_id
DROP POLICY IF EXISTS "Users can create patients" ON public.patients;
DROP POLICY IF EXISTS "Users can view patients" ON public.patients;
DROP POLICY IF EXISTS "Users can update patients" ON public.patients;

CREATE POLICY "Users can create patients" 
  ON public.patients 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    profile_id = auth.uid() OR 
    public.get_current_user_role() IN ('staff', 'admin')
  );

CREATE POLICY "Users can view patients" 
  ON public.patients 
  FOR SELECT 
  TO authenticated
  USING (
    profile_id = auth.uid() OR 
    public.get_current_user_role() IN ('staff', 'admin')
  );

CREATE POLICY "Users can update patients" 
  ON public.patients 
  FOR UPDATE 
  TO authenticated
  USING (
    profile_id = auth.uid() OR 
    public.get_current_user_role() IN ('staff', 'admin')
  );
