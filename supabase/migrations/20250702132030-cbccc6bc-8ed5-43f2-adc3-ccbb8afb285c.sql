-- Create notification queue table for automated patient communications
CREATE TABLE public.notification_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('confirmation', 'reminder', 'cancellation', 'rescheduled', 'follow_up')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  retry_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_notification_queue_status ON public.notification_queue(status);
CREATE INDEX idx_notification_queue_scheduled_for ON public.notification_queue(scheduled_for);
CREATE INDEX idx_notification_queue_appointment_id ON public.notification_queue(appointment_id);

-- Create follow-up campaigns table
CREATE TABLE public.followup_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('post_appointment', 'missed_appointment', 'custom')),
  delay_hours INTEGER NOT NULL DEFAULT 24,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'both')),
  template_content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  target_conditions JSONB DEFAULT '{}',
  success_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient engagement activities table
CREATE TABLE public.patient_engagement_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('portal_login', 'message_sent', 'message_read', 'form_completed', 'appointment_scheduled', 'program_joined')),
  activity_data JSONB DEFAULT '{}',
  engagement_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient programs table
CREATE TABLE public.patient_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration_days INTEGER,
  requirements JSONB DEFAULT '[]',
  rewards JSONB DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient program enrollments table
CREATE TABLE public.patient_program_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  program_id UUID REFERENCES public.patient_programs(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  completion_rate INTEGER DEFAULT 0 CHECK (completion_rate >= 0 AND completion_rate <= 100),
  satisfaction_score DECIMAL(2,1) NULL CHECK (satisfaction_score >= 1.0 AND satisfaction_score <= 5.0),
  notes TEXT,
  UNIQUE(patient_id, program_id)
);

-- Create patient achievements table for gamification
CREATE TABLE public.patient_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  points_earned INTEGER NOT NULL DEFAULT 0,
  badge_icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Create RLS policies for notification queue
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage notification queue" 
ON public.notification_queue 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND role IN ('staff', 'admin')
));

-- Create RLS policies for follow-up campaigns
ALTER TABLE public.followup_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage followup campaigns" 
ON public.followup_campaigns 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND role IN ('staff', 'admin')
));

-- Create RLS policies for patient engagement activities
ALTER TABLE public.patient_engagement_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own engagement activities" 
ON public.patient_engagement_activities 
FOR SELECT 
USING (patient_id = auth.uid());

CREATE POLICY "Staff can view all engagement activities" 
ON public.patient_engagement_activities 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND role IN ('staff', 'admin')
));

CREATE POLICY "System can insert engagement activities" 
ON public.patient_engagement_activities 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for patient programs
ALTER TABLE public.patient_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active programs" 
ON public.patient_programs 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Staff can manage programs" 
ON public.patient_programs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND role IN ('staff', 'admin')
));

-- Create RLS policies for program enrollments
ALTER TABLE public.patient_program_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments" 
ON public.patient_program_enrollments 
FOR SELECT 
USING (patient_id = auth.uid());

CREATE POLICY "Users can enroll in programs" 
ON public.patient_program_enrollments 
FOR INSERT 
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Staff can manage all enrollments" 
ON public.patient_program_enrollments 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND role IN ('staff', 'admin')
));

-- Create RLS policies for patient achievements
ALTER TABLE public.patient_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements" 
ON public.patient_achievements 
FOR SELECT 
USING (patient_id = auth.uid());

CREATE POLICY "Staff can manage all achievements" 
ON public.patient_achievements 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND role IN ('staff', 'admin')
));

-- Create indexes for performance
CREATE INDEX idx_patient_engagement_activities_patient_id ON public.patient_engagement_activities(patient_id);
CREATE INDEX idx_patient_engagement_activities_type ON public.patient_engagement_activities(activity_type);
CREATE INDEX idx_patient_program_enrollments_patient_id ON public.patient_program_enrollments(patient_id);
CREATE INDEX idx_patient_program_enrollments_program_id ON public.patient_program_enrollments(program_id);
CREATE INDEX idx_patient_achievements_patient_id ON public.patient_achievements(patient_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_notification_queue_updated_at
  BEFORE UPDATE ON public.notification_queue
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER update_followup_campaigns_updated_at
  BEFORE UPDATE ON public.followup_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER update_patient_programs_updated_at
  BEFORE UPDATE ON public.patient_programs
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();