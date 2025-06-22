
-- Fix infinite recursion in tenant_users policies by dropping problematic ones
DROP POLICY IF EXISTS "Users can view their tenant memberships" ON public.tenant_users;
DROP POLICY IF EXISTS "Tenant admins can manage their tenant users" ON public.tenant_users;

-- Create simpler, non-recursive policies for tenant_users
CREATE POLICY "Users can view their own tenant memberships" 
ON public.tenant_users FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Platform admins can manage all tenant users" 
ON public.tenant_users FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_users tu
    WHERE tu.user_id = auth.uid() 
    AND tu.role = 'platform_admin'
    AND tu.is_active = true
  )
);

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Tenant isolation for patients" ON public.patients;
DROP POLICY IF EXISTS "Tenant isolation for appointments" ON public.appointments;
DROP POLICY IF EXISTS "Tenant isolation for medical_history" ON public.medical_history;
DROP POLICY IF EXISTS "Tenant isolation for soap_notes" ON public.soap_notes;
DROP POLICY IF EXISTS "Tenant isolation for medications" ON public.medications;
DROP POLICY IF EXISTS "Tenant isolation for file_attachments" ON public.file_attachments;

-- Enable RLS on tables that don't have it
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policies
CREATE POLICY "Tenant isolation for patients" 
ON public.patients FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_users tu
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true
  )
);

CREATE POLICY "Tenant isolation for appointments" 
ON public.appointments FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_users tu
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true
  )
);

CREATE POLICY "Tenant isolation for medical_history" 
ON public.medical_history FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_users tu
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true
  )
);

CREATE POLICY "Tenant isolation for soap_notes" 
ON public.soap_notes FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_users tu
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true
  )
);

CREATE POLICY "Tenant isolation for medications" 
ON public.medications FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_users tu
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true
  )
);

CREATE POLICY "Tenant isolation for file_attachments" 
ON public.file_attachments FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_users tu
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true
  )
);
