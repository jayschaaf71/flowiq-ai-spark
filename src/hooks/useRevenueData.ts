
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RevenueMetrics {
  total_collections: number;
  total_charges: number;
  collection_rate: number;
  denial_rate: number;
  average_days_in_ar: number;
  claims_submitted: number;
  claims_paid: number;
  claims_denied: number;
}

export interface PayerPerformance {
  payer_name: string;
  collection_rate: number;
  average_payment_days: number;
  total_collected: number;
}

export const useRevenueData = () => {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [payerPerformance, setPayerPerformance] = useState<PayerPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      
      // Fetch latest revenue metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('revenue_metrics')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(1)
        .single();

      if (metricsError && metricsError.code !== 'PGRST116') {
        throw metricsError;
      }

      // Fetch payer performance
      const { data: payerData, error: payerError } = await supabase
        .from('payer_performance')
        .select(`
          *,
          insurance_payers!inner(name)
        `)
        .order('total_collected', { ascending: false })
        .limit(10);

      if (payerError) throw payerError;

      setMetrics(metricsData || {
        total_collections: 127450,
        total_charges: 135000,
        collection_rate: 94.5,
        denial_rate: 3.1,
        average_days_in_ar: 16.8,
        claims_submitted: 156,
        claims_paid: 147,
        claims_denied: 5
      });

      const transformedPayerData = payerData?.map(payer => ({
        payer_name: payer.insurance_payers.name,
        collection_rate: payer.collection_rate || 0,
        average_payment_days: payer.average_payment_days || 0,
        total_collected: payer.total_collected || 0
      })) || [];

      setPayerPerformance(transformedPayerData);
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      toast({
        title: "Error fetching revenue data",
        description: "Using sample data",
        variant: "destructive"
      });
      
      // Fallback to sample data
      setMetrics({
        total_collections: 127450,
        total_charges: 135000,
        collection_rate: 94.5,
        denial_rate: 3.1,
        average_days_in_ar: 16.8,
        claims_submitted: 156,
        claims_paid: 147,
        claims_denied: 5
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  return {
    metrics,
    payerPerformance,
    loading,
    refetch: fetchRevenueData
  };
};
