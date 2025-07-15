import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface MarketingCampaign {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  campaign_type: 'email' | 'sms' | 'social_media' | 'google_ads' | 'facebook_ads' | 'voice' | 'mixed';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget_amount?: number;
  target_audience?: {
    age_range?: string;
    location?: string;
    interests?: string[];
    lead_score_min?: number;
    conversion_likelihood_min?: number;
  };
  settings?: any;
  voice_config?: {
    vapi_assistant_id?: string;
    phone_number?: string;
    script_template?: string;
    max_calls_per_day?: number;
    call_window_start?: string;
    call_window_end?: string;
    retry_attempts?: number;
    retry_delay_hours?: number;
  };
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
      // Mock marketing campaigns data - enhanced with voice campaigns
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
          target_audience: {
            age_range: '30-65',
            location: 'Metropolitan area',
            interests: ['back pain', 'chiropractic'],
            lead_score_min: 60
          },
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
          target_audience: {
            age_range: '25-55',
            location: 'Local area',
            interests: ['wellness', 'pain relief'],
            lead_score_min: 50
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          tenant_id: 'default-chiro',
          name: 'Voice Outreach - Qualified Leads',
          description: 'AI-powered voice calls to high-scoring leads',
          campaign_type: 'voice',
          status: 'active',
          start_date: '2024-01-10',
          budget_amount: 800,
          target_audience: {
            age_range: '25-70',
            location: 'Service area',
            interests: ['consultation'],
            lead_score_min: 75,
            conversion_likelihood_min: 60
          },
          voice_config: {
            vapi_assistant_id: 'asst_qualified_leads_followup',
            phone_number: '+1234567890',
            script_template: 'qualified_lead_consultation',
            max_calls_per_day: 25,
            call_window_start: '09:00',
            call_window_end: '17:00',
            retry_attempts: 2,
            retry_delay_hours: 24
          },
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