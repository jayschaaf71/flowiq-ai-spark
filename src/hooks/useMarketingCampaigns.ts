import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MarketingCampaign[];
    },
  });
};

export const useMarketingCampaign = (id: string) => {
  return useQuery({
    queryKey: ['marketing-campaign', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as MarketingCampaign;
    },
    enabled: !!id,
  });
};

export const useCampaignAnalytics = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-analytics', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_analytics')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('metric_date', { ascending: false });

      if (error) throw error;
      return data as CampaignAnalytics[];
    },
    enabled: !!campaignId,
  });
};

export const useCreateMarketingCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaign: Omit<MarketingCampaign, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert(campaign)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
      toast({
        title: 'Success',
        description: 'Marketing campaign created successfully',
      });
    },
    onError: (error) => {
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
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('marketing_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
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