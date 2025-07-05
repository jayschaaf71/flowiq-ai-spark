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
      
      // Mock revenue data since tables don't exist
      console.log('Loading mock revenue data');

      // Try to calculate from existing claims data if available
      const { data: claimsData, error: claimsError } = await supabase
        .from('claims')
        .select('total_amount, status')
        .order('created_at', { ascending: false })
        .limit(100);

      let calculatedMetrics: RevenueMetrics;
      
      if (!claimsError && claimsData && claimsData.length > 0) {
        const totalCharges = claimsData.reduce((sum, claim) => sum + (claim.total_amount || 0), 0);
        const paidClaims = claimsData.filter(claim => claim.status === 'paid');
        const deniedClaims = claimsData.filter(claim => claim.status === 'denied');
        const totalCollections = paidClaims.reduce((sum, claim) => sum + (claim.total_amount || 0), 0);
        
        calculatedMetrics = {
          total_collections: totalCollections,
          total_charges: totalCharges,
          collection_rate: totalCharges > 0 ? (totalCollections / totalCharges) * 100 : 94.5,
          denial_rate: claimsData.length > 0 ? (deniedClaims.length / claimsData.length) * 100 : 3.1,
          average_days_in_ar: 16.8,
          claims_submitted: claimsData.length,
          claims_paid: paidClaims.length,
          claims_denied: deniedClaims.length
        };
      } else {
        // Fallback to mock data
        calculatedMetrics = {
          total_collections: 127450,
          total_charges: 135000,
          collection_rate: 94.5,
          denial_rate: 3.1,
          average_days_in_ar: 16.8,
          claims_submitted: 156,
          claims_paid: 147,
          claims_denied: 5
        };
      }

      // Mock payer performance data
      const calculatedPayerData: PayerPerformance[] = [
        { payer_name: 'Blue Cross Blue Shield', collection_rate: 96.2, average_payment_days: 14, total_collected: 45000 },
        { payer_name: 'Aetna', collection_rate: 94.8, average_payment_days: 18, total_collected: 32000 },
        { payer_name: 'Cigna', collection_rate: 92.1, average_payment_days: 22, total_collected: 28000 },
        { payer_name: 'United Healthcare', collection_rate: 93.5, average_payment_days: 16, total_collected: 22450 }
      ];

      setMetrics(calculatedMetrics);
      setPayerPerformance(calculatedPayerData);
      
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      toast({
        title: "Error fetching revenue data",
        description: "Using mock data",
        variant: "destructive"
      });
      
      // Fallback to mock data
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

      setPayerPerformance([
        { payer_name: 'Blue Cross Blue Shield', collection_rate: 96.2, average_payment_days: 14, total_collected: 45000 },
        { payer_name: 'Aetna', collection_rate: 94.8, average_payment_days: 18, total_collected: 32000 },
        { payer_name: 'Cigna', collection_rate: 92.1, average_payment_days: 22, total_collected: 28000 },
        { payer_name: 'United Healthcare', collection_rate: 93.5, average_payment_days: 16, total_collected: 22450 }
      ]);
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