
-- Create appointment_waitlist table
CREATE TABLE public.appointment_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  appointment_type TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TIME,
  provider_id UUID REFERENCES public.providers(id),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'contacted', 'scheduled', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add trigger for updated_at
CREATE TRIGGER update_appointment_waitlist_updated_at
  BEFORE UPDATE ON public.appointment_waitlist
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.appointment_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now - can be restricted later based on user roles)
CREATE POLICY "Enable read access for all users" ON public.appointment_waitlist
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.appointment_waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.appointment_waitlist
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.appointment_waitlist
  FOR DELETE USING (true);
