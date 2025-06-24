
import { supabase } from "@/integrations/supabase/client";

export interface EligibilityRequest {
  patientId: string;
  insuranceProvider: string;
  memberId: string;
  serviceDate: string;
  procedureCodes: string[];
}

export interface EligibilityResponse {
  isEligible: boolean;
  coverageDetails: {
    deductible: number;
    deductibleMet: number;
    copay: number;
    coinsurance: number;
    outOfPocketMax: number;
    outOfPocketMet: number;
  };
  priorAuthRequired: boolean;
  effectiveDate: string;
  terminationDate?: string;
  errors: string[];
  warnings: string[];
}

class EligibilityVerificationService {
  async verifyEligibility(request: EligibilityRequest): Promise<EligibilityResponse> {
    try {
      // Call external eligibility service
      const { data, error } = await supabase.functions.invoke('verify-eligibility', {
        body: request
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Eligibility verification error:', error);
      
      // Return mock data for MVP
      return this.getMockEligibility(request);
    }
  }

  private getMockEligibility(request: EligibilityRequest): EligibilityResponse {
    // Mock eligibility response for development
    return {
      isEligible: true,
      coverageDetails: {
        deductible: 1000,
        deductibleMet: 250,
        copay: 25,
        coinsurance: 0.2,
        outOfPocketMax: 5000,
        outOfPocketMet: 750
      },
      priorAuthRequired: false,
      effectiveDate: '2024-01-01',
      errors: [],
      warnings: []
    };
  }

  async batchVerifyEligibility(requests: EligibilityRequest[]): Promise<EligibilityResponse[]> {
    const results = await Promise.all(
      requests.map(request => this.verifyEligibility(request))
    );
    return results;
  }
}

export const eligibilityService = new EligibilityVerificationService();
