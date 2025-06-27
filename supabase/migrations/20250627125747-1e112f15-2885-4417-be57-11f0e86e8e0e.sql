
-- Check if there are any RLS policies on the patients table and create appropriate ones
-- First, let's see what policies exist and then create the necessary ones for patient creation

-- Enable RLS on patients table if not already enabled
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Users can create patients" ON public.patients;
DROP POLICY IF EXISTS "Users can view patients" ON public.patients;
DROP POLICY IF EXISTS "Users can update patients" ON public.patients;

-- Create policy to allow authenticated users to create patients
CREATE POLICY "Users can create patients" 
  ON public.patients 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to view patients
CREATE POLICY "Users can view patients" 
  ON public.patients 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update patients
CREATE POLICY "Users can update patients" 
  ON public.patients 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Also check appointments table RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Drop and recreate appointment policies
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update appointments" ON public.appointments;

-- Create policies for appointments
CREATE POLICY "Users can create appointments" 
  ON public.appointments 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view appointments" 
  ON public.appointments 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can update appointments" 
  ON public.appointments 
  FOR UPDATE 
  TO authenticated
  USING (true);
