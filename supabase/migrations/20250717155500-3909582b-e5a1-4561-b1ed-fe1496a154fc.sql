-- Create calendar_integrations table to store connected calendar accounts
CREATE TABLE public.calendar_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'google', 'outlook', 'apple'
  provider_account_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  scope TEXT,
  calendar_id VARCHAR(255), -- External calendar ID
  calendar_name VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_direction VARCHAR(20) DEFAULT 'bidirectional', -- 'import_only', 'export_only', 'bidirectional'
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create calendar_sync_logs table to track sync operations
CREATE TABLE public.calendar_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID NOT NULL,
  sync_type VARCHAR(50) NOT NULL, -- 'full_sync', 'incremental_sync', 'appointment_create', 'appointment_update', 'appointment_delete'
  direction VARCHAR(20) NOT NULL, -- 'import', 'export', 'bidirectional'
  status VARCHAR(20) NOT NULL, -- 'success', 'failed', 'partial'
  appointments_processed INTEGER DEFAULT 0,
  appointments_created INTEGER DEFAULT 0,
  appointments_updated INTEGER DEFAULT 0,
  appointments_deleted INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create external_calendar_events table to map our appointments to external calendar events
CREATE TABLE public.external_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL,
  integration_id UUID NOT NULL,
  external_event_id VARCHAR(255) NOT NULL,
  external_calendar_id VARCHAR(255) NOT NULL,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies for calendar_integrations
CREATE POLICY "Users can view their own calendar integrations" 
ON public.calendar_integrations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calendar integrations" 
ON public.calendar_integrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar integrations" 
ON public.calendar_integrations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar integrations" 
ON public.calendar_integrations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for calendar_sync_logs
CREATE POLICY "Users can view sync logs for their integrations" 
ON public.calendar_sync_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.calendar_integrations ci 
    WHERE ci.id = calendar_sync_logs.integration_id 
    AND ci.user_id = auth.uid()
  )
);

CREATE POLICY "System can create sync logs" 
ON public.calendar_sync_logs 
FOR INSERT 
WITH CHECK (true);

-- Create policies for external_calendar_events
CREATE POLICY "Users can view events for their appointments" 
ON public.external_calendar_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.appointments a 
    WHERE a.id = external_calendar_events.appointment_id 
    AND (a.patient_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.calendar_integrations ci 
      WHERE ci.id = external_calendar_events.integration_id 
      AND ci.user_id = auth.uid()
    ))
  )
);

CREATE POLICY "System can manage external calendar events" 
ON public.external_calendar_events 
FOR ALL 
USING (true);

-- Create foreign key constraints
ALTER TABLE public.calendar_integrations
ADD CONSTRAINT calendar_integrations_tenant_id_fkey 
FOREIGN KEY (tenant_id) REFERENCES public.tenants (id);

ALTER TABLE public.calendar_sync_logs
ADD CONSTRAINT calendar_sync_logs_integration_id_fkey 
FOREIGN KEY (integration_id) REFERENCES public.calendar_integrations (id) ON DELETE CASCADE;

ALTER TABLE public.calendar_sync_logs
ADD CONSTRAINT calendar_sync_logs_tenant_id_fkey 
FOREIGN KEY (tenant_id) REFERENCES public.tenants (id);

ALTER TABLE public.external_calendar_events
ADD CONSTRAINT external_calendar_events_appointment_id_fkey 
FOREIGN KEY (appointment_id) REFERENCES public.appointments (id) ON DELETE CASCADE;

ALTER TABLE public.external_calendar_events
ADD CONSTRAINT external_calendar_events_integration_id_fkey 
FOREIGN KEY (integration_id) REFERENCES public.calendar_integrations (id) ON DELETE CASCADE;

ALTER TABLE public.external_calendar_events
ADD CONSTRAINT external_calendar_events_tenant_id_fkey 
FOREIGN KEY (tenant_id) REFERENCES public.tenants (id);

-- Create indexes for better performance
CREATE INDEX idx_calendar_integrations_user_id ON public.calendar_integrations (user_id);
CREATE INDEX idx_calendar_integrations_provider ON public.calendar_integrations (provider);
CREATE INDEX idx_calendar_sync_logs_integration_id ON public.calendar_sync_logs (integration_id);
CREATE INDEX idx_calendar_sync_logs_status ON public.calendar_sync_logs (status);
CREATE INDEX idx_external_calendar_events_appointment_id ON public.external_calendar_events (appointment_id);
CREATE INDEX idx_external_calendar_events_integration_id ON public.external_calendar_events (integration_id);
CREATE INDEX idx_external_calendar_events_external_event_id ON public.external_calendar_events (external_event_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_calendar_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_calendar_integrations_updated_at
BEFORE UPDATE ON public.calendar_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_calendar_updated_at_column();

CREATE TRIGGER update_external_calendar_events_updated_at
BEFORE UPDATE ON public.external_calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_calendar_updated_at_column();