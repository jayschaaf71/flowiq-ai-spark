-- Create integrations table for managing email, SMS, calendar, and payment integrations
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'calendar', 'payment')),
  name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  settings JSONB NOT NULL DEFAULT '{}',
  credentials JSONB NOT NULL DEFAULT '{}',
  last_sync_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'syncing')),
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(type, tenant_id)
);

-- Enable Row Level Security
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Create policies for integrations
CREATE POLICY "Staff can manage integrations in their tenant"
ON public.integrations
FOR ALL
USING (
  tenant_id IN (
    SELECT tu.tenant_id 
    FROM tenant_users tu 
    JOIN profiles p ON tu.user_id = p.id 
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true 
    AND p.role IN ('platform_admin', 'practice_admin', 'practice_manager', 'provider', 'staff')
  )
)
WITH CHECK (
  tenant_id IN (
    SELECT tu.tenant_id 
    FROM tenant_users tu 
    JOIN profiles p ON tu.user_id = p.id 
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true 
    AND p.role IN ('platform_admin', 'practice_admin', 'practice_manager', 'provider', 'staff')
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_integrations_updated_at
BEFORE UPDATE ON public.integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email integration record
INSERT INTO public.integrations (type, name, settings) VALUES 
('email', 'Email Integration', '{"provider": "resend", "fromEmail": "", "fromName": ""}');

-- Insert default SMS integration record  
INSERT INTO public.integrations (type, name, settings) VALUES 
('sms', 'SMS Integration', '{"provider": "twilio", "fromNumber": ""}');