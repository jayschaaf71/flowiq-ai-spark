-- Create tables for voice call management and outcomes

-- Table for storing voice call records
CREATE TABLE public.voice_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id TEXT NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id),
  call_type TEXT NOT NULL, -- 'inbound', 'outbound'
  call_status TEXT NOT NULL, -- 'completed', 'no_answer', 'failed'
  call_duration INTEGER, -- in seconds
  transcript TEXT,
  call_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tenant_id UUID REFERENCES public.tenants(id)
);

-- Table for call outcomes and sentiment analysis
CREATE TABLE public.call_outcomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id UUID NOT NULL REFERENCES public.voice_calls(id) ON DELETE CASCADE,
  outcome_type TEXT NOT NULL, -- 'qualified', 'not_qualified', 'callback_requested', 'appointment_scheduled'
  sentiment_score NUMERIC, -- -1 to 1
  sentiment_label TEXT, -- 'positive', 'negative', 'neutral'
  key_topics TEXT[],
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_type TEXT, -- 'call', 'sms', 'email'
  follow_up_date TIMESTAMP WITH TIME ZONE,
  ai_summary TEXT,
  confidence_score NUMERIC, -- 0 to 1
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tenant_id UUID REFERENCES public.tenants(id)
);

-- Table for automated follow-up tasks
CREATE TABLE public.follow_up_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_outcome_id UUID NOT NULL REFERENCES public.call_outcomes(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  task_type TEXT NOT NULL, -- 'call', 'sms', 'email', 'appointment_reminder'
  task_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  message_template TEXT,
  message_variables JSONB DEFAULT '{}',
  completion_data JSONB DEFAULT '{}',
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tenant_id UUID REFERENCES public.tenants(id)
);

-- Table for tracking lead qualification scores
CREATE TABLE public.lead_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  call_id UUID REFERENCES public.voice_calls(id),
  score_type TEXT NOT NULL, -- 'qualification', 'engagement', 'conversion_likelihood'
  score_value NUMERIC NOT NULL, -- 0 to 100
  score_factors JSONB DEFAULT '{}',
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tenant_id UUID REFERENCES public.tenants(id)
);

-- Enable RLS on all tables
ALTER TABLE public.voice_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;

-- RLS policies for voice_calls
CREATE POLICY "Staff can manage all voice calls" 
ON public.voice_calls 
FOR ALL 
USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their own calls" 
ON public.voice_calls 
FOR SELECT 
USING (auth.uid() = patient_id);

-- RLS policies for call_outcomes
CREATE POLICY "Staff can manage all call outcomes" 
ON public.call_outcomes 
FOR ALL 
USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their own call outcomes" 
ON public.call_outcomes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.voice_calls vc 
    WHERE vc.id = call_outcomes.call_id 
    AND vc.patient_id = auth.uid()
  )
);

-- RLS policies for follow_up_tasks
CREATE POLICY "Staff can manage all follow up tasks" 
ON public.follow_up_tasks 
FOR ALL 
USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their own follow up tasks" 
ON public.follow_up_tasks 
FOR SELECT 
USING (auth.uid() = patient_id);

-- RLS policies for lead_scores
CREATE POLICY "Staff can manage all lead scores" 
ON public.lead_scores 
FOR ALL 
USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their own lead scores" 
ON public.lead_scores 
FOR SELECT 
USING (auth.uid() = patient_id);

-- Create indexes for performance
CREATE INDEX idx_voice_calls_call_id ON public.voice_calls(call_id);
CREATE INDEX idx_voice_calls_patient_id ON public.voice_calls(patient_id);
CREATE INDEX idx_voice_calls_created_at ON public.voice_calls(created_at);
CREATE INDEX idx_call_outcomes_call_id ON public.call_outcomes(call_id);
CREATE INDEX idx_follow_up_tasks_scheduled_for ON public.follow_up_tasks(scheduled_for);
CREATE INDEX idx_follow_up_tasks_status ON public.follow_up_tasks(task_status);
CREATE INDEX idx_lead_scores_patient_id ON public.lead_scores(patient_id);

-- Create trigger for updated_at columns
CREATE TRIGGER update_voice_calls_updated_at
  BEFORE UPDATE ON public.voice_calls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_call_outcomes_updated_at
  BEFORE UPDATE ON public.call_outcomes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_follow_up_tasks_updated_at
  BEFORE UPDATE ON public.follow_up_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create follow-up tasks based on outcomes
CREATE OR REPLACE FUNCTION public.create_follow_up_task_from_outcome()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_patient_id UUID;
  v_tenant_id UUID;
BEGIN
  -- Get patient_id and tenant_id from the associated voice call
  SELECT vc.patient_id, vc.tenant_id 
  INTO v_patient_id, v_tenant_id
  FROM public.voice_calls vc 
  WHERE vc.id = NEW.call_id;
  
  -- Only create follow-up task if follow_up_required is true
  IF NEW.follow_up_required AND NEW.follow_up_date IS NOT NULL THEN
    INSERT INTO public.follow_up_tasks (
      call_outcome_id,
      patient_id,
      task_type,
      scheduled_for,
      message_template,
      tenant_id
    ) VALUES (
      NEW.id,
      v_patient_id,
      COALESCE(NEW.follow_up_type, 'call'),
      NEW.follow_up_date,
      CASE 
        WHEN NEW.follow_up_type = 'sms' THEN 'Hi {{patient_name}}, following up on our recent conversation. Please let us know if you have any questions!'
        WHEN NEW.follow_up_type = 'email' THEN 'Thank you for your time today. We wanted to follow up on our conversation and see if you have any additional questions.'
        ELSE 'Follow-up call scheduled based on previous conversation'
      END,
      v_tenant_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create follow-up tasks
CREATE TRIGGER create_follow_up_task_trigger
  AFTER INSERT ON public.call_outcomes
  FOR EACH ROW
  EXECUTE FUNCTION public.create_follow_up_task_from_outcome();