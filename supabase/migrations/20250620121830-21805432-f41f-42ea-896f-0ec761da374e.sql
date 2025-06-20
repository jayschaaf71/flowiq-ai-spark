
-- Fix the infinite recursion in profiles table policies
-- Drop all existing problematic policies
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;

-- Create simple, non-recursive policies that directly use auth.uid()
CREATE POLICY "users_can_read_own_profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile" ON public.profiles  
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Update the get_current_user_role function to be more stable
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(role, 'patient'::text) 
  FROM public.profiles 
  WHERE id = auth.uid() 
  LIMIT 1;
$$;

-- Fix appointment policies to avoid recursion
DROP POLICY IF EXISTS "appointments_patient_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_staff_insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments_staff_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_staff_delete" ON public.appointments;

-- Create appointment policies using the fixed function
CREATE POLICY "appointments_users_select" ON public.appointments
FOR SELECT USING (
  auth.uid() = patient_id OR 
  public.get_current_user_role() IN ('staff', 'admin')
);

CREATE POLICY "appointments_staff_insert" ON public.appointments
FOR INSERT WITH CHECK (public.get_current_user_role() IN ('staff', 'admin'));

CREATE POLICY "appointments_staff_update" ON public.appointments
FOR UPDATE USING (public.get_current_user_role() IN ('staff', 'admin'));

CREATE POLICY "appointments_staff_delete" ON public.appointments
FOR DELETE USING (public.get_current_user_role() IN ('staff', 'admin'));
