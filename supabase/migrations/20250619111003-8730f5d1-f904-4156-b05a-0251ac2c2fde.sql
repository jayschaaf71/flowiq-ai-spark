
-- First, create the security definer function to get current user role without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can delete appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can view active providers" ON public.providers;
DROP POLICY IF EXISTS "Staff can manage providers" ON public.providers;

-- Now recreate the policies properly using the function
CREATE POLICY "Users can view their own appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (
    auth.uid() = patient_id OR 
    public.get_current_user_role() IN ('staff', 'admin')
  );

CREATE POLICY "Staff can create appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (public.get_current_user_role() IN ('staff', 'admin'));

CREATE POLICY "Staff can update appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (public.get_current_user_role() IN ('staff', 'admin'));

CREATE POLICY "Staff can delete appointments" 
  ON public.appointments 
  FOR DELETE 
  USING (public.get_current_user_role() IN ('staff', 'admin'));

-- Enable RLS and add policies for providers table
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active providers" 
  ON public.providers 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Staff can manage providers" 
  ON public.providers 
  FOR ALL 
  USING (public.get_current_user_role() IN ('staff', 'admin'));
