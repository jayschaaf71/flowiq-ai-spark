-- Create audit_logs table for compliance monitoring
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create file_attachments table
CREATE TABLE IF NOT EXISTS public.file_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID,
  appointment_id UUID,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  description TEXT,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create claims table for claims management
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  appointment_id UUID,
  claim_number TEXT UNIQUE,
  status TEXT DEFAULT 'draft',
  total_amount DECIMAL(10,2),
  submitted_date DATE,
  processed_date DATE,
  payer_name TEXT,
  diagnosis_codes TEXT[],
  procedure_codes TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE SET NULL
);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  record_type TEXT NOT NULL,
  content JSONB,
  diagnosis TEXT,
  treatment TEXT,
  medications TEXT[],
  allergies TEXT[],
  vital_signs JSONB,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS on all new tables
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- RLS policies for audit_logs
CREATE POLICY "Staff can view all audit logs" 
ON public.audit_logs FOR SELECT 
TO authenticated 
USING (auth.role() = 'staff'::text);

CREATE POLICY "System can insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (true);

-- RLS policies for file_attachments
CREATE POLICY "Users can view their own file attachments" 
ON public.file_attachments FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id OR auth.role() = 'staff'::text);

CREATE POLICY "Staff can manage all file attachments" 
ON public.file_attachments FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- RLS policies for claims
CREATE POLICY "Users can view their own claims" 
ON public.claims FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id OR auth.role() = 'staff'::text);

CREATE POLICY "Staff can manage all claims" 
ON public.claims FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- RLS policies for medical_records
CREATE POLICY "Users can view their own medical records" 
ON public.medical_records FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id OR auth.role() = 'staff'::text);

CREATE POLICY "Staff can manage all medical records" 
ON public.medical_records FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_file_attachments_updated_at
  BEFORE UPDATE ON public.file_attachments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON public.claims
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_medical_records_updated_at
  BEFORE UPDATE ON public.medical_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_file_attachments_patient_id ON public.file_attachments(patient_id);
CREATE INDEX idx_file_attachments_appointment_id ON public.file_attachments(appointment_id);
CREATE INDEX idx_claims_patient_id ON public.claims(patient_id);
CREATE INDEX idx_claims_status ON public.claims(status);
CREATE INDEX idx_medical_records_patient_id ON public.medical_records(patient_id);