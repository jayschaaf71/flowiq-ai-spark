import { AvailityAuth } from '@/integrations/availity/auth';
import { X12Helper } from '@/integrations/availity/x12Helper';
import { supabase } from '@/integrations/supabase/client';

interface ClaimsRequest {
  tenantId: string;
  encounterId: string;
}

interface ClaimsResponse {
  transactionId: string;
  status: 'accepted' | 'rejected';
  errors?: string[];
}

export class AvailityClaimsService {
  static async submitClaim(request: ClaimsRequest): Promise<ClaimsResponse> {
    try {
      const token = await AvailityAuth.getToken();
      
      // Get encounter data and generate 837P
      const encounter = await this.getEncounterData(request.encounterId);
      const x12_837 = X12Helper.generate837PX12(encounter);
      
      const response = await fetch('https://api.availity.com/availity/v1/x12/claims', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x12'
        },
        body: x12_837
      });
      
      if (!response.ok) {
        throw new Error(`Claim submission failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Store transaction ID for tracking
      await this.storeTransactionId(request.encounterId, result.transactionId);
      
      return {
        transactionId: result.transactionId,
        status: result.status,
        errors: result.errors
      };
      
    } catch (error) {
      console.error('Claim submission error:', error);
      
      if (error.message.includes('EDI_PARSE')) {
        // Don't retry parsing errors
        throw error;
      }
      
      // Retry network/API errors
      throw new Error(`API_ERROR: ${error.message}`);
    }
  }
  
  private static async getEncounterData(encounterId: string) {
    // Get encounter data from database
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients (*),
        providers (*)
      `)
      .eq('id', encounterId)
      .single();
      
    if (error) throw error;
    return data;
  }
  
  private static async storeTransactionId(encounterId: string, transactionId: string) {
    // Store transaction ID in database for tracking
    const { error } = await supabase
      .from('claims')
      .update({ 
        transaction_id: transactionId,
        status: 'submitted',
        submitted_date: new Date().toISOString()
      })
      .eq('appointment_id', encounterId);
      
    if (error) throw error;
  }
}
