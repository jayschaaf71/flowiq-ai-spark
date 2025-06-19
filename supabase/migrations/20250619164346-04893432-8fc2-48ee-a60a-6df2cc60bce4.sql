
-- Add insurance providers and patient insurance tables if they don't exist
-- (These may already exist based on the schema, but adding IF NOT EXISTS for safety)

-- Add template storage for SOAP notes
CREATE TABLE IF NOT EXISTS public.soap_note_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  template_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add notification preferences for patients
CREATE TABLE IF NOT EXISTS public.patient_notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  email_reminders BOOLEAN DEFAULT true,
  sms_reminders BOOLEAN DEFAULT true,
  reminder_hours_before INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add appointment reminders tracking
CREATE TABLE IF NOT EXISTS public.appointment_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('email', 'sms')),
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.soap_note_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for SOAP note templates (accessible to all authenticated users)
CREATE POLICY "Users can view soap note templates" ON public.soap_note_templates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create soap note templates" ON public.soap_note_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Create policies for patient notification preferences
CREATE POLICY "Users can view patient notification preferences" ON public.patient_notification_preferences
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for appointment reminders
CREATE POLICY "Users can view appointment reminders" ON public.appointment_reminders
  FOR ALL USING (auth.role() = 'authenticated');

-- Add some default SOAP note templates
INSERT INTO public.soap_note_templates (name, specialty, template_data) VALUES
('General Consultation', 'General Practice', '{
  "subjective": "Chief Complaint:\n\nHistory of Present Illness:\n\nReview of Systems:",
  "objective": "Vital Signs:\n- BP:\n- HR:\n- Temp:\n- Resp:\n- O2 Sat:\n\nPhysical Exam:",
  "assessment": "Diagnosis/Impression:",
  "plan": "Treatment Plan:\n1.\n2.\n3.\n\nFollow-up:"
}'),
('Chiropractic Initial', 'Chiropractic', '{
  "subjective": "Chief Complaint:\n\nPain Level (1-10):\n\nOnset:\n\nAggravating Factors:\n\nAlleviating Factors:",
  "objective": "Postural Analysis:\n\nRange of Motion:\n\nOrthopedic Tests:\n\nNeurological Tests:\n\nPalpation:",
  "assessment": "Clinical Impression:\n\nDifferential Diagnosis:",
  "plan": "Treatment Plan:\n- Adjustments:\n- Therapy:\n- Home Exercises:\n- Follow-up Schedule:"
}'),
('Dental Examination', 'Dentistry', '{
  "subjective": "Chief Complaint:\n\nPain History:\n\nPrevious Dental Work:",
  "objective": "Extraoral Exam:\n\nIntraoral Exam:\n\nPeriodontal Assessment:\n\nRadiographic Findings:",
  "assessment": "Diagnosis:\n\nPrognosis:",
  "plan": "Treatment Recommendations:\n1.\n2.\n3.\n\nNext Appointment:"
}');
