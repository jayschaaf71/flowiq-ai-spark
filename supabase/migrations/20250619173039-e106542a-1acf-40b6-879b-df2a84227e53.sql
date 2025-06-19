
-- Enable RLS on tables first
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for medical_history (drop existing if any)
DROP POLICY IF EXISTS "Staff can manage medical history" ON public.medical_history;
CREATE POLICY "Staff can manage medical history" ON public.medical_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

-- Add RLS policies for medications (drop existing if any)
DROP POLICY IF EXISTS "Staff can manage medications" ON public.medications;
CREATE POLICY "Staff can manage medications" ON public.medications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

-- Add RLS policies for file_attachments (drop existing if any)
DROP POLICY IF EXISTS "Staff can manage file attachments" ON public.file_attachments;
CREATE POLICY "Staff can manage file attachments" ON public.file_attachments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

-- Create storage bucket for file attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-files', 'patient-files', false)
ON CONFLICT (id) DO NOTHING;

-- Add storage policies for patient files (drop existing if any)
DROP POLICY IF EXISTS "Staff can upload patient files" ON storage.objects;
CREATE POLICY "Staff can upload patient files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'patient-files' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

DROP POLICY IF EXISTS "Staff can view patient files" ON storage.objects;
CREATE POLICY "Staff can view patient files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'patient-files' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

DROP POLICY IF EXISTS "Staff can delete patient files" ON storage.objects;
CREATE POLICY "Staff can delete patient files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'patient-files' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );
