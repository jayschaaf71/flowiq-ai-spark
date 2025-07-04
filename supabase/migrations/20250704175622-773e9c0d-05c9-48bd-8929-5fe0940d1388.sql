-- Create storage bucket for patient files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('patient-files', 'patient-files', false);

-- Create storage policies for patient files
CREATE POLICY "Patients can view their own files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'patient-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Patients can upload their own files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'patient-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Patients can update their own files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'patient-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Patients can delete their own files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'patient-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Staff can manage all patient files" 
ON storage.objects FOR ALL 
USING (bucket_id = 'patient-files' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('staff', 'admin')
));