-- Create communication_templates table for the unified communications hub
CREATE TABLE public.communication_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'voice')),
  subject TEXT, -- For email templates
  content TEXT NOT NULL,
  variables TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  tenant_id UUID REFERENCES public.tenants(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for communication_templates
CREATE POLICY "Staff can manage templates in their tenant"
ON public.communication_templates
FOR ALL
USING (
  tenant_id IN (
    SELECT tu.tenant_id 
    FROM tenant_users tu 
    JOIN profiles p ON tu.user_id = p.id 
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true 
    AND p.role IN ('platform_admin', 'practice_admin', 'practice_manager', 'provider', 'staff')
  )
)
WITH CHECK (
  tenant_id IN (
    SELECT tu.tenant_id 
    FROM tenant_users tu 
    JOIN profiles p ON tu.user_id = p.id 
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true 
    AND p.role IN ('platform_admin', 'practice_admin', 'practice_manager', 'provider', 'staff')
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_communication_templates_updated_at
BEFORE UPDATE ON public.communication_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default templates
INSERT INTO public.communication_templates (name, channel, subject, content, variables) VALUES
('Appointment Reminder (Email)', 'email', 'Appointment Reminder - {{date}} at {{time}}', 
'<h2>Appointment Reminder</h2>
<p>Dear {{patient_name}},</p>
<p>This is a reminder that you have an appointment scheduled for {{date}} at {{time}} with {{provider_name}}.</p>
<p>Please arrive 15 minutes early to complete any necessary paperwork.</p>
<p>If you need to reschedule, please call us at {{phone}}.</p>
<br>
<p>Best regards,<br>{{practice_name}}</p>', 
ARRAY['patient_name', 'date', 'time', 'provider_name', 'phone', 'practice_name']),

('Appointment Reminder (SMS)', 'sms', NULL, 
'Hi {{patient_name}}, reminder: appointment {{date}} at {{time}} with {{provider_name}}. Call {{phone}} to reschedule.', 
ARRAY['patient_name', 'date', 'time', 'provider_name', 'phone']),

('Welcome Email', 'email', 'Welcome to {{practice_name}}, {{patient_name}}!', 
'<h2>Welcome {{patient_name}}!</h2>
<p>Thank you for choosing {{practice_name}}. We''re excited to have you as a patient.</p>
<p>Our team will contact you within 24 hours to schedule your appointment or answer any questions.</p>
<p>If you have any immediate concerns, please don''t hesitate to call us at {{phone}}.</p>
<br>
<p>Best regards,<br>{{practice_name}} Team</p>', 
ARRAY['patient_name', 'practice_name', 'phone']),

('Follow-up Call Script', 'voice', NULL, 
'Hello {{patient_name}}, this is {{practice_name}} calling to follow up on your recent appointment. Please call us back at {{phone}} if you have any questions.', 
ARRAY['patient_name', 'practice_name', 'phone']),

('Insurance Update Reminder', 'email', 'Insurance Information Update Required', 
'<h2>Insurance Update Required</h2>
<p>Dear {{patient_name}},</p>
<p>We need to update your insurance information in our system. Please contact us at {{phone}} to provide your current insurance details.</p>
<p>This will help ensure smooth processing of your claims and avoid any delays in your care.</p>
<br>
<p>Thank you,<br>{{practice_name}} Team</p>', 
ARRAY['patient_name', 'phone', 'practice_name']),

('Payment Reminder', 'sms', NULL, 
'Hi {{patient_name}}, your payment of {{amount}} is due. Please call {{phone}} to arrange payment or if you have questions.', 
ARRAY['patient_name', 'amount', 'phone']); 