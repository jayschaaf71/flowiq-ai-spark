-- Add specialty field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS specialty TEXT;

-- Create intake_forms table
CREATE TABLE IF NOT EXISTS public.intake_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  form_fields JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create intake_submissions table
CREATE TABLE IF NOT EXISTS public.intake_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL,
  patient_id UUID,
  submission_data JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  priority_level TEXT DEFAULT 'normal',
  ai_summary TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (form_id) REFERENCES public.intake_forms(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE SET NULL
);

-- Create communication_logs table for proper communication tracking
CREATE TABLE IF NOT EXISTS public.communication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID,
  patient_id UUID,
  type TEXT NOT NULL, -- 'email' or 'sms'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'delivered'
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  template_id UUID,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (submission_id) REFERENCES public.intake_submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE SET NULL
);

-- Enable RLS on new tables
ALTER TABLE public.intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for intake_forms
CREATE POLICY "Anyone can view active intake forms" 
ON public.intake_forms FOR SELECT 
USING (is_active = true);

CREATE POLICY "Staff can manage intake forms" 
ON public.intake_forms FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- RLS policies for intake_submissions
CREATE POLICY "Users can view their own submissions" 
ON public.intake_submissions FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id OR auth.role() = 'staff'::text);

CREATE POLICY "Staff can manage all submissions" 
ON public.intake_submissions FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

CREATE POLICY "Users can create their own submissions" 
ON public.intake_submissions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = patient_id);

-- RLS policies for communication_logs
CREATE POLICY "Users can view their own communication logs" 
ON public.communication_logs FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id OR auth.role() = 'staff'::text);

CREATE POLICY "Staff can manage all communication logs" 
ON public.communication_logs FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_intake_forms_updated_at
  BEFORE UPDATE ON public.intake_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_intake_submissions_updated_at
  BEFORE UPDATE ON public.intake_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_communication_logs_updated_at
  BEFORE UPDATE ON public.communication_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_intake_forms_active ON public.intake_forms(is_active);
CREATE INDEX idx_intake_submissions_form_id ON public.intake_submissions(form_id);
CREATE INDEX idx_intake_submissions_patient_id ON public.intake_submissions(patient_id);
CREATE INDEX idx_intake_submissions_status ON public.intake_submissions(status);
CREATE INDEX idx_communication_logs_submission_id ON public.communication_logs(submission_id);
CREATE INDEX idx_communication_logs_patient_id ON public.communication_logs(patient_id);
CREATE INDEX idx_communication_logs_type ON public.communication_logs(type);
CREATE INDEX idx_communication_logs_status ON public.communication_logs(status);

-- Insert a default intake form
INSERT INTO public.intake_forms (title, description, form_fields, is_active) VALUES
(
  'General Patient Intake',
  'Standard patient intake form for new patients',
  '[
    {"id": "firstName", "type": "text", "label": "First Name", "required": true},
    {"id": "lastName", "type": "text", "label": "Last Name", "required": true},
    {"id": "email", "type": "email", "label": "Email Address", "required": true},
    {"id": "phone", "type": "tel", "label": "Phone Number", "required": true},
    {"id": "dateOfBirth", "type": "date", "label": "Date of Birth", "required": true},
    {"id": "address", "type": "textarea", "label": "Address", "required": false},
    {"id": "medicalHistory", "type": "textarea", "label": "Medical History", "required": false},
    {"id": "currentMedications", "type": "textarea", "label": "Current Medications", "required": false},
    {"id": "allergies", "type": "textarea", "label": "Allergies", "required": false}
  ]'::jsonb,
  true
);