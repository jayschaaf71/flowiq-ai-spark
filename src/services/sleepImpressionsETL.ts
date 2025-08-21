// Note: Avoid creating a Supabase client with service-role on the client.

export interface ETLStats {
  totalRecords: number;
  patientVisits: number;
  billingRecords: number;
  claimsRecords: number;
  insuranceRecords: number;
  lastProcessed: string;
  status: 'processing' | 'completed' | 'error';
}

export interface PatientData {
  id: string;
  patientName: string;
  visitDate: string;
  insurance: string;
  stage: string;
  claimAmount?: number;
  email?: string;
  phone?: string;
}

export interface ClaimsData {
  id: string;
  patientName: string;
  claimNumber: string;
  claimDate: string;
  totalCharge: number;
  status: string;
  payer: string;
  denialCode?: string;
}

export class SleepImpressionsETLService {
  private static instance: SleepImpressionsETLService;

  public static getInstance(): SleepImpressionsETLService {
    if (!SleepImpressionsETLService.instance) {
      SleepImpressionsETLService.instance = new SleepImpressionsETLService();
    }
    return SleepImpressionsETLService.instance;
  }

  async getETLStats(): Promise<ETLStats> {
    const res = await fetch('/api/sleep-impressions/stats');
    if (!res.ok) throw new Error('Failed to fetch ETL stats');
    const data = await res.json();
    return {
      totalRecords: data.totalRecords || 0,
      patientVisits: data.patientVisits || 0,
      billingRecords: data.billingRecords || 0,
      claimsRecords: data.claimsRecords || 0,
      insuranceRecords: data.insuranceRecords || 0,
      lastProcessed: data.lastProcessed || new Date().toISOString(),
      status: data.status || 'completed'
    };
  }

  async getRecentPatients(limit: number = 10): Promise<PatientData[]> {
    const res = await fetch(`/api/sleep-impressions/recent-patients?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch recent patients');
    return await res.json();
  }

  async getClaimsData(limit: number = 10): Promise<ClaimsData[]> {
    const res = await fetch(`/api/sleep-impressions/claims?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch claims');
    return await res.json();
  }

  async getRevenueInsights() {
    const res = await fetch('/api/sleep-impressions/revenue');
    if (!res.ok) throw new Error('Failed to fetch revenue insights');
    return await res.json();
  }

  async triggerETLProcess(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/sleep-impressions/trigger', { method: 'POST' });
    if (!res.ok) {
      return { success: false, message: 'Failed to trigger ETL' };
    }
    return await res.json();
  }

  async getAutomationStatus() {
    return {
      claimsProcessing: { status: 'active', lastRun: new Date().toISOString() },
      patientSync: { status: 'active', lastRun: new Date().toISOString() },
      revenueTracking: { status: 'active', lastRun: new Date().toISOString() }
    };
  }

  // Integration with FlowIQ features
  async getPatientInsights(patientId: string) {
    // Route through a server API if needed in the future
    throw new Error('getPatientInsights is server-only and not available on the client');
  }

  async getRevenueAnalytics() {
    // Route through a server API if needed in the future
    throw new Error('getRevenueAnalytics is server-only and not available on the client');
  }
}

export const sleepImpressionsETL = SleepImpressionsETLService.getInstance();
