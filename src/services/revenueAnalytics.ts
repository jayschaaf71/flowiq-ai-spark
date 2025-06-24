
import { supabase } from "@/integrations/supabase/client";

export interface RevenueMetrics {
  totalCollected: number;
  totalBilled: number;
  collectionRate: number;
  averageDaysInAR: number;
  denialRate: number;
  netCollectionRate: number;
  workingDaysInAR: number;
  grossCollectionRate: number;
}

export interface RevenueByProvider {
  providerId: string;
  providerName: string;
  totalBilled: number;
  totalCollected: number;
  collectionRate: number;
  averageDaysInAR: number;
}

export interface RevenueByPayer {
  payerId: string;
  payerName: string;
  totalBilled: number;
  totalCollected: number;
  collectionRate: number;
  averagePaymentDays: number;
  denialRate: number;
}

export interface RevenueTrend {
  period: string;
  billed: number;
  collected: number;
  denials: number;
  adjustments: number;
}

export interface RevenueKPI {
  name: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  variance: number;
  format: 'currency' | 'percentage' | 'days' | 'number';
}

export interface RevenueForecast {
  period: string;
  projectedRevenue: number;
  confidence: number;
  factors: string[];
}

class RevenueAnalyticsService {
  // Get comprehensive revenue metrics
  async getRevenueMetrics(dateRange: { start: string; end: string }): Promise<RevenueMetrics> {
    try {
      console.log('Fetching revenue metrics for:', dateRange);

      // Get claims data
      const { data: claims, error: claimsError } = await supabase
        .from('claims')
        .select('*')
        .gte('service_date', dateRange.start)
        .lte('service_date', dateRange.end);

      if (claimsError) throw claimsError;

      // Get payment data (mock for now)
      const payments = await this.getPaymentData(dateRange);
      
      // Calculate metrics
      const totalBilled = claims?.reduce((sum, claim) => sum + parseFloat(claim.total_amount.toString()), 0) || 0;
      const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalDenials = claims?.filter(c => c.status === 'denied').length || 0;
      
      const collectionRate = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;
      const denialRate = claims?.length ? (totalDenials / claims.length) * 100 : 0;
      
      // Calculate average days in A/R
      const averageDaysInAR = claims?.reduce((sum, claim) => {
        return sum + (claim.days_in_ar || 0);
      }, 0) / (claims?.length || 1);

      return {
        totalCollected,
        totalBilled,
        collectionRate,
        averageDaysInAR,
        denialRate,
        netCollectionRate: collectionRate * 0.95, // Accounting for adjustments
        workingDaysInAR: averageDaysInAR * 0.7, // Excluding weekends
        grossCollectionRate: collectionRate * 1.05 // Including all adjustments
      };

    } catch (error) {
      console.error('Error fetching revenue metrics:', error);
      throw error;
    }
  }

  // Get revenue performance by provider
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

  // Get revenue performance by payer
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

  // Get revenue trends over time
  async getRevenueTrends(dateRange: { start: string; end: string }): Promise<RevenueTrend[]> {
    const { data: claims, error } = await supabase
      .from('claims')
      .select('*')
      .gte('service_date', dateRange.start)
      .lte('service_date', dateRange.end)
      .order('service_date');

    if (error) throw error;

    // Group by month
    const monthlyData = (claims || []).reduce((acc, claim) => {
      const month = claim.service_date.slice(0, 7); // YYYY-MM
      
      if (!acc[month]) {
        acc[month] = {
          period: month,
          billed: 0,
          collected: 0,
          denials: 0,
          adjustments: 0
        };
      }
      
      acc[month].billed += parseFloat(claim.total_amount.toString());
      acc[month].collected += parseFloat(claim.patient_amount?.toString() || '0') + 
                             parseFloat(claim.insurance_amount?.toString() || '0');
      
      if (claim.status === 'denied') {
        acc[month].denials += parseFloat(claim.total_amount.toString());
      }
      
      return acc;
    }, {} as Record<string, RevenueTrend>);

    return Object.values(monthlyData).sort((a, b) => a.period.localeCompare(b.period));
  }

  // Get key performance indicators
  async getRevenueKPIs(dateRange: { start: string; end: string }): Promise<RevenueKPI[]> {
    const metrics = await this.getRevenueMetrics(dateRange);
    
    // Define targets and calculate variances
    const kpis: RevenueKPI[] = [
      {
        name: 'Collection Rate',
        current: metrics.collectionRate,
        target: 95,
        trend: metrics.collectionRate >= 95 ? 'up' : 'down',
        variance: metrics.collectionRate - 95,
        format: 'percentage'
      },
      {
        name: 'Days in A/R',
        current: metrics.averageDaysInAR,
        target: 30,
        trend: metrics.averageDaysInAR <= 30 ? 'up' : 'down',
        variance: 30 - metrics.averageDaysInAR,
        format: 'days'
      },
      {
        name: 'Denial Rate',
        current: metrics.denialRate,
        target: 5,
        trend: metrics.denialRate <= 5 ? 'up' : 'down',
        variance: 5 - metrics.denialRate,
        format: 'percentage'
      },
      {
        name: 'Net Collection Rate',
        current: metrics.netCollectionRate,
        target: 98,
        trend: metrics.netCollectionRate >= 98 ? 'up' : 'down',
        variance: metrics.netCollectionRate - 98,
        format: 'percentage'
      }
    ];

    return kpis;
  }

  // Generate revenue forecast
  async getRevenueForecast(periods: number = 6): Promise<RevenueForecast[]> {
    const forecasts: RevenueForecast[] = [];
    
    // Simple trend-based forecasting (in production would use ML)
    const baseRevenue = 45000; // Monthly baseline
    
    for (let i = 1; i <= periods; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      
      const seasonalMultiplier = this.getSeasonalMultiplier(date.getMonth());
      const trendMultiplier = 1 + (i * 0.02); // 2% growth per month
      
      const projectedRevenue = baseRevenue * seasonalMultiplier * trendMultiplier;
      const confidence = Math.max(60, 95 - (i * 5)); // Decreasing confidence over time
      
      forecasts.push({
        period: date.toISOString().slice(0, 7),
        projectedRevenue,
        confidence,
        factors: [
          'Historical trends',
          'Seasonal patterns',
          'Payer mix changes',
          'Provider productivity'
        ]
      });
    }
    
    return forecasts;
  }

  // Private helper methods
  private async getPaymentData(dateRange: { start: string; end: string }) {
    // Mock payment data - in production would come from payment posting
    return [
      { date: '2024-01-15', amount: 15000, type: 'insurance' },
      { date: '2024-01-16', amount: 8500, type: 'patient' },
      { date: '2024-01-17', amount: 12000, type: 'insurance' }
    ];
  }

  private getSeasonalMultiplier(month: number): number {
    // Seasonal adjustments for healthcare revenue
    const seasonalFactors: Record<number, number> = {
      0: 1.05, // January - high due to new deductibles
      1: 0.95, // February
      2: 1.0,  // March
      3: 1.0,  // April
      4: 0.98, // May
      5: 0.92, // June - summer slowdown
      6: 0.90, // July
      7: 0.88, // August
      8: 1.02, // September - back to school
      9: 1.05, // October
      10: 1.03, // November
      11: 0.85  // December - holidays
    };
    
    return seasonalFactors[month] || 1.0;
  }
}

export const revenueAnalyticsService = new RevenueAnalyticsService();
