-- Add missing triggers for automatic tenant_id setting
CREATE TRIGGER set_tenant_id_team_members
  BEFORE INSERT ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_intake_forms
  BEFORE INSERT ON public.intake_forms
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_intake_submissions
  BEFORE INSERT ON public.intake_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_medical_records
  BEFORE INSERT ON public.medical_records
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_medical_conditions
  BEFORE INSERT ON public.medical_conditions
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_prescriptions
  BEFORE INSERT ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_claims
  BEFORE INSERT ON public.claims
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_patient_insurance
  BEFORE INSERT ON public.patient_insurance
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_patient_checkins
  BEFORE INSERT ON public.patient_checkins
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_file_attachments
  BEFORE INSERT ON public.file_attachments
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_communication_logs
  BEFORE INSERT ON public.communication_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_patient_notifications
  BEFORE INSERT ON public.patient_notifications
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_provider_notifications
  BEFORE INSERT ON public.provider_notifications
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_provider_schedules
  BEFORE INSERT ON public.provider_schedules
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_appointment_waitlist
  BEFORE INSERT ON public.appointment_waitlist
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_reminder_logs
  BEFORE INSERT ON public.reminder_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_audit_logs
  BEFORE INSERT ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_sms_templates
  BEFORE INSERT ON public.sms_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

CREATE TRIGGER set_tenant_id_email_templates
  BEFORE INSERT ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();