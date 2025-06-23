
-- Create template storage tables
CREATE TABLE public.message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  category TEXT NOT NULL,
  subject TEXT, -- Only for email templates
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}', -- Array of variable keys used in template
  is_built_in BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  tenant_id UUID REFERENCES public.tenants(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Styling options for email templates
  styling JSONB DEFAULT '{}',
  
  -- Template metadata
  metadata JSONB DEFAULT '{}'
);

-- Create template usage tracking
CREATE TABLE public.template_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.message_templates(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  recipient TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  status TEXT NOT NULL DEFAULT 'sent',
  tenant_id UUID REFERENCES public.tenants(id),
  created_by UUID REFERENCES auth.users(id)
);

-- Create custom variables table (extends the existing system)
CREATE TABLE public.custom_variables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('text', 'date', 'number', 'boolean', 'select')),
  default_value TEXT,
  options TEXT[], -- For select type
  category TEXT NOT NULL,
  is_system BOOLEAN DEFAULT FALSE,
  tenant_id UUID REFERENCES public.tenants(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(key, tenant_id)
);

-- Enable RLS on all tables
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_variables ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_templates
CREATE POLICY "Users can view templates in their tenant" ON public.message_templates
  FOR SELECT USING (
    tenant_id IS NULL OR -- Built-in templates are accessible to all
    tenant_id = (SELECT get_user_primary_tenant(auth.uid()))
  );

CREATE POLICY "Users can create templates in their tenant" ON public.message_templates
  FOR INSERT WITH CHECK (
    tenant_id = (SELECT get_user_primary_tenant(auth.uid())) AND
    created_by = auth.uid()
  );

CREATE POLICY "Users can update their own templates" ON public.message_templates
  FOR UPDATE USING (
    tenant_id = (SELECT get_user_primary_tenant(auth.uid())) AND
    (created_by = auth.uid() OR NOT is_built_in)
  );

CREATE POLICY "Users can delete their own templates" ON public.message_templates
  FOR DELETE USING (
    tenant_id = (SELECT get_user_primary_tenant(auth.uid())) AND
    created_by = auth.uid() AND
    NOT is_built_in
  );

-- RLS Policies for template_usage
CREATE POLICY "Users can view usage in their tenant" ON public.template_usage
  FOR SELECT USING (
    tenant_id = (SELECT get_user_primary_tenant(auth.uid()))
  );

CREATE POLICY "Users can insert usage records" ON public.template_usage
  FOR INSERT WITH CHECK (
    tenant_id = (SELECT get_user_primary_tenant(auth.uid())) AND
    created_by = auth.uid()
  );

-- RLS Policies for custom_variables
CREATE POLICY "Users can view variables in their tenant" ON public.custom_variables
  FOR SELECT USING (
    tenant_id IS NULL OR -- System variables are accessible to all
    tenant_id = (SELECT get_user_primary_tenant(auth.uid()))
  );

CREATE POLICY "Users can create variables in their tenant" ON public.custom_variables
  FOR INSERT WITH CHECK (
    tenant_id = (SELECT get_user_primary_tenant(auth.uid())) AND
    created_by = auth.uid()
  );

CREATE POLICY "Users can update their variables" ON public.custom_variables
  FOR UPDATE USING (
    tenant_id = (SELECT get_user_primary_tenant(auth.uid())) AND
    (created_by = auth.uid() OR NOT is_system)
  );

CREATE POLICY "Users can delete their variables" ON public.custom_variables
  FOR DELETE USING (
    tenant_id = (SELECT get_user_primary_tenant(auth.uid())) AND
    created_by = auth.uid() AND
    NOT is_system
  );

-- Add updated_at trigger
CREATE TRIGGER update_message_templates_updated_at
  BEFORE UPDATE ON public.message_templates
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER update_custom_variables_updated_at
  BEFORE UPDATE ON public.custom_variables
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Insert system variables
INSERT INTO public.custom_variables (key, label, description, type, category, is_system) VALUES
  ('patientName', 'Patient Name', 'Full name of the patient', 'text', 'Patient Info', true),
  ('firstName', 'First Name', 'Patient''s first name', 'text', 'Patient Info', true),
  ('lastName', 'Last Name', 'Patient''s last name', 'text', 'Patient Info', true),
  ('appointmentDate', 'Appointment Date', 'Date of the appointment', 'date', 'Appointment', true),
  ('appointmentTime', 'Appointment Time', 'Time of the appointment', 'text', 'Appointment', true),
  ('doctorName', 'Doctor Name', 'Name of the attending physician', 'text', 'Practice Info', true),
  ('practiceName', 'Practice Name', 'Name of the medical practice', 'text', 'Practice Info', true),
  ('phoneNumber', 'Phone Number', 'Practice phone number', 'text', 'Practice Info', true),
  ('address', 'Practice Address', 'Practice location', 'text', 'Practice Info', true),
  ('confirmationLink', 'Confirmation Link', 'Link to confirm appointment', 'text', 'Appointment', true),
  ('rescheduleLink', 'Reschedule Link', 'Link to reschedule appointment', 'text', 'Appointment', true),
  ('portalLink', 'Patient Portal', 'Link to patient portal', 'text', 'Practice Info', true);

-- Insert some built-in templates
INSERT INTO public.message_templates (name, type, category, subject, content, variables, is_built_in) VALUES
  (
    'Appointment Reminder Email',
    'email',
    'reminder',
    'Appointment Reminder - {{appointmentDate}}',
    'Dear {{patientName}},

This is a friendly reminder about your upcoming appointment:

Date: {{appointmentDate}}
Time: {{appointmentTime}}
Doctor: {{doctorName}}
Location: {{practiceName}}, {{address}}

If you need to reschedule, please click here: {{rescheduleLink}}
To confirm your appointment, click here: {{confirmationLink}}

Thank you,
{{practiceName}}
Phone: {{phoneNumber}}',
    ARRAY['patientName', 'appointmentDate', 'appointmentTime', 'doctorName', 'practiceName', 'address', 'rescheduleLink', 'confirmationLink', 'phoneNumber'],
    true
  ),
  (
    'Appointment Reminder SMS',
    'sms',
    'reminder',
    NULL,
    'Hi {{firstName}}, reminder: {{appointmentDate}} at {{appointmentTime}} with {{doctorName}} at {{practiceName}}. Confirm: {{confirmationLink}}',
    ARRAY['firstName', 'appointmentDate', 'appointmentTime', 'doctorName', 'practiceName', 'confirmationLink'],
    true
  ),
  (
    'Welcome Email',
    'email',
    'welcome',
    'Welcome to {{practiceName}}!',
    'Dear {{patientName}},

Welcome to {{practiceName}}! We are excited to have you as our patient.

Your patient portal is now active. You can access it here: {{portalLink}}

If you have any questions, please don''t hesitate to contact us at {{phoneNumber}}.

Best regards,
The {{practiceName}} Team',
    ARRAY['patientName', 'practiceName', 'portalLink', 'phoneNumber'],
    true
  );

-- Create indexes for performance
CREATE INDEX idx_message_templates_tenant_id ON public.message_templates(tenant_id);
CREATE INDEX idx_message_templates_type ON public.message_templates(type);
CREATE INDEX idx_message_templates_category ON public.message_templates(category);
CREATE INDEX idx_template_usage_template_id ON public.template_usage(template_id);
CREATE INDEX idx_template_usage_tenant_id ON public.template_usage(tenant_id);
CREATE INDEX idx_custom_variables_tenant_id ON public.custom_variables(tenant_id);
CREATE INDEX idx_custom_variables_key ON public.custom_variables(key);
