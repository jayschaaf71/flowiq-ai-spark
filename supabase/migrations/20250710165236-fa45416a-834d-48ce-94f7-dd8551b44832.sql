-- Create tables for multi-tenant Plaud integration
CREATE TABLE public.plaud_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  webhook_url TEXT,
  api_key TEXT,
  auto_sync BOOLEAN NOT NULL DEFAULT false,
  sync_frequency_minutes INTEGER DEFAULT 30,
  transcription_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  
  UNIQUE(tenant_id)
);

CREATE TABLE public.voice_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  recording_id TEXT, -- External ID from Plaud/Zapier
  original_filename TEXT,
  transcription TEXT,
  ai_summary TEXT,
  soap_notes JSONB,
  source TEXT NOT NULL DEFAULT 'plaud',
  status TEXT NOT NULL DEFAULT 'processing',
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  audio_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.plaud_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_recordings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plaud_configurations
CREATE POLICY "Users can view configurations for their tenant" ON public.plaud_configurations
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Practice admins can manage configurations" ON public.plaud_configurations
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for voice_recordings
CREATE POLICY "Users can view recordings in their tenant" ON public.voice_recordings
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can create recordings in their tenant" ON public.voice_recordings
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can update recordings in their tenant" ON public.voice_recordings
  FOR UPDATE USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Add updated_at triggers
CREATE TRIGGER update_plaud_configurations_updated_at
  BEFORE UPDATE ON public.plaud_configurations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voice_recordings_updated_at
  BEFORE UPDATE ON public.voice_recordings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_plaud_configurations_tenant_id ON public.plaud_configurations(tenant_id);
CREATE INDEX idx_voice_recordings_tenant_id ON public.voice_recordings(tenant_id);
CREATE INDEX idx_voice_recordings_patient_id ON public.voice_recordings(patient_id);
CREATE INDEX idx_voice_recordings_status ON public.voice_recordings(status);
CREATE INDEX idx_voice_recordings_created_at ON public.voice_recordings(created_at);