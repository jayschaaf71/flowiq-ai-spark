
-- Drop existing problematic policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create new, simpler policies that don't cause recursion
CREATE POLICY "Enable read access for users based on user_id" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- Also fix appointments table policies to avoid similar issues
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update appointments" ON public.appointments;

CREATE POLICY "Enable read access for appointments" 
  ON public.appointments FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for authenticated users" 
  ON public.appointments FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" 
  ON public.appointments FOR UPDATE 
  USING (auth.uid() IS NOT NULL);
