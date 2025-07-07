-- Drop existing policies that use auth.role()
DROP POLICY IF EXISTS "Staff can manage patients" ON public.patients;
DROP POLICY IF EXISTS "Staff can view all patients" ON public.patients;

-- Create new policies using the get_user_role function
CREATE POLICY "Staff can manage patients" 
ON public.patients 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

CREATE POLICY "Staff can view all patients" 
ON public.patients 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'staff');

-- Also fix other tables that might have the same issue
DROP POLICY IF EXISTS "Staff can manage all medical conditions" ON public.medical_conditions;
CREATE POLICY "Staff can manage all medical conditions" 
ON public.medical_conditions 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Users can view their own medical conditions" ON public.medical_conditions;
CREATE POLICY "Users can view their own medical conditions" 
ON public.medical_conditions 
FOR SELECT 
USING ((auth.uid() = patient_id) OR (get_user_role(auth.uid()) = 'staff'));

DROP POLICY IF EXISTS "Staff can manage waitlist" ON public.appointment_waitlist;
CREATE POLICY "Staff can manage waitlist" 
ON public.appointment_waitlist 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can manage all patient insurance" ON public.patient_insurance;
CREATE POLICY "Staff can manage all patient insurance" 
ON public.patient_insurance 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Users can view their own insurance" ON public.patient_insurance;
CREATE POLICY "Users can view their own insurance" 
ON public.patient_insurance 
FOR SELECT 
USING ((auth.uid() = patient_id) OR (get_user_role(auth.uid()) = 'staff'));

DROP POLICY IF EXISTS "Staff can manage all claims" ON public.claims;
CREATE POLICY "Staff can manage all claims" 
ON public.claims 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Users can view their own claims" ON public.claims;
CREATE POLICY "Users can view their own claims" 
ON public.claims 
FOR SELECT 
USING ((auth.uid() = patient_id) OR (get_user_role(auth.uid()) = 'staff'));

DROP POLICY IF EXISTS "Staff can manage all checkins" ON public.patient_checkins;
CREATE POLICY "Staff can manage all checkins" 
ON public.patient_checkins 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can manage all prescriptions" ON public.prescriptions;
CREATE POLICY "Staff can manage all prescriptions" 
ON public.prescriptions 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Users can view their own prescriptions" ON public.prescriptions;
CREATE POLICY "Users can view their own prescriptions" 
ON public.prescriptions 
FOR SELECT 
USING ((auth.uid() = patient_id) OR (get_user_role(auth.uid()) = 'staff'));

DROP POLICY IF EXISTS "Staff can view all audit logs" ON public.audit_logs;
CREATE POLICY "Staff can view all audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can manage all notifications" ON public.provider_notifications;
CREATE POLICY "Staff can manage all notifications" 
ON public.provider_notifications 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can manage insurance providers" ON public.insurance_providers;
CREATE POLICY "Staff can manage insurance providers" 
ON public.insurance_providers 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can manage appointments" ON public.appointments;
CREATE POLICY "Staff can manage appointments" 
ON public.appointments 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can view all appointments" ON public.appointments;
CREATE POLICY "Staff can view all appointments" 
ON public.appointments 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can manage provider schedules" ON public.provider_schedules;
CREATE POLICY "Staff can manage provider schedules" 
ON public.provider_schedules 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can create intake forms" ON public.intake_forms;
CREATE POLICY "Staff can create intake forms" 
ON public.intake_forms 
FOR INSERT 
WITH CHECK (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can manage intake forms" ON public.intake_forms;
CREATE POLICY "Staff can manage intake forms" 
ON public.intake_forms 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can manage all notifications" ON public.patient_notifications;
CREATE POLICY "Staff can manage all patient notifications" 
ON public.patient_notifications 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can manage all communication logs" ON public.communication_logs;
CREATE POLICY "Staff can manage all communication logs" 
ON public.communication_logs 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Users can view their own communication logs" ON public.communication_logs;
CREATE POLICY "Users can view their own communication logs" 
ON public.communication_logs 
FOR SELECT 
USING ((auth.uid() = patient_id) OR (get_user_role(auth.uid()) = 'staff'));

DROP POLICY IF EXISTS "Staff can manage all file attachments" ON public.file_attachments;
CREATE POLICY "Staff can manage all file attachments" 
ON public.file_attachments 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Users can view their own file attachments" ON public.file_attachments;
CREATE POLICY "Users can view their own file attachments" 
ON public.file_attachments 
FOR SELECT 
USING ((auth.uid() = patient_id) OR (get_user_role(auth.uid()) = 'staff'));

DROP POLICY IF EXISTS "Staff can manage all submissions" ON public.intake_submissions;
CREATE POLICY "Staff can manage all submissions" 
ON public.intake_submissions 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Users can view their own submissions" ON public.intake_submissions;
CREATE POLICY "Users can view their own submissions" 
ON public.intake_submissions 
FOR SELECT 
USING ((auth.uid() = patient_id) OR (get_user_role(auth.uid()) = 'staff'));

DROP POLICY IF EXISTS "Staff can manage team members" ON public.team_members;
CREATE POLICY "Staff can manage team members" 
ON public.team_members 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can view team members" ON public.team_members;
CREATE POLICY "Staff can view team members" 
ON public.team_members 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Staff can manage all medical records" ON public.medical_records;
CREATE POLICY "Staff can manage all medical records" 
ON public.medical_records 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');

DROP POLICY IF EXISTS "Users can view their own medical records" ON public.medical_records;
CREATE POLICY "Users can view their own medical records" 
ON public.medical_records 
FOR SELECT 
USING ((auth.uid() = patient_id) OR (get_user_role(auth.uid()) = 'staff'));

DROP POLICY IF EXISTS "Staff can manage providers" ON public.providers;
CREATE POLICY "Staff can manage providers" 
ON public.providers 
FOR ALL 
USING (get_user_role(auth.uid()) = 'staff');