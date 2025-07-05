import { useQuery } from '@tanstack/react-query';

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
      // Mock marketing analytics data
      const mockMetrics: MarketingMetrics = {
        totalCampaigns: 12,
        activeCampaigns: 8,
        totalSpend: 15000,
        totalLeads: 245,
        totalRevenue: 48500,
        conversionRate: 12.5,
        avgCostPerLead: 61.22,
        roi: 223.3
      };

      const mockAnalytics = [
        {
          id: '1',
          campaign_id: 'camp-1',
          metric_date: '2024-01-15',
          spend_amount: 1500,
          leads_generated: 25,
          revenue_generated: 4850,
          conversions: 3,
          clicks: 245,
          marketing_campaigns: {
            name: 'Google Ads - Chiropractic',
            campaign_type: 'search',
            status: 'active'
          }
        }
      ];

      const mockCampaigns = [
        {
          id: 'camp-1',
          name: 'Google Ads - Chiropractic',
          campaign_type: 'search',
          status: 'active'
        }
      ];

      return {
        metrics: mockMetrics,
        analytics: mockAnalytics,
        campaigns: mockCampaigns,
      };
    },
  });
};

export const useLeadSourceAnalytics = () => {
  return useQuery({
    queryKey: ['lead-source-analytics'],
    queryFn: async () => {
      // Mock lead source analytics data
      const mockLeadSourceStats: LeadSourceStats[] = [
        {
          source_name: 'Google Ads',
          source_type: 'paid_search',
          lead_count: 45,
          conversion_rate: 12.5,
          revenue: 8500
        },
        {
          source_name: 'Facebook Ads',
          source_type: 'social_media',
          lead_count: 32,
          conversion_rate: 8.2,
          revenue: 6200
        },
        {
          source_name: 'Website Contact Form',
          source_type: 'organic',
          lead_count: 28,
          conversion_rate: 18.7,
          revenue: 5400
        }
      ];

      return mockLeadSourceStats;
    },
  });
};