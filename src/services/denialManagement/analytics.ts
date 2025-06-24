
import { supabase } from "@/integrations/supabase/client";
import { GroupedDenialData } from './types';

export class DenialAnalyticsService {
  async getDenialAnalytics(dateRange: { start: string; end: string }) {
    const { data: denials, error } = await supabase
      .from('claim_denials')
      .select(`
        *,
        claims!inner(total_amount, provider_id, service_date)
      `)
      .gte('denial_date', dateRange.start)
      .lte('denial_date', dateRange.end);

    if (error) throw error;

    // Calculate metrics
    const totalDenials = denials?.length || 0;
    const totalDeniedAmount = denials?.reduce((sum, d) => sum + parseFloat(d.denial_amount.toString()), 0) || 0;
    const autoCorrectible = denials?.filter(d => d.is_auto_correctable).length || 0;
    const autoCorrectSuccessful = denials?.filter(d => d.auto_correction_success).length || 0;

    // Group by denial reason
    const denialsByReason = this.groupDenialsByReason(denials || []);
    
    // Calculate trends
    const trends = this.calculateDenialTrends(denials || []);

    return {
      totalDenials,
      totalDeniedAmount,
      autoCorrectible,
      autoCorrectSuccessful,
      autoCorrectRate: autoCorrectible > 0 ? (autoCorrectSuccessful / autoCorrectible) * 100 : 0,
      denialsByReason,
      trends
    };
  }

  private groupDenialsByReason(denials: any[]) {
    const grouped = denials.reduce((acc, denial) => {
      const reason = denial.denial_reason || 'Unknown';
      if (!acc[reason]) {
        acc[reason] = { count: 0, amount: 0 };
      }
      acc[reason].count++;
      acc[reason].amount += parseFloat(denial.denial_amount.toString());
      return acc;
    }, {} as Record<string, GroupedDenialData>);

    return Object.entries(grouped).map(([reason, data]) => ({
      reason,
      count: (data as GroupedDenialData).count,
      amount: (data as GroupedDenialData).amount
    }));
  }

  private calculateDenialTrends(denials: any[]) {
    // Calculate month-over-month trends
    const monthlyData = denials.reduce((acc, denial) => {
      const month = new Date(denial.denial_date).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { count: 0, amount: 0 };
      }
      acc[month].count++;
      acc[month].amount += parseFloat(denial.denial_amount.toString());
      return acc;
    }, {} as Record<string, GroupedDenialData>);

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      count: (data as GroupedDenialData).count,
      amount: (data as GroupedDenialData).amount
    }));
  }
}

export const denialAnalyticsService = new DenialAnalyticsService();
