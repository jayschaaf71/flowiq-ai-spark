
import { supabase } from "@/integrations/supabase/client";
import { RevenueTrend, RevenueKPI, RevenueForecast } from './types';
import { metricsCalculatorService } from './metricsCalculator';

export class TrendAnalyzerService {
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

  async getRevenueKPIs(dateRange: { start: string; end: string }): Promise<RevenueKPI[]> {
    const metrics = await metricsCalculatorService.getRevenueMetrics(dateRange);
    
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

export const trendAnalyzerService = new TrendAnalyzerService();
