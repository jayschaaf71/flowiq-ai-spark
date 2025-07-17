-- Create appointment preparation status tracking
CREATE TABLE public.appointment_preparation_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  intake_completed BOOLEAN DEFAULT FALSE,
  insurance_verified BOOLEAN DEFAULT FALSE,
  contact_confirmed BOOLEAN DEFAULT FALSE,
  medical_history_complete BOOLEAN DEFAULT FALSE,
  forms_signed BOOLEAN DEFAULT FALSE,
  preparation_score INTEGER DEFAULT 0,
  missing_items TEXT[],
  last_outreach_date TIMESTAMP WITH TIME ZONE,
  outreach_count INTEGER DEFAULT 0,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SAGE calendar tasks for AI-generated action items
CREATE TABLE public.sage_calendar_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  task_description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  auto_generated BOOLEAN DEFAULT TRUE,
  assigned_to UUID,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  sage_context JSONB DEFAULT '{}',
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create provider daily summaries
CREATE TABLE public.provider_daily_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  summary_date DATE NOT NULL,
  appointment_count INTEGER DEFAULT 0,
  summary_data JSONB NOT NULL DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE,
  email_sent BOOLEAN DEFAULT FALSE,
  sms_sent BOOLEAN DEFAULT FALSE,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id, summary_date, tenant_id)
);

-- Create appointment types with scheduling constraints
CREATE TABLE public.appointment_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  color_code TEXT DEFAULT '#3B82F6',
  requires_prep BOOLEAN DEFAULT FALSE,
  prep_time_minutes INTEGER DEFAULT 0,
  follow_up_required BOOLEAN DEFAULT FALSE,
  specialty TEXT,
  procedure_codes TEXT[],
  scheduling_constraints JSONB DEFAULT '{}',
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create provider procedure schedules for time-block constraints
CREATE TABLE public.provider_procedure_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  appointment_type_id UUID NOT NULL REFERENCES public.appointment_types(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_appointments INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.appointment_preparation_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sage_calendar_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_procedure_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appointment_preparation_status
CREATE POLICY "Staff can manage appointment preparation status" 
  ON public.appointment_preparation_status FOR ALL 
  USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their own appointment preparation" 
  ON public.appointment_preparation_status FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.appointments a 
    WHERE a.id = appointment_id AND a.patient_id = auth.uid()
  ));

-- RLS Policies for sage_calendar_tasks
CREATE POLICY "Staff can manage SAGE calendar tasks" 
  ON public.sage_calendar_tasks FOR ALL 
  USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their own SAGE tasks" 
  ON public.sage_calendar_tasks FOR SELECT 
  USING (auth.uid() = patient_id);

-- RLS Policies for provider_daily_summaries
CREATE POLICY "Staff can manage provider daily summaries" 
  ON public.provider_daily_summaries FOR ALL 
  USING (has_staff_access(auth.uid()));

CREATE POLICY "Providers can view their own daily summaries" 
  ON public.provider_daily_summaries FOR SELECT 
  USING (auth.uid()::text = provider_id::text);

-- RLS Policies for appointment_types
CREATE POLICY "Everyone can view appointment types" 
  ON public.appointment_types FOR SELECT 
  USING (true);

CREATE POLICY "Staff can manage appointment types" 
  ON public.appointment_types FOR ALL 
  USING (has_staff_access(auth.uid()));

-- RLS Policies for provider_procedure_schedules
CREATE POLICY "Everyone can view provider procedure schedules" 
  ON public.provider_procedure_schedules FOR SELECT 
  USING (true);

CREATE POLICY "Staff can manage provider procedure schedules" 
  ON public.provider_procedure_schedules FOR ALL 
  USING (has_staff_access(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_appointment_preparation_appointment_id ON public.appointment_preparation_status(appointment_id);
CREATE INDEX idx_sage_calendar_tasks_appointment_id ON public.sage_calendar_tasks(appointment_id);
CREATE INDEX idx_sage_calendar_tasks_patient_id ON public.sage_calendar_tasks(patient_id);
CREATE INDEX idx_sage_calendar_tasks_status ON public.sage_calendar_tasks(status);
CREATE INDEX idx_provider_daily_summaries_provider_date ON public.provider_daily_summaries(provider_id, summary_date);
CREATE INDEX idx_appointment_types_specialty ON public.appointment_types(specialty);
CREATE INDEX idx_provider_procedure_schedules_provider_type ON public.provider_procedure_schedules(provider_id, appointment_type_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_appointment_preparation_status_updated_at
  BEFORE UPDATE ON public.appointment_preparation_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sage_calendar_tasks_updated_at
  BEFORE UPDATE ON public.sage_calendar_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_provider_daily_summaries_updated_at
  BEFORE UPDATE ON public.provider_daily_summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointment_types_updated_at
  BEFORE UPDATE ON public.appointment_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_provider_procedure_schedules_updated_at
  BEFORE UPDATE ON public.provider_procedure_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default appointment types
INSERT INTO public.appointment_types (name, duration_minutes, color_code, requires_prep, specialty) VALUES
('Consultation', 60, '#3B82F6', true, 'general'),
('Cleaning', 45, '#10B981', false, 'dental'),
('Root Canal', 120, '#EF4444', true, 'dental'),
('Crown Prep', 90, '#F59E0B', true, 'dental'),
('Sleep Study Review', 45, '#8B5CF6', true, 'sleep'),
('CPAP Fitting', 30, '#06B6D4', false, 'sleep'),
('Follow-up', 30, '#6B7280', false, 'general');