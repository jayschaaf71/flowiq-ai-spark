-- Fix the RLS policy for patients table to work with the current role system
-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Users can manage patients in their tenant" ON public.patients;
DROP POLICY IF EXISTS "Patients can view their own record" ON public.patients;

-- Create new policies that work with the current system
-- Allow staff users in the same tenant to manage patients
CREATE POLICY "Staff can manage patients in their tenant" ON public.patients
FOR ALL USING (
  patients.tenant_id IN (
    SELECT tu.tenant_id 
    FROM tenant_users tu 
    JOIN profiles p ON tu.user_id = p.id
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true 
    AND p.role IN ('platform_admin', 'practice_admin', 'practice_manager', 'provider', 'staff')
  )
);

-- Allow patients to view their own records if they are the patient
CREATE POLICY "Patients can view own record" ON public.patients
FOR SELECT USING (auth.uid() = patients.id);

-- Allow authenticated users to insert patients if they have staff access
CREATE POLICY "Staff can create patients" ON public.patients
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM tenant_users tu 
    JOIN profiles p ON tu.user_id = p.id
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true 
    AND p.role IN ('platform_admin', 'practice_admin', 'practice_manager', 'provider', 'staff')
    AND tu.tenant_id = patients.tenant_id
  )
);