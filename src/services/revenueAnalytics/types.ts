
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

export interface ProviderPerformanceData {
  providerId: string;
  providerName: string;
  totalBilled: number;
  totalCollected: number;
  collectionRate: number;
  averageDaysInAR: number;
  claimCount: number;
  denialRate: number;
}

export interface PayerPerformanceData {
  payerId: string;
  payerName: string;
  totalBilled: number;
  totalPaid: number;
  paymentRate: number;
  averagePaymentTime: number;
  claimCount: number;
  denialRate: number;
}

export interface RevenueData {
  period: string;
  billed: number;
  collected: number;
  denials: number;
  adjustments: number;
  netRevenue: number;
}

export interface ForecastData {
  period: string;
  predicted: number;
  confidence: number;
  upperBound: number;
  lowerBound: number;
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
