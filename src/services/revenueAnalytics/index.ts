
import { metricsCalculatorService } from './metricsCalculator';
import { performanceAnalyzerService } from './performanceAnalyzer';
import { trendAnalyzerService } from './trendAnalyzer';

// Re-export types for backward compatibility
export * from './types';

class RevenueAnalyticsService {
  // Get comprehensive revenue metrics
  async getRevenueMetrics(dateRange: { start: string; end: string }) {
    return metricsCalculatorService.getRevenueMetrics(dateRange);
  }

  // Get revenue performance by provider
  async getRevenueByProvider(dateRange: { start: string; end: string }) {
    return performanceAnalyzerService.getRevenueByProvider(dateRange);
  }

  // Get revenue performance by payer
  async getRevenueByPayer(dateRange: { start: string; end: string }) {
    return performanceAnalyzerService.getRevenueByPayer(dateRange);
  }

  // Get revenue trends over time
  async getRevenueTrends(dateRange: { start: string; end: string }) {
    return trendAnalyzerService.getRevenueTrends(dateRange);
  }

  // Get key performance indicators
  async getRevenueKPIs(dateRange: { start: string; end: string }) {
    return trendAnalyzerService.getRevenueKPIs(dateRange);
  }

  // Generate revenue forecast
  async getRevenueForecast(periods: number = 6) {
    return trendAnalyzerService.getRevenueForecast(periods);
  }
}

export const revenueAnalyticsService = new RevenueAnalyticsService();
