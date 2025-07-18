-- Create comprehensive cost tracking and analytics tables

-- Tenant Cost Tracking Table
CREATE TABLE public.tenant_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  cost_period_start TIMESTAMPTZ NOT NULL,
  cost_period_end TIMESTAMPTZ NOT NULL,
  infrastructure_costs NUMERIC(12,2) DEFAULT 0,
  ai_api_costs NUMERIC(12,2) DEFAULT 0,
  communication_costs NUMERIC(12,2) DEFAULT 0,
  storage_costs NUMERIC(12,2) DEFAULT 0,
  compute_costs NUMERIC(12,2) DEFAULT 0,
  third_party_costs NUMERIC(12,2) DEFAULT 0,
  total_costs NUMERIC(12,2) GENERATED ALWAYS AS (
    infrastructure_costs + ai_api_costs + communication_costs + 
    storage_costs + compute_costs + third_party_costs
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Service Usage Tracking Table
CREATE TABLE public.service_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'openai', 'twilio', 'sendgrid', 'storage', etc.
  usage_date DATE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  usage_volume NUMERIC(12,4) DEFAULT 0, -- for storage GB, token count, etc.
  unit_cost NUMERIC(8,4) DEFAULT 0,
  total_cost NUMERIC(10,2) GENERATED ALWAYS AS (usage_count * unit_cost + usage_volume * unit_cost) STORED,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tenant Revenue Tracking Table  
CREATE TABLE public.tenant_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  revenue_period_start TIMESTAMPTZ NOT NULL,
  revenue_period_end TIMESTAMPTZ NOT NULL,
  subscription_revenue NUMERIC(12,2) DEFAULT 0,
  usage_revenue NUMERIC(12,2) DEFAULT 0,
  setup_fees NUMERIC(12,2) DEFAULT 0,
  other_revenue NUMERIC(12,2) DEFAULT 0,
  total_revenue NUMERIC(12,2) GENERATED ALWAYS AS (
    subscription_revenue + usage_revenue + setup_fees + other_revenue
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Margin Analysis Table
CREATE TABLE public.tenant_margins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  analysis_period_start TIMESTAMPTZ NOT NULL,
  analysis_period_end TIMESTAMPTZ NOT NULL,
  total_revenue NUMERIC(12,2) NOT NULL,
  total_costs NUMERIC(12,2) NOT NULL,
  gross_margin NUMERIC(12,2) GENERATED ALWAYS AS (total_revenue - total_costs) STORED,
  margin_percentage NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE WHEN total_revenue > 0 
    THEN ((total_revenue - total_costs) / total_revenue) * 100 
    ELSE 0 END
  ) STORED,
  customer_acquisition_cost NUMERIC(10,2) DEFAULT 0,
  lifetime_value NUMERIC(12,2) DEFAULT 0,
  churn_risk_score INTEGER DEFAULT 0 CHECK (churn_risk_score >= 0 AND churn_risk_score <= 100),
  profitability_status TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN margin_percentage >= 20 THEN 'highly_profitable'
      WHEN margin_percentage >= 10 THEN 'profitable' 
      WHEN margin_percentage >= 0 THEN 'break_even'
      ELSE 'unprofitable'
    END
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Feature Usage Analytics Table
CREATE TABLE public.feature_usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  usage_date DATE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  session_duration_minutes INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2) DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  performance_score INTEGER DEFAULT 0 CHECK (performance_score >= 0 AND performance_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cost Optimization Recommendations Table
CREATE TABLE public.cost_optimization_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  potential_savings NUMERIC(10,2) DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'implementing', 'completed', 'dismissed')),
  implementation_effort TEXT DEFAULT 'medium' CHECK (implementation_effort IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Platform Financial Reports Table
CREATE TABLE public.platform_financial_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL,
  report_period_start TIMESTAMPTZ NOT NULL,
  report_period_end TIMESTAMPTZ NOT NULL,
  report_data JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  generated_by UUID REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE public.tenant_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_margins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_optimization_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_financial_reports ENABLE ROW LEVEL SECURITY;

-- Platform admin policies
CREATE POLICY "Platform admins can manage tenant costs" ON public.tenant_costs
FOR ALL USING (is_platform_admin(auth.uid()));

CREATE POLICY "Platform admins can manage service usage" ON public.service_usage
FOR ALL USING (is_platform_admin(auth.uid()));

CREATE POLICY "Platform admins can manage tenant revenue" ON public.tenant_revenue
FOR ALL USING (is_platform_admin(auth.uid()));

CREATE POLICY "Platform admins can manage tenant margins" ON public.tenant_margins
FOR ALL USING (is_platform_admin(auth.uid()));

CREATE POLICY "Platform admins can manage feature analytics" ON public.feature_usage_analytics
FOR ALL USING (is_platform_admin(auth.uid()));

CREATE POLICY "Platform admins can manage cost recommendations" ON public.cost_optimization_recommendations
FOR ALL USING (is_platform_admin(auth.uid()));

CREATE POLICY "Platform admins can manage financial reports" ON public.platform_financial_reports
FOR ALL USING (is_platform_admin(auth.uid()));

-- Tenant view policies
CREATE POLICY "Tenants can view their own costs" ON public.tenant_costs
FOR SELECT USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_users 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Tenants can view their own margins" ON public.tenant_margins
FOR SELECT USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_users 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Add indexes for performance
CREATE INDEX idx_tenant_costs_tenant_period ON public.tenant_costs(tenant_id, cost_period_start, cost_period_end);
CREATE INDEX idx_service_usage_tenant_date ON public.service_usage(tenant_id, usage_date);
CREATE INDEX idx_tenant_revenue_tenant_period ON public.tenant_revenue(tenant_id, revenue_period_start, revenue_period_end);
CREATE INDEX idx_tenant_margins_tenant_period ON public.tenant_margins(tenant_id, analysis_period_start, analysis_period_end);
CREATE INDEX idx_feature_usage_tenant_date ON public.feature_usage_analytics(tenant_id, usage_date);

-- Create triggers for updated_at
CREATE TRIGGER update_tenant_costs_updated_at
  BEFORE UPDATE ON public.tenant_costs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_revenue_updated_at
  BEFORE UPDATE ON public.tenant_revenue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_margins_updated_at
  BEFORE UPDATE ON public.tenant_margins
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cost_recommendations_updated_at
  BEFORE UPDATE ON public.cost_optimization_recommendations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();