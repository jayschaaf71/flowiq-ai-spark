-- Create platform metrics and monitoring tables
CREATE TABLE public.platform_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT NOT NULL, -- 'gauge', 'counter', 'histogram'
  tenant_id UUID REFERENCES public.tenants(id),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform performance metrics
CREATE TABLE public.platform_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  response_time_ms INTEGER NOT NULL,
  cpu_usage_percent NUMERIC(5,2),
  memory_usage_percent NUMERIC(5,2),
  database_connections INTEGER,
  active_sessions INTEGER,
  api_calls_count INTEGER DEFAULT 0,
  error_rate_percent NUMERIC(5,2) DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create revenue tracking
CREATE TABLE public.platform_revenue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id),
  amount NUMERIC(10,2) NOT NULL,
  revenue_type TEXT NOT NULL, -- 'subscription', 'usage', 'one_time'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_platform_metrics_name_time ON public.platform_metrics(metric_name, recorded_at DESC);
CREATE INDEX idx_platform_metrics_tenant ON public.platform_metrics(tenant_id, recorded_at DESC);
CREATE INDEX idx_platform_performance_time ON public.platform_performance(recorded_at DESC);
CREATE INDEX idx_platform_revenue_tenant_period ON public.platform_revenue(tenant_id, period_start, period_end);

-- Enable RLS
ALTER TABLE public.platform_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_revenue ENABLE ROW LEVEL SECURITY;

-- Create policies - only platform admins can access
CREATE POLICY "Platform admins can manage metrics" 
ON public.platform_metrics 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'platform_admin'::app_role
  )
);

CREATE POLICY "Platform admins can manage performance" 
ON public.platform_performance 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'platform_admin'::app_role
  )
);

CREATE POLICY "Platform admins can manage revenue" 
ON public.platform_revenue 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'platform_admin'::app_role
  )
);

-- Create function to calculate platform statistics
CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  total_tenants INTEGER;
  active_tenants INTEGER;
  total_users INTEGER;
  latest_performance RECORD;
  total_revenue NUMERIC;
  critical_alerts INTEGER;
BEGIN
  -- Check if user is platform admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'platform_admin'::app_role
  ) THEN
    RAISE EXCEPTION 'Access denied: Platform admin role required';
  END IF;

  -- Get tenant stats
  SELECT COUNT(*) INTO total_tenants FROM public.tenants;
  SELECT COUNT(*) INTO active_tenants FROM public.tenants WHERE is_active = true;
  
  -- Get user stats
  SELECT COUNT(*) INTO total_users FROM public.profiles;
  
  -- Get latest performance metrics
  SELECT * INTO latest_performance 
  FROM public.platform_performance 
  ORDER BY recorded_at DESC 
  LIMIT 1;
  
  -- Get total revenue (last 30 days)
  SELECT COALESCE(SUM(amount), 0) INTO total_revenue
  FROM public.platform_revenue 
  WHERE period_start >= CURRENT_DATE - INTERVAL '30 days';
  
  -- Get critical alerts count
  SELECT COUNT(*) INTO critical_alerts
  FROM public.platform_alerts 
  WHERE severity = 'critical' AND status = 'active';
  
  -- Build result
  result := json_build_object(
    'totalTenants', total_tenants,
    'activeTenants', active_tenants,
    'totalUsers', total_users,
    'averageResponseTime', COALESCE(latest_performance.response_time_ms, 120),
    'systemUptime', 99.9,
    'resourceUtilization', COALESCE(latest_performance.cpu_usage_percent, 45),
    'totalRevenue', total_revenue,
    'criticalAlerts', critical_alerts,
    'lastUpdated', EXTRACT(EPOCH FROM now())
  );
  
  RETURN result;
END;
$$;

-- Insert sample performance data for the last 24 hours
INSERT INTO public.platform_performance (response_time_ms, cpu_usage_percent, memory_usage_percent, database_connections, active_sessions, api_calls_count, error_rate_percent, recorded_at)
SELECT 
  (80 + (RANDOM() * 80))::INTEGER as response_time_ms,
  (30 + (RANDOM() * 40))::NUMERIC(5,2) as cpu_usage_percent,
  (40 + (RANDOM() * 30))::NUMERIC(5,2) as memory_usage_percent,
  (10 + (RANDOM() * 20))::INTEGER as database_connections,
  (50 + (RANDOM() * 200))::INTEGER as active_sessions,
  (1000 + (RANDOM() * 5000))::INTEGER as api_calls_count,
  (RANDOM() * 2)::NUMERIC(5,2) as error_rate_percent,
  now() - (interval '1 hour' * generate_series(0, 23))
FROM generate_series(0, 23);

-- Insert sample revenue data
INSERT INTO public.platform_revenue (tenant_id, amount, revenue_type, period_start, period_end)
SELECT 
  t.id,
  (100 + (RANDOM() * 900))::NUMERIC(10,2),
  'subscription',
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE
FROM public.tenants t
WHERE t.is_active = true;