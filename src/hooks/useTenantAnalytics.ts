
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TenantUsageMetrics {
  tenant_id: string;
  tenant_name: string;
  user_count: number;
  storage_usage: number;
  api_calls: number;
  last_activity: string;
}

interface TenantGrowthData {
  month: string;
  tenant_count: number;
  revenue: number;
}

export const useTenantAnalytics = () => {
  const { user } = useAuth();

  // Fetch tenant usage metrics
  const { data: usageMetrics, isLoading: usageLoading } = useQuery({
    queryKey: ['tenant-usage-metrics', user?.id],
    queryFn: async () => {
      console.log('Fetching tenant usage metrics...');
      
      // This would be a more complex query in a real implementation
      // For now, we'll return mock data based on actual tenants
      const { data: tenants, error } = await supabase
        .from('tenants')
        .select('id, name, brand_name')
        .eq('is_active', true);

      if (error) throw error;

      // Generate mock usage data
      const mockUsageMetrics: TenantUsageMetrics[] = (tenants || []).map(tenant => ({
        tenant_id: tenant.id,
        tenant_name: tenant.brand_name || tenant.name,
        user_count: Math.floor(Math.random() * 20) + 5,
        storage_usage: Math.round((Math.random() * 4 + 1) * 100) / 100,
        api_calls: Math.floor(Math.random() * 15000) + 5000,
        last_activity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));

      return mockUsageMetrics;
    },
    enabled: !!user?.id,
  });

  // Fetch tenant growth data
  const { data: growthData, isLoading: growthLoading } = useQuery({
    queryKey: ['tenant-growth-data', user?.id],
    queryFn: async () => {
      console.log('Fetching tenant growth data...');
      
      // In a real implementation, this would aggregate historical data
      const mockGrowthData: TenantGrowthData[] = [
        { month: 'Jan', tenant_count: 15, revenue: 25000 },
        { month: 'Feb', tenant_count: 18, revenue: 28500 },
        { month: 'Mar', tenant_count: 22, revenue: 35200 },
        { month: 'Apr', tenant_count: 28, revenue: 42800 },
        { month: 'May', tenant_count: 35, revenue: 52500 },
        { month: 'Jun', tenant_count: 42, revenue: 63000 }
      ];

      return mockGrowthData;
    },
    enabled: !!user?.id,
  });

  // Calculate analytics summary
  const getAnalyticsSummary = () => {
    if (!usageMetrics) return null;

    const totalUsers = usageMetrics.reduce((sum, tenant) => sum + tenant.user_count, 0);
    const totalStorage = usageMetrics.reduce((sum, tenant) => sum + tenant.storage_usage, 0);
    const totalApiCalls = usageMetrics.reduce((sum, tenant) => sum + tenant.api_calls, 0);
    const averageUsersPerTenant = Math.round((totalUsers / usageMetrics.length) * 10) / 10;

    return {
      totalTenants: usageMetrics.length,
      totalUsers,
      totalStorage: Math.round(totalStorage * 100) / 100,
      totalApiCalls,
      averageUsersPerTenant
    };
  };

  return {
    usageMetrics: usageMetrics || [],
    growthData: growthData || [],
    analyticsSummary: getAnalyticsSummary(),
    isLoading: usageLoading || growthLoading,
  };
};
