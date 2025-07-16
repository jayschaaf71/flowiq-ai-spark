-- Create storage bucket for voice recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('voice-recordings', 'voice-recordings', false);

-- Create RLS policies for voice recordings bucket
CREATE POLICY "Users can upload their own recordings" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own recordings" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own recordings" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enhance voice_recordings table for better tracking
ALTER TABLE voice_recordings 
ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS processing_time_ms INTEGER,
ADD COLUMN IF NOT EXISTS audio_format TEXT DEFAULT 'webm',
ADD COLUMN IF NOT EXISTS storage_path TEXT,
ADD COLUMN IF NOT EXISTS background_processed BOOLEAN DEFAULT false;