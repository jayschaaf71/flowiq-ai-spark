
-- First, let's completely drop and recreate all policies to ensure clean state
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "users_can_read_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.profiles;

-- Drop appointment policies
DROP POLICY IF EXISTS "Enable read access for appointments" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.appointments;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.appointments;
DROP POLICY IF EXISTS "appointments_users_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_staff_insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments_staff_update" ON public.appointments;

-- Create the simplest possible policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles  
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Create simple policies for appointments that don't reference profiles
CREATE POLICY "appointments_select_all" ON public.appointments
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "appointments_insert_auth" ON public.appointments
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "appointments_update_auth" ON public.appointments
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Fix the get_current_user_role function to avoid any potential recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1),
    'patient'::text
  );
$$;
