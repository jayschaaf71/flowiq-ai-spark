-- Create Missing Tables for Platform Admin Functionality
-- This script creates the tables that are missing from the diagnostic

-- 1. Create system_monitoring table
CREATE TABLE IF NOT EXISTS public.system_monitoring (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_unit VARCHAR(20),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    tenant_id UUID REFERENCES public.tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create system_alerts table
CREATE TABLE IF NOT EXISTS public.system_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'acknowledged')),
    tenant_id UUID REFERENCES public.tenants(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 3. Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'suspended', 'expired')),
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) NOT NULL,
    subscription_id UUID REFERENCES public.subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Insert sample data for testing
INSERT INTO public.system_monitoring (metric_name, metric_value, metric_unit, tenant_id) VALUES
('cpu_usage', 45.2, 'percent', (SELECT id FROM public.tenants LIMIT 1)),
('memory_usage', 67.8, 'percent', (SELECT id FROM public.tenants LIMIT 1)),
('disk_usage', 23.4, 'percent', (SELECT id FROM public.tenants LIMIT 1)),
('response_time', 125.6, 'ms', (SELECT id FROM public.tenants LIMIT 1)),
('active_users', 12, 'count', (SELECT id FROM public.tenants LIMIT 1));

INSERT INTO public.system_alerts (alert_type, severity, message, tenant_id) VALUES
('performance', 'medium', 'Response time increased by 20%', (SELECT id FROM public.tenants LIMIT 1)),
('security', 'high', 'Multiple failed login attempts detected', (SELECT id FROM public.tenants LIMIT 1)),
('system', 'low', 'Backup completed successfully', (SELECT id FROM public.tenants LIMIT 1));

INSERT INTO public.subscriptions (tenant_id, plan_name, plan_type, status, start_date, end_date, monthly_amount) VALUES
((SELECT id FROM public.tenants LIMIT 1), 'Professional Plan', 'monthly', 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 299.00),
((SELECT id FROM public.tenants OFFSET 1 LIMIT 1), 'Basic Plan', 'monthly', 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 99.00);

INSERT INTO public.payments (tenant_id, subscription_id, amount, status, payment_method) VALUES
((SELECT id FROM public.tenants LIMIT 1), (SELECT id FROM public.subscriptions LIMIT 1), 299.00, 'completed', 'credit_card'),
((SELECT id FROM public.tenants OFFSET 1 LIMIT 1), (SELECT id FROM public.subscriptions OFFSET 1 LIMIT 1), 99.00, 'completed', 'credit_card');

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_monitoring_timestamp ON public.system_monitoring(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_alerts_status ON public.system_alerts(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 7. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_monitoring TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_alerts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated; 