
-- Create table for integration settings (Plaud, EHR, etc.)
CREATE TABLE public.integration_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider TEXT NOT NULL, -- 'plaud', 'epic', 'cerner', etc.
  settings JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for voice recordings from various sources
CREATE TABLE public.voice_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  source TEXT NOT NULL, -- 'plaud', 'manual_upload', 'live_recording'
  external_id TEXT, -- ID from external system like Plaud
  filename TEXT NOT NULL,
  duration INTEGER, -- in seconds
  transcription TEXT,
  ai_summary TEXT,
  soap_note JSONB,
  processed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_recordings ENABLE ROW LEVEL SECURITY;

-- Create policies for integration_settings
CREATE POLICY "Users can view their own integration settings" 
  ON public.integration_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own integration settings" 
  ON public.integration_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integration settings" 
  ON public.integration_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integration settings" 
  ON public.integration_settings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for voice_recordings
CREATE POLICY "Users can view their own voice recordings" 
  ON public.voice_recordings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voice recordings" 
  ON public.voice_recordings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voice recordings" 
  ON public.voice_recordings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own voice recordings" 
  ON public.voice_recordings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER trigger_set_timestamp_integration_settings
  BEFORE UPDATE ON public.integration_settings
  FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

CREATE TRIGGER trigger_set_timestamp_voice_recordings
  BEFORE UPDATE ON public.voice_recordings
  FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();
