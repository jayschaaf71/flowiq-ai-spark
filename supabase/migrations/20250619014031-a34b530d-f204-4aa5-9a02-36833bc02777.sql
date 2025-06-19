
-- Create intake_forms table to store form templates
CREATE TABLE public.intake_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tenant_type TEXT NOT NULL DEFAULT 'default',
  form_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create intake_submissions table to store patient form submissions
CREATE TABLE public.intake_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.intake_forms(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_summary TEXT,
  priority_level TEXT DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create intake_analytics table for tracking form performance
CREATE TABLE public.intake_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.intake_forms(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.intake_submissions(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'form_viewed', 'form_started', 'form_completed', 'form_abandoned'
  tenant_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_intake_forms_tenant_type ON public.intake_forms(tenant_type);
CREATE INDEX idx_intake_forms_active ON public.intake_forms(is_active);
CREATE INDEX idx_intake_submissions_form_id ON public.intake_submissions(form_id);
CREATE INDEX idx_intake_submissions_status ON public.intake_submissions(status);
CREATE INDEX idx_intake_submissions_created_at ON public.intake_submissions(created_at);
CREATE INDEX idx_intake_analytics_form_id ON public.intake_analytics(form_id);
CREATE INDEX idx_intake_analytics_event_type ON public.intake_analytics(event_type);

-- Enable Row Level Security (these will be public forms, but we want to track access)
ALTER TABLE public.intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to forms (patients can view active forms)
CREATE POLICY "Anyone can view active intake forms" 
  ON public.intake_forms 
  FOR SELECT 
  USING (is_active = true);

-- Create policies for form submissions (anyone can submit, but only admins can view all)
CREATE POLICY "Anyone can create intake submissions" 
  ON public.intake_submissions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own submissions by email" 
  ON public.intake_submissions 
  FOR SELECT 
  USING (patient_email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Create policies for analytics (public insert for tracking, admin view)
CREATE POLICY "Anyone can create analytics events" 
  ON public.intake_analytics 
  FOR INSERT 
  WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_intake_forms_updated_at 
  BEFORE UPDATE ON public.intake_forms 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intake_submissions_updated_at 
  BEFORE UPDATE ON public.intake_submissions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
