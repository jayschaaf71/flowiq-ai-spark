-- Create email templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SMS templates table
CREATE TABLE public.sms_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for email templates
CREATE POLICY "Users can view all email templates" 
ON public.email_templates 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create email templates" 
ON public.email_templates 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update email templates" 
ON public.email_templates 
FOR UPDATE 
USING (true);

-- Create policies for SMS templates
CREATE POLICY "Users can view all SMS templates" 
ON public.sms_templates 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create SMS templates" 
ON public.sms_templates 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update SMS templates" 
ON public.sms_templates 
FOR UPDATE 
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sms_templates_updated_at
BEFORE UPDATE ON public.sms_templates
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, body, variables) VALUES
('welcome', 'Welcome to Our Practice, {{patientName}}!', 
 '<h2>Welcome {{patientName}}!</h2>
  <p>Thank you for choosing our practice. We''ve received your intake form and are reviewing your information.</p>
  <p>Our team will contact you within 24 hours to schedule your appointment or answer any questions.</p>
  <p>If you have any immediate concerns, please don''t hesitate to call us.</p>
  <br>
  <p>Best regards,<br>Your Healthcare Team</p>', 
 '{"patientName"}'),
('appointment-reminder', 'Appointment Reminder for {{patientName}}', 
 '<h2>Appointment Reminder</h2>
  <p>Hello {{patientName}},</p>
  <p>This is a reminder about your upcoming appointment on {{appointmentDate}} at {{appointmentTime}}.</p>
  <p>Please arrive 15 minutes early to complete any remaining paperwork.</p>
  <p>If you need to reschedule, please contact us as soon as possible.</p>
  <br>
  <p>Best regards,<br>Your Healthcare Team</p>', 
 '{"patientName", "appointmentDate", "appointmentTime"}'),
('follow-up', 'Follow-up from Your Recent Visit', 
 '<h2>Thank you for your visit, {{patientName}}</h2>
  <p>We hope you had a positive experience during your recent visit.</p>
  <p>Please don''t hesitate to contact us if you have any questions or concerns.</p>
  <p>We look forward to seeing you again soon.</p>
  <br>
  <p>Best regards,<br>Your Healthcare Team</p>', 
 '{"patientName"}');

-- Insert default SMS templates
INSERT INTO public.sms_templates (name, message, variables) VALUES
('welcome-sms', 'Welcome {{patientName}}! We''ve received your intake form. We''ll contact you within 24 hours. Reply STOP to opt out.', 
 '{"patientName"}'),
('appointment-reminder-sms', 'Hi {{patientName}}, reminder: appointment on {{appointmentDate}} at {{appointmentTime}}. Reply CONFIRM to confirm or RESCHEDULE if needed.', 
 '{"patientName", "appointmentDate", "appointmentTime"}'),
('confirmation-sms', 'Hi {{patientName}}, please confirm your appointment on {{appointmentDate}} at {{appointmentTime}}. Reply YES to confirm or NO to reschedule.', 
 '{"patientName", "appointmentDate", "appointmentTime"}'),
('follow-up-sms', 'Hi {{patientName}}, thank you for your visit. How are you feeling? Reply with any questions. Reply STOP to opt out.', 
 '{"patientName"}');