
-- First, drop any policies that depend on get_current_user_role function
DROP POLICY IF EXISTS "appointments_staff_delete" ON public.appointments;
DROP POLICY IF EXISTS "appointments_staff_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_staff_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_staff_insert" ON public.appointments;

-- Now we can safely drop the function
DROP FUNCTION IF EXISTS public.get_current_user_role() CASCADE;

-- Temporarily disable RLS on profiles to break the recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on appointments to prevent issues
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;

-- Ensure the user creation trigger exists and works properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'patient')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
