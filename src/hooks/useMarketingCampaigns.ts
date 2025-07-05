import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface MarketingCampaign {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  campaign_type: 'email' | 'sms' | 'social_media' | 'google_ads' | 'facebook_ads' | 'mixed';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget_amount?: number;
  target_audience?: any;
  settings?: any;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignAnalytics {
  id: string;
  campaign_id: string;
  metric_date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend_amount: number;
  leads_generated: number;
  appointments_booked: number;
  revenue_generated: number;
  metadata?: any;
}

export const useMarketingCampaigns = () => {
  return useQuery({
    queryKey: ['marketing-campaigns'],
    queryFn: async () => {
      // Mock marketing campaigns data
      const mockCampaigns: MarketingCampaign[] = [
        {
          id: '1',
          tenant_id: 'default-chiro',
          name: 'Google Ads - Chiropractic Care',
          description: 'Targeted ads for chiropractic services',
          campaign_type: 'google_ads',
          status: 'active',
          start_date: '2024-01-01',
          budget_amount: 2000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          tenant_id: 'default-chiro',
          name: 'Facebook Ads - Back Pain Relief',
          description: 'Social media campaign for back pain treatment',
          campaign_type: 'facebook_ads',
          status: 'active',
          start_date: '2024-01-15',
          budget_amount: 1500,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      return mockCampaigns;
    },
  });
};

export const useMarketingCampaign = (id: string) => {
  return useQuery({
    queryKey: ['marketing-campaign', id],
    queryFn: async () => {
      // Mock single campaign data
      const mockCampaign: MarketingCampaign = {
        id,
        tenant_id: 'default-chiro',
        name: 'Google Ads - Chiropractic Care',
        description: 'Targeted ads for chiropractic services',
        campaign_type: 'google_ads',
        status: 'active',
        start_date: '2024-01-01',
        budget_amount: 2000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockCampaign;
    },
    enabled: !!id,
  });
};

export const useCampaignAnalytics = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-analytics', campaignId],
    queryFn: async () => {
      // Mock analytics data
      const mockAnalytics: CampaignAnalytics[] = [
        {
          id: '1',
          campaign_id: campaignId,
          metric_date: '2024-01-15',
          impressions: 1500,
          clicks: 125,
          conversions: 15,
          spend_amount: 250,
          leads_generated: 15,
          appointments_booked: 8,
          revenue_generated: 1200
        }
      ];
      return mockAnalytics;
    },
    enabled: !!campaignId,
  });
};

export const useCreateMarketingCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaign: Omit<MarketingCampaign, 'id' | 'created_at' | 'updated_at'>) => {
      // Mock campaign creation
      const newCampaign: MarketingCampaign = {
        ...campaign,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return newCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
      toast({
        title: 'Success',
        description: 'Marketing campaign created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create marketing campaign',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateMarketingCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MarketingCampaign> & { id: string }) => {
      // Mock campaign update
      console.log('Updating campaign:', id, updates);
      return { id, ...updates, updated_at: new Date().toISOString() };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['marketing-campaign', data.id] });
      toast({
        title: 'Success',
        description: 'Marketing campaign updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update marketing campaign',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteMarketingCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Mock campaign deletion
      console.log('Deleting campaign:', id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
      toast({
        title: 'Success',
        description: 'Marketing campaign deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete marketing campaign',
        variant: 'destructive',
      });
    },
  });
};