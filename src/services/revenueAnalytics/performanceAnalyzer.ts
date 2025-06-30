
import { supabase } from "@/integrations/supabase/client";
import { RevenueByProvider, RevenueByPayer } from './types';

export class PerformanceAnalyzerService {
  async getRevenueByProvider(dateRange: { start: string; end: string }): Promise<RevenueByProvider[]> {
    try {
      const { data: claims, error } = await supabase
        .from('claims')
        .select(`
          *,
          providers (
            id,
            first_name,
            last_name
          )
        `)
        .gte('service_date', dateRange.start)
        .lte('service_date', dateRange.end);

      if (error) throw error;

      // Group by provider and calculate metrics
      const providerMetrics = (claims || []).reduce((acc, claim) => {
        const providerId = claim.provider_id;
        const providerName = claim.providers 
          ? `${claim.providers.first_name} ${claim.providers.last_name}`
          : 'Unknown Provider';

        if (!acc[providerId]) {
          acc[providerId] = {
            providerId,
            providerName,
            totalBilled: 0,
            totalCollected: 0,
            claimCount: 0,
            daysInAR: []
          };
        }

        acc[providerId].totalBilled += parseFloat(claim.total_amount.toString());
        acc[providerId].totalCollected += parseFloat(claim.patient_amount?.toString() || '0') + 
                                         parseFloat(claim.insurance_amount?.toString() || '0');
        acc[providerId].claimCount++;
        acc[providerId].daysInAR.push(claim.days_in_ar || 0);

        return acc;
      }, {} as Record<string, any>);

      return Object.values(providerMetrics).map((provider: any) => ({
        providerId: provider.providerId,
        providerName: provider.providerName,
        totalBilled: provider.totalBilled,
        totalCollected: provider.totalCollected,
        collectionRate: provider.totalBilled > 0 ? (provider.totalCollected / provider.totalBilled) * 100 : 0,
        averageDaysInAR: provider.daysInAR.reduce((sum: number, days: number) => sum + days, 0) / provider.daysInAR.length
      }));

    } catch (error) {
      console.error('Error fetching provider revenue:', error);
      throw error;
    }
  }

  async getRevenueByPayer(dateRange: { start: string; end: string }): Promise<RevenueByPayer[]> {
    try {
      const { data: claims, error } = await supabase
        .from('claims')
        .select(`
          *,
          insurance_providers (
            id,
            name
          )
        `)
        .gte('service_date', dateRange.start)
        .lte('service_date', dateRange.end);

      if (error) throw error;

      // Group by payer and calculate metrics
      const payerMetrics = (claims || []).reduce((acc, claim) => {
        const payerId = claim.insurance_provider_id;
        const payerName = claim.insurance_providers?.name || 'Unknown Payer';

        if (!acc[payerId]) {
          acc[payerId] = {
            payerId,
            payerName,
            totalBilled: 0,
            totalCollected: 0,
            claimCount: 0,
            denialCount: 0,
            paymentDays: []
          };
        }

        acc[payerId].totalBilled += parseFloat(claim.total_amount.toString());
        acc[payerId].totalCollected += parseFloat(claim.insurance_amount?.toString() || '0');
        acc[payerId].claimCount++;
        
        if (claim.status === 'denied') {
          acc[payerId].denialCount++;
        }

        // Mock payment days calculation
        acc[payerId].paymentDays.push(Math.random() * 30 + 10);

        return acc;
      }, {} as Record<string, any>);

      return Object.values(payerMetrics).map((payer: any) => ({
        payerId: payer.payerId,
        payerName: payer.payerName,
        totalBilled: payer.totalBilled,
        totalCollected: payer.totalCollected,
        collectionRate: payer.totalBilled > 0 ? (payer.totalCollected / payer.totalBilled) * 100 : 0,
        averagePaymentDays: payer.paymentDays.reduce((sum: number, days: number) => sum + days, 0) / payer.paymentDays.length,
        denialRate: payer.claimCount > 0 ? (payer.denialCount / payer.claimCount) * 100 : 0
      }));

    } catch (error) {
      console.error('Error fetching payer revenue:', error);
      throw error;
    }
  }
}

export const performanceAnalyzerService = new PerformanceAnalyzerService();
