import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MarketingMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpend: number;
  totalLeads: number;
  totalRevenue: number;
  conversionRate: number;
  avgCostPerLead: number;
  roi: number;
}

export interface LeadSourceStats {
  source_name: string;
  source_type: string;
  lead_count: number;
  conversion_rate: number;
  revenue: number;
}

export const useMarketingAnalytics = (dateRange?: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['marketing-analytics', dateRange],
    queryFn: async () => {
      // Get campaign analytics data
      let analyticsQuery = supabase
        .from('campaign_analytics')
        .select(`
          *,
          marketing_campaigns(name, campaign_type, status)
        `);

      if (dateRange) {
        analyticsQuery = analyticsQuery
          .gte('metric_date', dateRange.start)
          .lte('metric_date', dateRange.end);
      }

      const { data: analyticsData, error: analyticsError } = await analyticsQuery;
      if (analyticsError) throw analyticsError;

      // Get campaigns data
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('marketing_campaigns')
        .select('*');
      if (campaignsError) throw campaignsError;

      // Calculate metrics
      const totalCampaigns = campaignsData.length;
      const activeCampaigns = campaignsData.filter(c => c.status === 'active').length;
      
      const totals = analyticsData.reduce((acc, analytics) => ({
        spend: acc.spend + (analytics.spend_amount || 0),
        leads: acc.leads + (analytics.leads_generated || 0),
        revenue: acc.revenue + (analytics.revenue_generated || 0),
        conversions: acc.conversions + (analytics.conversions || 0),
        clicks: acc.clicks + (analytics.clicks || 0),
      }), { spend: 0, leads: 0, revenue: 0, conversions: 0, clicks: 0 });

      const conversionRate = totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0;
      const avgCostPerLead = totals.leads > 0 ? totals.spend / totals.leads : 0;
      const roi = totals.spend > 0 ? ((totals.revenue - totals.spend) / totals.spend) * 100 : 0;

      const metrics: MarketingMetrics = {
        totalCampaigns,
        activeCampaigns,
        totalSpend: totals.spend,
        totalLeads: totals.leads,
        totalRevenue: totals.revenue,
        conversionRate,
        avgCostPerLead,
        roi,
      };

      return {
        metrics,
        analytics: analyticsData,
        campaigns: campaignsData,
      };
    },
  });
};

export const useLeadSourceAnalytics = () => {
  return useQuery({
    queryKey: ['lead-source-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_sources')
        .select(`
          *,
          patients(id, lifetime_value)
        `);

      if (error) throw error;

      const leadSourceStats: LeadSourceStats[] = data.map(source => {
        const leads = source.patients || [];
        const leadCount = leads.length;
        const revenue = leads.reduce((sum: number, patient: any) => 
          sum + (patient.lifetime_value || 0), 0);
        
        // For now, assume all leads converted (in real app, you'd track this properly)
        const conversionRate = leadCount > 0 ? 85 : 0; // Mock conversion rate

        return {
          source_name: source.source_name,
          source_type: source.source_type,
          lead_count: leadCount,
          conversion_rate: conversionRate,
          revenue,
        };
      });

      return leadSourceStats;
    },
  });
};