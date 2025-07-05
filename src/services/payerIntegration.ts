
import { supabase } from "@/integrations/supabase/client";

export interface PayerConnection {
  id: string;
  payerName: string;
  payerId: string;
  connectionType: 'edi' | 'api' | 'ftp';
  endpointUrl?: string;
  isActive: boolean;
  lastSyncAt?: string;
  successRate: number;
  avgResponseTime: number;
  claimsSubmitted: number;
  configuration: Record<string, any>;
}

export interface EDITransaction {
  id: string;
  claimId: string;
  payerConnectionId: string;
  transactionType: 'claim_submission' | 'eligibility' | 'status_inquiry';
  ediFormat: string;
  submissionDate: string;
  acknowledgmentDate?: string;
  responseDate?: string;
  status: 'pending' | 'submitted' | 'acknowledged' | 'processed' | 'rejected' | 'paid';
  controlNumber?: string;
  batchId?: string;
  ediContent?: string;
  responseContent?: string;
  errorCodes?: string[];
}

export interface ClaimSubmissionRequest {
  claimId: string;
  payerConnectionId: string;
  priority?: 'normal' | 'urgent';
  batchId?: string;
}

export interface ClaimSubmissionResponse {
  transactionId: string;
  controlNumber: string;
  status: 'submitted' | 'failed';
  submissionDate: string;
  errors?: string[];
}

export interface EligibilityRequest {
  patientId: string;
  payerConnectionId: string;
  serviceDate: string;
  procedureCodes: string[];
}

export interface EligibilityResponse {
  isEligible: boolean;
  coverageDetails: {
    deductible: number;
    deductibleMet: number;
    copayAmount?: number;
    coveragePercentage: number;
  };
  authorizationRequired: boolean;
  effectiveDate?: string;
  terminationDate?: string;
  errors?: string[];
}

class PayerIntegrationService {
  // Get all active payer connections
  async getPayerConnections(): Promise<PayerConnection[]> {
    console.log('Mock fetching payer connections');
    
    // Return mock data since payer_connections table doesn't exist
    return [
      {
        id: 'pc1',
        payerName: 'Aetna',
        payerId: 'AETNA001',
        connectionType: 'edi',
        endpointUrl: 'https://api.aetna.com/edi',
        isActive: true,
        lastSyncAt: new Date().toISOString(),
        successRate: 95.2,
        avgResponseTime: 2.3,
        claimsSubmitted: 1523,
        configuration: { timeout: 30000 }
      },
      {
        id: 'pc2',
        payerName: 'Blue Cross Blue Shield',
        payerId: 'BCBS001',
        connectionType: 'api',
        endpointUrl: 'https://api.bcbs.com/claims',
        isActive: true,
        lastSyncAt: new Date().toISOString(),
        successRate: 92.8,
        avgResponseTime: 1.8,
        claimsSubmitted: 2847,
        configuration: { apiKey: 'encrypted' }
      }
    ];
  }

  // Get payer connection by ID
  async getPayerConnection(id: string): Promise<PayerConnection | null> {
    console.log('Mock fetching payer connection:', id);
    
    const connections = await this.getPayerConnections();
    return connections.find(conn => conn.id === id) || null;
  }

  // Submit claim to payer
  async submitClaim(request: ClaimSubmissionRequest): Promise<ClaimSubmissionResponse> {
    try {
      console.log('Submitting claim to payer:', request);

      // Get payer connection details
      const payerConnection = await this.getPayerConnection(request.payerConnectionId);
      if (!payerConnection) {
        throw new Error('Payer connection not found');
      }

      // Get claim details
      const { data: claim, error: claimError } = await supabase
        .from('claims')
        .select(`
          *,
          patients!inner(first_name, last_name, date_of_birth),
          providers!inner(first_name, last_name, npi),
          insurance_providers!inner(name)
        `)
        .eq('id', request.claimId)
        .single();

      if (claimError || !claim) {
        throw new Error('Claim not found');
      }

      // Generate control number
      const controlNumber = this.generateControlNumber();
      
      // Create EDI content (simplified for demo)
      const ediContent = await this.generateEDIContent(claim, payerConnection);

      // Create EDI transaction record (mock)
      console.log('Mock creating EDI transaction for claim:', request.claimId);
      const transaction = {
        id: 'edi-' + Date.now(),
        claim_id: request.claimId,
        payer_connection_id: request.payerConnectionId,
        transaction_type: 'claim_submission',
        edi_format: 'X12_837',
        control_number: controlNumber,
        batch_id: request.batchId,
        edi_content: ediContent,
        status: 'submitted'
      };

      // Submit to payer (simulate API call)
      const submissionResult = await this.submitToPayerEndpoint(
        payerConnection,
        ediContent,
        controlNumber
      );

      // Mock update transaction with submission result
      console.log('Mock updating transaction status:', transaction.id, submissionResult.success ? 'submitted' : 'rejected');

      // Update claim status
      await supabase
        .from('claims')
        .update({
          status: 'submitted',
          submitted_date: new Date().toISOString().split('T')[0],
          processing_status: 'submitted'
        })
        .eq('id', request.claimId);

      // Update payer connection stats
      await this.updatePayerStats(request.payerConnectionId, submissionResult.success);

      return {
        transactionId: transaction.id,
        controlNumber,
        status: submissionResult.success ? 'submitted' : 'failed',
        submissionDate: new Date().toISOString(),
        errors: submissionResult.errors
      };

    } catch (error) {
      console.error('Claim submission error:', error);
      throw error;
    }
  }

  // Batch submit multiple claims
  async batchSubmitClaims(requests: ClaimSubmissionRequest[]): Promise<ClaimSubmissionResponse[]> {
    const batchId = `BATCH-${Date.now()}`;
    
    const results = await Promise.allSettled(
      requests.map(request => 
        this.submitClaim({ ...request, batchId })
      )
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          transactionId: '',
          controlNumber: '',
          status: 'failed' as const,
          submissionDate: new Date().toISOString(),
          errors: [result.reason?.message || 'Unknown error']
        };
      }
    });
  }

  // Check eligibility
  async checkEligibility(request: EligibilityRequest): Promise<EligibilityResponse> {
    const payerConnection = await this.getPayerConnection(request.payerConnectionId);
    if (!payerConnection) {
      throw new Error('Payer connection not found');
    }

    // Simulate eligibility check
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Mock eligibility response
    const isEligible = Math.random() > 0.1; // 90% eligible
    
    return {
      isEligible,
      coverageDetails: {
        deductible: 1000,
        deductibleMet: Math.floor(Math.random() * 800),
        copayAmount: isEligible ? 25 : undefined,
        coveragePercentage: isEligible ? 80 : 0
      },
      authorizationRequired: Math.random() > 0.7,
      effectiveDate: '2024-01-01',
      terminationDate: '2024-12-31',
      errors: isEligible ? [] : ['Patient not found in payer system']
    };
  }

  // Get EDI transaction status
  async getTransactionStatus(transactionId: string): Promise<EDITransaction | null> {
    console.log('Mock fetching transaction status:', transactionId);
    
    // Return mock transaction data
    return {
      id: transactionId,
      claimId: 'claim-123',
      payerConnectionId: 'pc1',
      transactionType: 'claim_submission',
      ediFormat: 'X12_837',
      submissionDate: new Date().toISOString(),
      status: 'submitted',
      controlNumber: 'CTL' + Date.now(),
      batchId: 'BATCH-001'
    };
  }

  // Get transactions for a claim
  async getClaimTransactions(claimId: string): Promise<EDITransaction[]> {
    console.log('Mock fetching claim transactions for:', claimId);
    
    // Return mock transaction data
    return [
      {
        id: 'edi-1',
        claimId,
        payerConnectionId: 'pc1',
        transactionType: 'claim_submission',
        ediFormat: 'X12_837',
        submissionDate: new Date().toISOString(),
        status: 'submitted',
        controlNumber: 'CTL' + Date.now()
      }
    ];
  }

  // Test payer connection
  async testConnection(payerId: string): Promise<{ success: boolean; message: string; responseTime?: number }> {
    const startTime = Date.now();
    
    try {
      const connection = await this.getPayerConnection(payerId);
      if (!connection) {
        return { success: false, message: 'Payer connection not found' };
      }

      // Mock connection test
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
      
      const responseTime = Date.now() - startTime;
      const success = Math.random() > 0.1; // 90% success rate for demo

      // Mock update connection status
      console.log('Mock updating payer connection stats:', payerId, responseTime);

      return {
        success,
        message: success ? 'Connection successful' : 'Connection failed - check configuration',
        responseTime
      };

    } catch (error) {
      return {
        success: false,
        message: `Connection test failed: ${error.message}`
      };
    }
  }

  // Real-time status polling
  async pollTransactionStatus(transactionId: string): Promise<EDITransaction | null> {
    const transaction = await this.getTransactionStatus(transactionId);
    if (!transaction) return null;

    // Simulate status progression
    if (transaction.status === 'submitted' && Math.random() > 0.7) {
      const newStatus = Math.random() > 0.5 ? 'acknowledged' : 'processed';
      
      // Mock update transaction status
      console.log('Mock updating transaction status:', transactionId, newStatus);

      return await this.getTransactionStatus(transactionId);
    }

    return transaction;
  }

  // Private helper methods
  private mapPayerConnection(data: any): PayerConnection {
    return {
      id: data.id,
      payerName: data.payer_name,
      payerId: data.payer_id,
      connectionType: data.connection_type,
      endpointUrl: data.endpoint_url,
      isActive: data.is_active,
      lastSyncAt: data.last_sync_at,
      successRate: parseFloat(data.success_rate.toString()),
      avgResponseTime: parseFloat(data.avg_response_time.toString()),
      claimsSubmitted: data.claims_submitted,
      configuration: data.configuration || {}
    };
  }

  private mapEDITransaction(data: any): EDITransaction {
    return {
      id: data.id,
      claimId: data.claim_id,
      payerConnectionId: data.payer_connection_id,
      transactionType: data.transaction_type,
      ediFormat: data.edi_format,
      submissionDate: data.submission_date,
      acknowledgmentDate: data.acknowledgment_date,
      responseDate: data.response_date,
      status: data.status,
      controlNumber: data.control_number,
      batchId: data.batch_id,
      ediContent: data.edi_content,
      responseContent: data.response_content,
      errorCodes: data.error_codes
    };
  }

  private generateControlNumber(): string {
    return `CTL${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  private async generateEDIContent(claim: any, payerConnection: PayerConnection): Promise<string> {
    // Simplified EDI generation for demo
    return `ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*${payerConnection.payerId}*${new Date().toISOString().slice(0, 6)}*${new Date().toTimeString().slice(0, 4)}*^*00501*${this.generateControlNumber()}*0*P*:~
GS*HC*SENDER_ID*${payerConnection.payerId}*${new Date().toISOString().slice(0, 8)}*${new Date().toTimeString().slice(0, 4)}*1*X*005010X222A1~
ST*837*0001*005010X222A1~
BHT*0019*00*${claim.claim_number}*${new Date().toISOString().slice(0, 8)}*${new Date().toTimeString().slice(0, 4)}*CH~
NM1*41*2*${claim.providers.first_name} ${claim.providers.last_name}*****46*${claim.providers.npi}~
PER*IC*CONTACT*TE*1234567890~
NM1*40*2*${claim.insurance_providers.name}~
HL*1**20*1~
NM1*85*2*${claim.providers.first_name} ${claim.providers.last_name}*****XX*${claim.providers.npi}~
HL*2*1*22*0~
SBR*P**${claim.insurance_providers.name}****CI~
NM1*IL*1*${claim.patients.last_name}*${claim.patients.first_name}~
DMG*D8*${claim.patients.date_of_birth.replace(/-/g, '')}~
CLM*${claim.claim_number}*${claim.total_amount}***11:B:1~
DTP*434*RD8*${claim.service_date.replace(/-/g, '')}~
SE*${Math.floor(Math.random() * 100) + 20}*0001~
GE*1*1~
IEA*1*${this.generateControlNumber()}~`;
  }

  private async submitToPayerEndpoint(
    payerConnection: PayerConnection,
    ediContent: string,
    controlNumber: string
  ): Promise<{ success: boolean; response: string; errors?: string[] }> {
    // Mock implementation - simulate real payer API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% success rate
        
        if (success) {
          resolve({
            success: true,
            response: `ACK: ${controlNumber} - Claim received and queued for processing`
          });
        } else {
          resolve({
            success: false,
            response: `REJ: ${controlNumber} - Claim rejected`,
            errors: ['Invalid provider NPI', 'Missing required diagnosis code']
          });
        }
      }, Math.random() * 3000 + 1000); // 1-4 second delay
    });
  }

  private async updatePayerStats(payerConnectionId: string, success: boolean): Promise<void> {
    console.log('Mock updating payer stats:', payerConnectionId, success);
    // Mock implementation since payer_connections table doesn't exist
  }
}

export const payerIntegrationService = new PayerIntegrationService();
