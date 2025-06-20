
-- Complete fix for infinite recursion in profiles policies
-- This migration removes all problematic policies and creates simple, non-recursive ones

-- First, drop ALL existing policies that might cause recursion
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_basic_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_basic_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_basic_update" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;

-- Temporarily disable RLS to clean up
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create the simplest possible policies that don't cause recursion
CREATE POLICY "profiles_simple_select" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_simple_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_simple_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Also fix appointments policies to be completely independent
DROP POLICY IF EXISTS "appointments_select_all" ON public.appointments;
DROP POLICY IF EXISTS "appointments_insert_auth" ON public.appointments;
DROP POLICY IF EXISTS "appointments_update_auth" ON public.appointments;
DROP POLICY IF EXISTS "appointments_basic_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_basic_insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments_basic_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_basic_delete" ON public.appointments;

-- Create simple appointment policies that don't reference profiles at all
CREATE POLICY "appointments_open_select" ON public.appointments
  FOR SELECT USING (true);

CREATE POLICY "appointments_auth_insert" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "appointments_auth_update" ON public.appointments
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "appointments_auth_delete" ON public.appointments
  FOR DELETE USING (auth.uid() IS NOT NULL);
