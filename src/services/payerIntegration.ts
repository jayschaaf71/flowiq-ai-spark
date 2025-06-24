
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

class PayerIntegrationService {
  // Get all active payer connections
  async getPayerConnections(): Promise<PayerConnection[]> {
    const { data, error } = await supabase
      .from('payer_connections')
      .select('*')
      .eq('is_active', true)
      .order('payer_name');

    if (error) {
      console.error('Error fetching payer connections:', error);
      throw error;
    }

    return (data || []).map(this.mapPayerConnection);
  }

  // Get payer connection by ID
  async getPayerConnection(id: string): Promise<PayerConnection | null> {
    const { data, error } = await supabase
      .from('payer_connections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching payer connection:', error);
      return null;
    }

    return data ? this.mapPayerConnection(data) : null;
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

      // Create EDI transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('edi_transactions')
        .insert({
          claim_id: request.claimId,
          payer_connection_id: request.payerConnectionId,
          transaction_type: 'claim_submission',
          edi_format: 'X12_837',
          control_number: controlNumber,
          batch_id: request.batchId,
          edi_content: ediContent,
          status: 'submitted'
        })
        .select()
        .single();

      if (transactionError) {
        throw transactionError;
      }

      // Submit to payer (mock implementation)
      const submissionResult = await this.submitToPayerEndpoint(
        payerConnection,
        ediContent,
        controlNumber
      );

      // Update transaction with submission result
      await supabase
        .from('edi_transactions')
        .update({
          status: submissionResult.success ? 'submitted' : 'rejected',
          response_content: submissionResult.response,
          error_codes: submissionResult.errors
        })
        .eq('id', transaction.id);

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

  // Get EDI transaction status
  async getTransactionStatus(transactionId: string): Promise<EDITransaction | null> {
    const { data, error } = await supabase
      .from('edi_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }

    return data ? this.mapEDITransaction(data) : null;
  }

  // Get transactions for a claim
  async getClaimTransactions(claimId: string): Promise<EDITransaction[]> {
    const { data, error } = await supabase
      .from('edi_transactions')
      .select('*')
      .eq('claim_id', claimId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching claim transactions:', error);
      return [];
    }

    return (data || []).map(this.mapEDITransaction);
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

      // Update connection status
      await supabase
        .from('payer_connections')
        .update({
          last_sync_at: new Date().toISOString(),
          avg_response_time: responseTime / 1000
        })
        .eq('id', payerId);

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
    // In production, this would generate proper X12 837 format
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
    // Mock implementation - in production this would make actual HTTP requests
    // to payer endpoints or submit to clearinghouse
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% success rate for demo
        
        if (success) {
          resolve({
            success: true,
            response: `ACK: ${controlNumber} - Claim received and accepted for processing`
          });
        } else {
          resolve({
            success: false,
            response: `REJ: ${controlNumber} - Claim rejected`,
            errors: ['Invalid provider NPI', 'Missing required field']
          });
        }
      }, Math.random() * 3000 + 1000); // 1-4 second delay
    });
  }

  private async updatePayerStats(payerConnectionId: string, success: boolean): Promise<void> {
    const { data: currentStats } = await supabase
      .from('payer_connections')
      .select('claims_submitted, success_rate')
      .eq('id', payerConnectionId)
      .single();

    if (currentStats) {
      const newClaimsSubmitted = currentStats.claims_submitted + 1;
      const currentSuccessCount = Math.round((currentStats.success_rate / 100) * currentStats.claims_submitted);
      const newSuccessCount = currentSuccessCount + (success ? 1 : 0);
      const newSuccessRate = (newSuccessCount / newClaimsSubmitted) * 100;

      await supabase
        .from('payer_connections')
        .update({
          claims_submitted: newClaimsSubmitted,
          success_rate: newSuccessRate
        })
        .eq('id', payerConnectionId);
    }
  }
}

export const payerIntegrationService = new PayerIntegrationService();
