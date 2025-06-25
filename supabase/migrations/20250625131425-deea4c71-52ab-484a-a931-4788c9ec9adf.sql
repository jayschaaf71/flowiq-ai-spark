
-- Create integrations table
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('calendar', 'email', 'sms', 'payment')),
  enabled BOOLEAN NOT NULL DEFAULT false,
  credentials JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  last_sync TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'syncing')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email_templates table
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sms_templates table
CREATE TABLE public.sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  max_length INTEGER DEFAULT 160,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create calendar_events table
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES public.integrations(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  attendees TEXT[],
  location TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample integrations
INSERT INTO public.integrations (name, type, enabled, status) VALUES
('Google Calendar', 'calendar', true, 'connected'),
('Outlook Calendar', 'calendar', false, 'disconnected'),
('Apple Calendar', 'calendar', true, 'connected'),
('Resend', 'email', true, 'connected'),
('SendGrid', 'email', false, 'disconnected'),
('Twilio', 'sms', true, 'connected'),
('TextMagic', 'sms', false, 'disconnected'),
('Stripe', 'payment', false, 'disconnected');

-- Insert sample email templates
INSERT INTO public.email_templates (name, subject, body, variables) VALUES
('Appointment Confirmation', 'Appointment Confirmed - {{date}} at {{time}}', 
 'Dear {{patient_name}},<br><br>Your appointment has been confirmed for {{date}} at {{time}} with {{provider_name}}.<br><br>Please arrive 15 minutes early.<br><br>Best regards,<br>{{practice_name}}',
 ARRAY['patient_name', 'date', 'time', 'provider_name', 'practice_name']),
('Appointment Reminder', 'Reminder: Appointment Tomorrow at {{time}}',
 'Dear {{patient_name}},<br><br>This is a reminder that you have an appointment tomorrow at {{time}} with {{provider_name}}.<br><br>Please call if you need to reschedule.<br><br>Best regards,<br>{{practice_name}}',
 ARRAY['patient_name', 'time', 'provider_name', 'practice_name']);

-- Insert sample SMS templates
INSERT INTO public.sms_templates (name, message, variables, max_length) VALUES
('Appointment Reminder', 'Hi {{patient_name}}, reminder: appointment tomorrow at {{time}} with {{provider_name}}. Call {{phone}} to reschedule.', 
 ARRAY['patient_name', 'time', 'provider_name', 'phone'], 160),
('Appointment Confirmation', 'Hi {{patient_name}}, your appointment is confirmed for {{date}} at {{time}}. See you then!',
 ARRAY['patient_name', 'date', 'time'], 160);

-- Enable RLS for all new tables
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing authenticated users full access for now)
CREATE POLICY "Allow authenticated users full access to integrations" ON public.integrations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to email_templates" ON public.email_templates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to sms_templates" ON public.sms_templates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to calendar_events" ON public.calendar_events
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON public.integrations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_templates_updated_at BEFORE UPDATE ON public.sms_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
