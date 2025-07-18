import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  TenantCosts, 
  TenantRevenue, 
  TenantMargins, 
  ServiceUsage,
  FeatureUsageAnalytics,
  CostOptimizationRecommendation,
  MarginAnalysisData,
  CostBreakdownData,
  FeatureROIData
} from '@/types/costAnalytics';

export const useCostAnalytics = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tenant costs
  const { data: tenantCosts = [], isLoading: costsLoading } = useQuery({
    queryKey: ['tenant-costs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenant_costs')
        .select('*')
        .order('cost_period_start', { ascending: false });
      if (error) throw error;
      return data as TenantCosts[];
    },
    refetchInterval: 300000, // 5 minutes
  });

  // Fetch tenant revenue
  const { data: tenantRevenue = [], isLoading: revenueLoading } = useQuery({
    queryKey: ['tenant-revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenant_revenue')
        .select('*')
        .order('revenue_period_start', { ascending: false });
      if (error) throw error;
      return data as TenantRevenue[];
    },
    refetchInterval: 300000,
  });

  // Fetch tenant margins
  const { data: tenantMargins = [], isLoading: marginsLoading } = useQuery({
    queryKey: ['tenant-margins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenant_margins')
        .select('*')
        .order('analysis_period_start', { ascending: false });
      if (error) throw error;
      return data as TenantMargins[];
    },
    refetchInterval: 300000,
  });

  // Fetch service usage
  const { data: serviceUsage = [], isLoading: usageLoading } = useQuery({
    queryKey: ['service-usage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_usage')
        .select('*')
        .order('usage_date', { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data as ServiceUsage[];
    },
    refetchInterval: 300000,
  });

  // Fetch feature analytics
  const { data: featureAnalytics = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ['feature-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_usage_analytics')
        .select('*')
        .order('usage_date', { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data as FeatureUsageAnalytics[];
    },
    refetchInterval: 300000,
  });

  // Fetch cost optimization recommendations
  const { data: recommendations = [], isLoading: recommendationsLoading } = useQuery({
    queryKey: ['cost-recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cost_optimization_recommendations')
        .select('*')
        .eq('status', 'active')
        .order('priority', { ascending: false });
      if (error) throw error;
      return data as CostOptimizationRecommendation[];
    },
    refetchInterval: 300000,
  });

  // Calculate margin analysis data
  const marginAnalysisData: MarginAnalysisData[] = tenantMargins.map(margin => {
    // Get tenant name from mock data - in real app, join with tenants table
    const tenantName = `Tenant ${margin.tenant_id.slice(-4)}`;
    
    return {
      tenantName,
      totalRevenue: margin.total_revenue,
      totalCosts: margin.total_costs,
      grossMargin: margin.gross_margin,
      marginPercentage: margin.margin_percentage,
      profitabilityStatus: margin.profitability_status,
      churnRiskScore: margin.churn_risk_score,
      trend: margin.margin_percentage >= 15 ? 'up' : margin.margin_percentage >= 5 ? 'stable' : 'down'
    };
  });

  // Calculate cost breakdown data
  const costBreakdownData: CostBreakdownData[] = tenantCosts.length > 0 
    ? [
        {
          category: 'Infrastructure',
          amount: tenantCosts.reduce((sum, cost) => sum + cost.infrastructure_costs, 0),
          percentage: 0,
          trend: 5.2
        },
        {
          category: 'AI/API',
          amount: tenantCosts.reduce((sum, cost) => sum + cost.ai_api_costs, 0),
          percentage: 0,
          trend: 12.8
        },
        {
          category: 'Communication',
          amount: tenantCosts.reduce((sum, cost) => sum + cost.communication_costs, 0),
          percentage: 0,
          trend: -2.1
        },
        {
          category: 'Storage',
          amount: tenantCosts.reduce((sum, cost) => sum + cost.storage_costs, 0),
          percentage: 0,
          trend: 8.7
        },
        {
          category: 'Compute',
          amount: tenantCosts.reduce((sum, cost) => sum + cost.compute_costs, 0),
          percentage: 0,
          trend: 3.4
        }
      ].map(item => {
        const total = tenantCosts.reduce((sum, cost) => sum + cost.total_costs, 0);
        return {
          ...item,
          percentage: total > 0 ? (item.amount / total) * 100 : 0
        };
      })
    : [];

  // Calculate feature ROI data
  const featureROIData: FeatureROIData[] = featureAnalytics
    .reduce((acc, analytics) => {
      const existing = acc.find(item => item.featureName === analytics.feature_name);
      if (existing) {
        existing.usage += analytics.usage_count;
        existing.activeUsers = Math.max(existing.activeUsers, analytics.active_users);
      } else {
        acc.push({
          featureName: analytics.feature_name,
          usage: analytics.usage_count,
          revenue: Math.random() * 10000 + 5000, // Mock revenue calculation
          cost: Math.random() * 2000 + 500, // Mock cost calculation
          roi: 0,
          activeUsers: analytics.active_users
        });
      }
      return acc;
    }, [] as FeatureROIData[])
    .map(item => ({
      ...item,
      roi: item.cost > 0 ? ((item.revenue - item.cost) / item.cost) * 100 : 0
    }));

  // Mutation to update recommendation status
  const updateRecommendationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('cost_optimization_recommendations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-recommendations'] });
      toast({
        title: "Recommendation Updated",
        description: "The recommendation status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update recommendation: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Generate sample data for development
  const generateSampleData = async () => {
    try {
      // Sample tenant IDs from existing tenants
      const { data: tenants } = await supabase.from('tenants').select('id').limit(5);
      if (!tenants || tenants.length === 0) return;

      const sampleCosts = tenants.map(tenant => ({
        tenant_id: tenant.id,
        cost_period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        cost_period_end: new Date().toISOString(),
        infrastructure_costs: Math.floor(Math.random() * 5000) + 1000,
        ai_api_costs: Math.floor(Math.random() * 3000) + 500,
        communication_costs: Math.floor(Math.random() * 1000) + 200,
        storage_costs: Math.floor(Math.random() * 800) + 100,
        compute_costs: Math.floor(Math.random() * 2000) + 300,
        third_party_costs: Math.floor(Math.random() * 1500) + 200,
      }));

      await supabase.from('tenant_costs').insert(sampleCosts);
      
      queryClient.invalidateQueries({ queryKey: ['tenant-costs'] });
      
      toast({
        title: "Sample Data Generated",
        description: "Sample cost analytics data has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to generate sample data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return {
    tenantCosts,
    tenantRevenue,
    tenantMargins,
    serviceUsage,
    featureAnalytics,
    recommendations,
    marginAnalysisData,
    costBreakdownData,
    featureROIData,
    isLoading: costsLoading || revenueLoading || marginsLoading || usageLoading || analyticsLoading || recommendationsLoading,
    updateRecommendation: updateRecommendationMutation.mutate,
    isUpdatingRecommendation: updateRecommendationMutation.isPending,
    generateSampleData,
  };
};