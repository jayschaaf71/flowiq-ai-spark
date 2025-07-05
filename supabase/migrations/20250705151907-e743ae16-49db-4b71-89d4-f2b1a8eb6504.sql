-- Add gender field to patients table
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS gender TEXT;

-- Create medical_conditions table for medical history
CREATE TABLE IF NOT EXISTS public.medical_conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  condition_name TEXT NOT NULL,
  diagnosis_date DATE,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create prescriptions table for prescription management
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  prescribed_by TEXT NOT NULL,
  prescribed_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS on new tables
ALTER TABLE public.medical_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for medical_conditions
CREATE POLICY "Users can view their own medical conditions" 
ON public.medical_conditions FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id OR auth.role() = 'staff'::text);

CREATE POLICY "Staff can manage all medical conditions" 
ON public.medical_conditions FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

CREATE POLICY "Users can manage their own medical conditions" 
ON public.medical_conditions FOR ALL 
TO authenticated 
USING (auth.uid() = patient_id);

-- RLS policies for prescriptions
CREATE POLICY "Users can view their own prescriptions" 
ON public.prescriptions FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id OR auth.role() = 'staff'::text);

CREATE POLICY "Staff can manage all prescriptions" 
ON public.prescriptions FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

CREATE POLICY "Users can manage their own prescriptions" 
ON public.prescriptions FOR ALL 
TO authenticated 
USING (auth.uid() = patient_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_medical_conditions_updated_at
  BEFORE UPDATE ON public.medical_conditions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_medical_conditions_patient_id ON public.medical_conditions(patient_id);
CREATE INDEX idx_medical_conditions_status ON public.medical_conditions(status);
CREATE INDEX idx_prescriptions_patient_id ON public.prescriptions(patient_id);
CREATE INDEX idx_prescriptions_status ON public.prescriptions(status);