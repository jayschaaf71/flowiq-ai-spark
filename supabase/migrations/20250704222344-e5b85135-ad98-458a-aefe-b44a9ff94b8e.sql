-- Create patient onboarding tables
CREATE TABLE public.patient_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tenant_id UUID,
  step_completed INTEGER NOT NULL DEFAULT 0,
  total_steps INTEGER NOT NULL DEFAULT 7,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  personal_info JSONB DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  insurance_info JSONB DEFAULT '{}',
  medical_history JSONB DEFAULT '{}',
  emergency_contact JSONB DEFAULT '{}',
  consents JSONB DEFAULT '{}',
  documents_uploaded JSONB DEFAULT '[]',
  portal_preferences JSONB DEFAULT '{}',
  specialty TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create patient documents table
CREATE TABLE public.patient_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  document_category TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  tenant_id UUID,
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on new tables
ALTER TABLE public.patient_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patient_onboarding
CREATE POLICY "Users can manage their own onboarding" 
ON public.patient_onboarding FOR ALL 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Staff can view all onboarding records" 
ON public.patient_onboarding FOR SELECT 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = ANY(ARRAY['staff', 'admin'])
));

-- RLS Policies for patient_documents
CREATE POLICY "Users can manage their own documents" 
ON public.patient_documents FOR ALL 
TO authenticated 
USING (patient_id = auth.uid());

CREATE POLICY "Staff can view all patient documents" 
ON public.patient_documents FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = ANY(ARRAY['staff', 'admin'])
));

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_patient_onboarding_updated_at
  BEFORE UPDATE ON public.patient_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for patient documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'patient-documents', 
  'patient-documents', 
  false, 
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create storage policies for patient documents
CREATE POLICY "Users can upload their own documents" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'patient-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'patient-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'patient-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Staff can view all patient documents" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'patient-documents' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = ANY(ARRAY['staff', 'admin'])
  )
);