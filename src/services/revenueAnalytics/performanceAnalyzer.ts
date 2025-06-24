
import { supabase } from "@/integrations/supabase/client";
import { RevenueByProvider, RevenueByPayer } from './types';

export class PerformanceAnalyzerService {
  async getRevenueByProvider(dateRange: { start: string; end: string }): Promise<RevenueByProvider[]> {
    const { data: claims, error } = await supabase
      .from('claims')
      .select(`
        *,
        providers!inner(id, first_name, last_name)
      `)
      .gte('service_date', dateRange.start)
      .lte('service_date', dateRange.end);

    if (error) throw error;

    // Group by provider
    const providerData = (claims || []).reduce((acc, claim) => {
      const providerId = claim.provider_id;
      const providerName = `${claim.providers.first_name} ${claim.providers.last_name}`;
      
      if (!acc[providerId]) {
        acc[providerId] = {
          providerId,
          providerName,
          totalBilled: 0,
          totalCollected: 0,
          claimsCount: 0,
          totalDaysInAR: 0
        };
      }
      
      acc[providerId].totalBilled += parseFloat(claim.total_amount.toString());
      acc[providerId].totalCollected += parseFloat(claim.patient_amount?.toString() || '0');
      acc[providerId].claimsCount++;
      acc[providerId].totalDaysInAR += (claim.days_in_ar || 0);
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(providerData).map((provider: any) => ({
      providerId: provider.providerId,
      providerName: provider.providerName,
      totalBilled: provider.totalBilled,
      totalCollected: provider.totalCollected,
      collectionRate: provider.totalBilled > 0 ? (provider.totalCollected / provider.totalBilled) * 100 : 0,
      averageDaysInAR: provider.claimsCount > 0 ? provider.totalDaysInAR / provider.claimsCount : 0
    }));
  }

  async getRevenueByPayer(dateRange: { start: string; end: string }): Promise<RevenueByPayer[]> {
    const { data: claims, error } = await supabase
      .from('claims')
      .select(`
        *,
        insurance_providers!inner(id, name)
      `)
      .gte('service_date', dateRange.start)
      .lte('service_date', dateRange.end);

    if (error) throw error;

    // Group by payer
    const payerData = (claims || []).reduce((acc, claim) => {
      const payerId = claim.insurance_provider_id;
      const payerName = claim.insurance_providers.name;
      
      if (!acc[payerId]) {
        acc[payerId] = {
          payerId,
          payerName,
          totalBilled: 0,
          totalCollected: 0,
          claimsCount: 0,
          deniedCount: 0,
          totalDaysInAR: 0
        };
      }
      
      acc[payerId].totalBilled += parseFloat(claim.total_amount.toString());
      acc[payerId].totalCollected += parseFloat(claim.insurance_amount?.toString() || '0');
      acc[payerId].claimsCount++;
      acc[payerId].totalDaysInAR += (claim.days_in_ar || 0);
      
      if (claim.status === 'denied') {
        acc[payerId].deniedCount++;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(payerData).map((payer: any) => ({
      payerId: payer.payerId,
      payerName: payer.payerName,
      totalBilled: payer.totalBilled,
      totalCollected: payer.totalCollected,
      collectionRate: payer.totalBilled > 0 ? (payer.totalCollected / payer.totalBilled) * 100 : 0,
      averagePaymentDays: payer.claimsCount > 0 ? payer.totalDaysInAR / payer.claimsCount : 0,
      denialRate: payer.claimsCount > 0 ? (payer.deniedCount / payer.claimsCount) * 100 : 0
    }));
  }
}

export const performanceAnalyzerService = new PerformanceAnalyzerService();
