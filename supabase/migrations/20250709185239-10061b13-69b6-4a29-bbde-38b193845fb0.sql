-- Create platform monitoring tables for real data

-- System metrics tracking
CREATE TABLE public.system_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL, -- 'cpu', 'memory', 'database', 'api', 'network'
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  threshold_warning NUMERIC,
  threshold_critical NUMERIC,
  status TEXT DEFAULT 'normal', -- 'normal', 'warning', 'critical'
  tenant_id UUID REFERENCES public.tenants(id)
);

-- Security incidents tracking
CREATE TABLE public.security_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  incident_type TEXT NOT NULL,
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT,
  affected_systems TEXT[],
  impact_level TEXT,
  response_time_minutes INTEGER,
  resolution_time_minutes INTEGER,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Platform alerts
CREATE TABLE public.platform_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL, -- 'performance', 'security', 'system', 'compliance'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  source_metric_id UUID REFERENCES public.system_metrics(id),
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Tenant resource usage tracking
CREATE TABLE public.tenant_usage_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  active_users INTEGER DEFAULT 0,
  storage_gb NUMERIC DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  database_queries INTEGER DEFAULT 0,
  monthly_revenue NUMERIC DEFAULT 0,
  cost_per_user NUMERIC DEFAULT 0,
  utilization_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, metric_date)
);

-- Enable RLS
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_usage_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for platform admin access
CREATE POLICY "Platform admins can manage all metrics"
ON public.system_metrics
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'platform_admin'
  )
);

CREATE POLICY "Platform admins can manage security incidents"
ON public.security_incidents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'platform_admin'
  )
);

CREATE POLICY "Platform admins can manage alerts"
ON public.platform_alerts
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'platform_admin'
  )
);

CREATE POLICY "Platform admins can view tenant usage"
ON public.tenant_usage_metrics
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'platform_admin'
  )
);

-- Create indexes for performance
CREATE INDEX idx_system_metrics_type_recorded ON public.system_metrics(metric_type, recorded_at DESC);
CREATE INDEX idx_security_incidents_status_severity ON public.security_incidents(status, severity);
CREATE INDEX idx_platform_alerts_status_created ON public.platform_alerts(status, created_at DESC);
CREATE INDEX idx_tenant_usage_tenant_date ON public.tenant_usage_metrics(tenant_id, metric_date DESC);

-- Function to calculate tenant metrics
CREATE OR REPLACE FUNCTION calculate_tenant_metrics()
RETURNS void AS $$
BEGIN
  -- Update tenant usage metrics daily
  INSERT INTO public.tenant_usage_metrics (tenant_id, active_users, storage_gb, api_calls)
  SELECT 
    t.id as tenant_id,
    COUNT(DISTINCT p.id) as active_users,
    0 as storage_gb, -- placeholder for actual storage calculation
    0 as api_calls -- placeholder for actual API call counting
  FROM public.tenants t
  LEFT JOIN public.profiles p ON p.tenant_id = t.id
  WHERE t.is_active = true
  GROUP BY t.id
  ON CONFLICT (tenant_id, metric_date) 
  DO UPDATE SET 
    active_users = EXCLUDED.active_users,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;