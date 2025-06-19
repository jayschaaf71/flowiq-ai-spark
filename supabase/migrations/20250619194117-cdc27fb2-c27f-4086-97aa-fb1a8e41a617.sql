
-- Create recurring_appointments table
CREATE TABLE public.recurring_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_id UUID,
  appointment_type TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  interval_count INTEGER NOT NULL DEFAULT 1,
  days_of_week INTEGER[] DEFAULT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  max_occurrences INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_scheduled DATE,
  occurrences_created INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  notes TEXT
);

-- Add trigger for updated_at
CREATE TRIGGER update_recurring_appointments_updated_at
  BEFORE UPDATE ON public.recurring_appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.recurring_appointments ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now - can be restricted later based on user roles)
CREATE POLICY "Enable read access for all users" ON public.recurring_appointments
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.recurring_appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.recurring_appointments
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.recurring_appointments
  FOR DELETE USING (true);

-- Add index for performance
CREATE INDEX idx_recurring_appointments_patient_id ON public.recurring_appointments(patient_id);
CREATE INDEX idx_recurring_appointments_next_scheduled ON public.recurring_appointments(next_scheduled);
CREATE INDEX idx_recurring_appointments_is_active ON public.recurring_appointments(is_active);
