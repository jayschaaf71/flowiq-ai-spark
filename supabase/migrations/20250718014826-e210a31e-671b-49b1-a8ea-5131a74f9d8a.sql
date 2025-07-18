-- Create storage bucket for insurance cards
INSERT INTO storage.buckets (id, name, public) VALUES ('insurance-cards', 'insurance-cards', false);

-- Create insurance_cards table
CREATE TABLE public.insurance_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  card_type VARCHAR(50) NOT NULL DEFAULT 'primary', -- 'primary', 'secondary'
  front_image_path TEXT,
  back_image_path TEXT,
  insurance_provider_name TEXT,
  policy_number TEXT,
  group_number TEXT,
  member_id TEXT,
  extracted_data JSONB,
  verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.insurance_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for insurance cards
CREATE POLICY "Patients can upload their own insurance cards" 
ON public.insurance_cards 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can view their own insurance cards" 
ON public.insurance_cards 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own insurance cards" 
ON public.insurance_cards 
FOR UPDATE 
USING (auth.uid() = patient_id);

CREATE POLICY "Staff can manage all insurance cards" 
ON public.insurance_cards 
FOR ALL 
USING (has_staff_access(auth.uid()));

-- Create storage policies for insurance cards
CREATE POLICY "Patients can upload their own insurance card images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'insurance-cards' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Patients can view their own insurance card images" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'insurance-cards' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Staff can access all insurance card images" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'insurance-cards' 
  AND has_staff_access(auth.uid())
);

-- Add trigger for updated_at
CREATE TRIGGER update_insurance_cards_updated_at
BEFORE UPDATE ON public.insurance_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();