export interface TenantCosts {
  id: string;
  tenant_id: string;
  cost_period_start: string;
  cost_period_end: string;
  infrastructure_costs: number;
  ai_api_costs: number;
  communication_costs: number;
  storage_costs: number;
  compute_costs: number;
  third_party_costs: number;
  total_costs: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceUsage {
  id: string;
  tenant_id: string;
  service_type: string;
  usage_date: string;
  usage_count: number;
  usage_volume: number;
  unit_cost: number;
  total_cost: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface TenantRevenue {
  id: string;
  tenant_id: string;
  revenue_period_start: string;
  revenue_period_end: string;
  subscription_revenue: number;
  usage_revenue: number;
  setup_fees: number;
  other_revenue: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
}

export interface TenantMargins {
  id: string;
  tenant_id: string;
  analysis_period_start: string;
  analysis_period_end: string;
  total_revenue: number;
  total_costs: number;
  gross_margin: number;
  margin_percentage: number;
  customer_acquisition_cost: number;
  lifetime_value: number;
  churn_risk_score: number;
  profitability_status: 'highly_profitable' | 'profitable' | 'break_even' | 'unprofitable';
  created_at: string;
  updated_at: string;
}

export interface FeatureUsageAnalytics {
  id: string;
  tenant_id: string;
  feature_name: string;
  usage_date: string;
  usage_count: number;
  active_users: number;
  session_duration_minutes: number;
  success_rate: number;
  error_count: number;
  performance_score: number;
  created_at: string;
}

export interface CostOptimizationRecommendation {
  id: string;
  tenant_id: string;
  recommendation_type: string;
  title: string;
  description: string;
  potential_savings: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'implementing' | 'completed' | 'dismissed';
  implementation_effort: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface PlatformFinancialReport {
  id: string;
  report_type: string;
  report_period_start: string;
  report_period_end: string;
  report_data: Record<string, any>;
  generated_at: string;
  generated_by?: string;
}

export interface MarginAnalysisData {
  tenantName: string;
  totalRevenue: number;
  totalCosts: number;
  grossMargin: number;
  marginPercentage: number;
  profitabilityStatus: string;
  churnRiskScore: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CostBreakdownData {
  category: string;
  amount: number;
  percentage: number;
  trend: number;
}

export interface FeatureROIData {
  featureName: string;
  usage: number;
  revenue: number;
  cost: number;
  roi: number;
  activeUsers: number;
}