-- Fix the RLS policies for intake_forms table to properly check user roles from profiles table

-- Drop existing policies
DROP POLICY IF EXISTS "Staff can manage intake forms" ON public.intake_forms;
DROP POLICY IF EXISTS "Anyone can view active intake forms" ON public.intake_forms;

-- Create security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create new policies that properly check user role
CREATE POLICY "Staff can manage intake forms" 
ON public.intake_forms 
FOR ALL 
TO authenticated
USING (public.get_user_role(auth.uid()) = 'staff');

CREATE POLICY "Anyone can view active intake forms" 
ON public.intake_forms 
FOR SELECT 
USING (is_active = true);

-- Also allow authenticated users to create forms if they're staff
CREATE POLICY "Staff can create intake forms" 
ON public.intake_forms 
FOR INSERT 
TO authenticated
WITH CHECK (public.get_user_role(auth.uid()) = 'staff');