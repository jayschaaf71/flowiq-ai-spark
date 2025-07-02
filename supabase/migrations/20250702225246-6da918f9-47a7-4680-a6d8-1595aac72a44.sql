-- Comprehensive RLS policies for tenant isolation and HIPAA compliance

-- Patients policies
DROP POLICY IF EXISTS "Tenant users can view patients in their tenant" ON public.patients;
DROP POLICY IF EXISTS "Staff can manage patients in their tenant" ON public.patients;

CREATE POLICY "Tenant users can view patients in their tenant"
  ON public.patients FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage patients in their tenant"
  ON public.patients FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin', 'provider')));

-- Providers policies
DROP POLICY IF EXISTS "Tenant users can view providers in their tenant" ON public.providers;
DROP POLICY IF EXISTS "Admins can manage providers in their tenant" ON public.providers;

CREATE POLICY "Tenant users can view providers in their tenant"
  ON public.providers FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Admins can manage providers in their tenant"
  ON public.providers FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('admin', 'tenant_admin')));

-- Tenant policies
DROP POLICY IF EXISTS "Users can view their assigned tenants" ON public.tenants;
DROP POLICY IF EXISTS "Tenant admins can manage their tenant" ON public.tenants;

CREATE POLICY "Users can view their assigned tenants"
  ON public.tenants FOR SELECT
  USING (id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Tenant admins can manage their tenant"
  ON public.tenants FOR ALL
  USING (id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role = 'tenant_admin'));

-- Tenant users policies
DROP POLICY IF EXISTS "Users can view tenant membership" ON public.tenant_users;
DROP POLICY IF EXISTS "Admins can manage tenant users" ON public.tenant_users;

CREATE POLICY "Users can view tenant membership"
  ON public.tenant_users FOR SELECT
  USING (user_id = auth.uid() OR tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('admin', 'tenant_admin')));

CREATE POLICY "Admins can manage tenant users"
  ON public.tenant_users FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('admin', 'tenant_admin')));

-- Referrals policies
CREATE POLICY "Tenant users can view referrals in their tenant"
  ON public.referrals FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage referrals in their tenant"
  ON public.referrals FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin', 'provider')));

-- Prior authorizations policies
CREATE POLICY "Tenant users can view prior auths in their tenant"
  ON public.prior_authorizations FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage prior auths in their tenant"
  ON public.prior_authorizations FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin', 'provider')));

-- Eligibility verifications policies
CREATE POLICY "Tenant users can view eligibility in their tenant"
  ON public.eligibility_verifications FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage eligibility in their tenant"
  ON public.eligibility_verifications FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin', 'provider')));

-- Patient education policies
CREATE POLICY "Patients can view their education content"
  ON public.patient_education FOR SELECT
  USING (patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()));

CREATE POLICY "Staff can view patient education in their tenant"
  ON public.patient_education FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage patient education in their tenant"
  ON public.patient_education FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin', 'provider')));

-- Drip campaigns policies
CREATE POLICY "Tenant users can view campaigns in their tenant"
  ON public.drip_campaigns FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Staff can manage campaigns in their tenant"
  ON public.drip_campaigns FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('staff', 'admin')));

-- SOAP notes policies
CREATE POLICY "Providers can view SOAP notes in their tenant"
  ON public.soap_notes FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "Providers can manage SOAP notes in their tenant"
  ON public.soap_notes FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('provider', 'admin')));

-- Payer connections policies
CREATE POLICY "Admins can view payer connections in their tenant"
  ON public.payer_connections FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('admin', 'tenant_admin')));

CREATE POLICY "Admins can manage payer connections in their tenant"
  ON public.payer_connections FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND is_active = true AND role IN ('admin', 'tenant_admin')));