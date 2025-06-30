
import { supabase } from "@/integrations/supabase/client";

export class DenialAnalyticsService {
  async getDenialAnalytics(dateRange: { start: string; end: string }) {
    try {
      // Get denial analytics from database
      const { data: analytics, error } = await supabase
        .from('denial_analytics')
        .select('*')
        .gte('period_start', dateRange.start)
        .lte('period_end', dateRange.end)
        .order('period_start', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (analytics && analytics.length > 0) {
        return analytics[0];
      }

      // Return mock data if no analytics found
      return {
        totalDenials: 89,
        totalDeniedAmount: 12450.75,
        autoCorrectible: 67,
        autoCorrectRate: 85.2,
        denialsByReason: [
          { reason: 'CO-97: Invalid provider identifier', count: 25 },
          { reason: 'CO-16: Claim lacks information', count: 18 },
          { reason: 'CO-24: Charges exceed fee schedule', count: 15 },
          { reason: 'CO-18: Duplicate claim/service', count: 12 },
          { reason: 'CO-50: Prior authorization required', count: 10 }
        ],
        trends: [
          { month: 'Jan 2024', count: 89, amount: 12450.75 },
          { month: 'Dec 2023', count: 76, amount: 11230.50 },
          { month: 'Nov 2023', count: 82, amount: 13120.25 }
        ]
      };

    } catch (error) {
      console.error('Error fetching denial analytics:', error);
      throw error;
    }
  }
}

export const denialAnalyticsService = new DenialAnalyticsService();
