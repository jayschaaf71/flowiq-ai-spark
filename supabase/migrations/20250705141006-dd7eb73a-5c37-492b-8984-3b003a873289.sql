-- Update appointments table to match code expectations
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS provider_id UUID,
ALTER COLUMN provider DROP NOT NULL;

-- Add foreign key relationship
ALTER TABLE public.appointments 
ADD CONSTRAINT fk_appointments_provider 
FOREIGN KEY (provider_id) REFERENCES public.providers(id);

-- Create patient_notifications table
CREATE TABLE IF NOT EXISTS public.patient_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE
);

-- Create patient_checkins table
CREATE TABLE IF NOT EXISTS public.patient_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  check_in_method TEXT DEFAULT 'manual',
  forms_completed BOOLEAN DEFAULT false,
  insurance_verified BOOLEAN DEFAULT false,
  copay_collected BOOLEAN DEFAULT false,
  copay_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE
);

-- Enable RLS on new tables
ALTER TABLE public.patient_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_checkins ENABLE ROW LEVEL SECURITY;

-- RLS policies for patient_notifications
CREATE POLICY "Users can view their own notifications" 
ON public.patient_notifications FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id);

CREATE POLICY "Staff can manage all notifications" 
ON public.patient_notifications FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- RLS policies for patient_checkins
CREATE POLICY "Staff can manage all checkins" 
ON public.patient_checkins FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

CREATE POLICY "Users can view their own checkins" 
ON public.patient_checkins FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_patient_notifications_updated_at
  BEFORE UPDATE ON public.patient_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_patient_checkins_updated_at
  BEFORE UPDATE ON public.patient_checkins
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_patient_notifications_patient_id ON public.patient_notifications(patient_id);
CREATE INDEX idx_patient_notifications_read ON public.patient_notifications(read);
CREATE INDEX idx_patient_checkins_appointment_id ON public.patient_checkins(appointment_id);
CREATE INDEX idx_patient_checkins_patient_id ON public.patient_checkins(patient_id);