import { AvailityAuth } from '@/integrations/availity/auth';
import { X12Helper } from '@/integrations/availity/x12Helper';

interface EligibilityRequest {
  tenantId: string;
  patient: {
    memberId: string;
    dob: string;
    firstName: string;
    lastName: string;
  };
  payerCode: string;
  serviceDate: string;
}

interface EligibilityResponse {
  isEligible: boolean;
  coverageDetails: any;
  priorAuthRequired: boolean;
  effectiveDate: string;
  terminationDate?: string;
  errors: string[];
}

export class AvailityEligibilityService {
  static async checkEligibility(request: EligibilityRequest): Promise<EligibilityResponse> {
    try {
      const token = await AvailityAuth.getToken();
      
      // Generate 270 X12 transaction
      const x12_270 = X12Helper.generate270X12(request);
      
      const response = await fetch('https://api.availity.com/availity/v1/x12/eligibility', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x12'
        },
        body: x12_270
      });
      
      if (!response.ok) {
        throw new Error(`Eligibility check failed: ${response.statusText}`);
      }
      
      const x12_271 = await response.text();
      return X12Helper.parse271X12(x12_271);
      
    } catch (error) {
      console.error('Eligibility check error:', error);
      
      // Log error for retry logic
      if (error.message.includes('EDI_PARSE')) {
        // Don't retry parsing errors
        throw error;
      }
      
      // Retry network/API errors
      throw new Error(`API_ERROR: ${error.message}`);
    }
  }
}
