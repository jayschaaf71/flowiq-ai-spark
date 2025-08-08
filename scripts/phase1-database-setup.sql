-- Phase 1: Database Setup for Production
-- This script implements real-time monitoring and alert systems

-- 1. Create System Monitoring Table
CREATE TABLE IF NOT EXISTS public.system_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpu_usage_percent DECIMAL(5,2),
  memory_usage_percent DECIMAL(5,2),
  disk_usage_percent DECIMAL(5,2),
  network_bandwidth_mbps DECIMAL(10,2),
  response_time_ms INTEGER,
  active_connections INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Create Enhanced Alert System
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  affected_system VARCHAR(100),
  metric_value DECIMAL(10,2),
  threshold_value DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES auth.users(id),
  resolved_by UUID REFERENCES auth.users(id)
);

-- 3. Create Subscription Management
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id),
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  plan_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Create Payment Tracking
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id),
  stripe_payment_intent_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Create System Metrics Insert Function
CREATE OR REPLACE FUNCTION public.insert_system_metrics(
  p_cpu_usage DECIMAL,
  p_memory_usage DECIMAL,
  p_disk_usage DECIMAL,
  p_network_bandwidth DECIMAL,
  p_response_time INTEGER,
  p_active_connections INTEGER
) RETURNS void AS $$
BEGIN
  INSERT INTO public.system_monitoring (
    cpu_usage_percent,
    memory_usage_percent,
    disk_usage_percent,
    network_bandwidth_mbps,
    response_time_ms,
    active_connections
  ) VALUES (
    p_cpu_usage,
    p_memory_usage,
    p_disk_usage,
    p_network_bandwidth,
    p_response_time,
    p_active_connections
  );
END;
$$ LANGUAGE plpgsql;

-- 6. Create Alert Generation Function
CREATE OR REPLACE FUNCTION public.generate_system_alert(
  p_alert_type VARCHAR,
  p_title VARCHAR,
  p_message TEXT,
  p_severity VARCHAR,
  p_affected_system VARCHAR,
  p_metric_value DECIMAL,
  p_threshold_value DECIMAL
) RETURNS void AS $$
BEGIN
  INSERT INTO public.system_alerts (
    alert_type,
    title,
    message,
    severity,
    affected_system,
    metric_value,
    threshold_value
  ) VALUES (
    p_alert_type,
    p_title,
    p_message,
    p_severity,
    p_affected_system,
    p_metric_value,
    p_threshold_value
  );
END;
$$ LANGUAGE plpgsql;

-- 7. Create Revenue Calculation Function
CREATE OR REPLACE FUNCTION public.calculate_monthly_revenue()
RETURNS DECIMAL AS $$
DECLARE
  total_revenue DECIMAL;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO total_revenue
  FROM public.payments
  WHERE status = 'succeeded'
    AND created_at >= date_trunc('month', CURRENT_DATE);
  
  RETURN total_revenue;
END;
$$ LANGUAGE plpgsql;

-- 8. Create Enhanced Platform Stats Function
CREATE OR REPLACE FUNCTION public.get_enhanced_platform_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_tenants INTEGER;
  active_tenants INTEGER;
  total_users INTEGER;
  monthly_revenue DECIMAL;
  system_health JSON;
  performance_metrics JSON;
BEGIN
  -- Get tenant stats
  SELECT COUNT(*) INTO total_tenants FROM public.tenants;
  SELECT COUNT(*) INTO active_tenants FROM public.tenants WHERE is_active = true;
  
  -- Get user stats
  SELECT COUNT(*) INTO total_users FROM public.profiles;
  
  -- Get revenue
  SELECT calculate_monthly_revenue() INTO monthly_revenue;
  
  -- Get system health
  SELECT json_build_object(
    'cpu_usage', (SELECT AVG(cpu_usage_percent) FROM public.system_monitoring WHERE recorded_at >= now() - interval '1 hour'),
    'memory_usage', (SELECT AVG(memory_usage_percent) FROM public.system_monitoring WHERE recorded_at >= now() - interval '1 hour'),
    'disk_usage', (SELECT AVG(disk_usage_percent) FROM public.system_monitoring WHERE recorded_at >= now() - interval '1 hour'),
    'uptime', 99.9
  ) INTO system_health;
  
  -- Get performance metrics
  SELECT json_build_object(
    'avg_response_time', (SELECT AVG(response_time_ms) FROM public.system_monitoring WHERE recorded_at >= now() - interval '1 hour'),
    'active_connections', (SELECT AVG(active_connections) FROM public.system_monitoring WHERE recorded_at >= now() - interval '1 hour'),
    'network_bandwidth', (SELECT AVG(network_bandwidth_mbps) FROM public.system_monitoring WHERE recorded_at >= now() - interval '1 hour')
  ) INTO performance_metrics;
  
  -- Build result
  result := json_build_object(
    'totalTenants', total_tenants,
    'activeTenants', active_tenants,
    'totalUsers', total_users,
    'monthlyRevenue', monthly_revenue,
    'systemHealth', system_health,
    'performanceMetrics', performance_metrics,
    'criticalAlerts', (SELECT COUNT(*) FROM public.system_alerts WHERE severity = 'critical' AND status = 'active'),
    'lastUpdated', EXTRACT(EPOCH FROM now())
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 9. Insert Sample Data for Testing
INSERT INTO public.system_monitoring (
  cpu_usage_percent,
  memory_usage_percent,
  disk_usage_percent,
  network_bandwidth_mbps,
  response_time_ms,
  active_connections
) VALUES 
(45.2, 62.8, 34.1, 125.5, 149, 23),
(47.1, 64.2, 34.3, 128.7, 152, 25),
(43.8, 61.5, 33.9, 122.3, 147, 22),
(49.5, 66.1, 35.2, 131.4, 155, 27),
(41.3, 59.8, 33.5, 119.8, 145, 21);

-- 10. Insert Sample Alerts
INSERT INTO public.system_alerts (
  alert_type,
  title,
  message,
  severity,
  affected_system,
  metric_value,
  threshold_value
) VALUES 
('performance', 'High Response Time', 'Average response time exceeded threshold', 'medium', 'API Gateway', 155, 150),
('resource', 'Memory Usage Warning', 'Memory usage approaching limit', 'low', 'Application Server', 66.1, 70);

-- 11. Verify Setup
SELECT 
  'Phase 1 Setup Complete:' as status,
  (SELECT COUNT(*) FROM public.system_monitoring) as monitoring_records,
  (SELECT COUNT(*) FROM public.system_alerts) as alert_records,
  (SELECT COUNT(*) FROM public.subscriptions) as subscription_records,
  (SELECT COUNT(*) FROM public.payments) as payment_records;

-- 12. Test Enhanced Stats Function
SELECT 
  'Enhanced Stats Test:' as test_type,
  get_enhanced_platform_stats() as enhanced_stats; 