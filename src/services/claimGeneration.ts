
import { supabase } from "@/integrations/supabase/client";
import { medicalCodingService, MedicalCode } from "./medicalCoding";
import { eligibilityService } from "./eligibilityVerification";

export interface ClaimGenerationRequest {
  patientId: string;
  providerId: string;
  serviceDate: string;
  clinicalNotes: string;
  diagnosis: string[];
  procedures: string[];
  specialty: string;
  insuranceProviderId?: string;
}

export interface GeneratedClaim {
  id: string;
  claimNumber: string;
  patientId: string;
  providerId: string;
  serviceDate: string;
  codes: MedicalCode[];
  totalAmount: number;
  status: 'draft' | 'ready_for_review' | 'ready_for_submission';
  confidence: number;
  validationErrors: string[];
  validationWarnings: string[];
}

class ClaimGenerationService {
  async generateClaim(request: ClaimGenerationRequest): Promise<GeneratedClaim> {
    try {
      console.log('Generating claim for patient:', request.patientId);

      // Step 1: Generate medical codes using AI
      const codingResponse = await medicalCodingService.generateCodes({
        clinicalNotes: request.clinicalNotes,
        procedureType: request.procedures[0] || 'consultation',
        diagnosis: request.diagnosis,
        specialty: request.specialty
      });

      // Step 2: Validate codes
      const validation = await medicalCodingService.validateCodes(
        codingResponse.codes,
        { patientId: request.patientId }
      );

      // Step 3: Calculate claim amount
      const totalAmount = this.calculateClaimAmount(codingResponse.codes);

      // Step 4: Determine claim status
      const status = this.determineClaimStatus(codingResponse, validation);

      // Step 5: Get or create default insurance provider
      const insuranceProviderId = request.insuranceProviderId || await this.getDefaultInsuranceProvider();

      // Step 6: Create claim record with correct field names
      const claimNumber = `CLM-${Date.now()}`;
      
      const { data: claim, error } = await supabase
        .from('claims')
        .insert({
          claim_number: claimNumber,
          patient_id: request.patientId,
          provider_id: request.providerId,
          insurance_provider_id: insuranceProviderId,
          service_date: request.serviceDate,
          total_amount: totalAmount,
          processing_status: status,
          ai_confidence_score: Math.round(codingResponse.overallConfidence * 100),
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: claim.id,
        claimNumber,
        patientId: request.patientId,
        providerId: request.providerId,
        serviceDate: request.serviceDate,
        codes: codingResponse.codes,
        totalAmount,
        status,
        confidence: codingResponse.overallConfidence,
        validationErrors: validation.errors,
        validationWarnings: validation.warnings
      };

    } catch (error) {
      console.error('Claim generation error:', error);
      throw error;
    }
  }

  private async getDefaultInsuranceProvider(): Promise<string> {
    // Try to get the first active insurance provider
    const { data: providers, error } = await supabase
      .from('insurance_providers')
      .select('id')
      .eq('is_active', true)
      .limit(1);

    if (error || !providers || providers.length === 0) {
      // Create a default insurance provider if none exists
      const { data: defaultProvider, error: createError } = await supabase
        .from('insurance_providers')
        .insert({
          name: 'Default Insurance',
          is_active: true
        })
        .select('id')
        .single();

      if (createError) throw createError;
      return defaultProvider.id;
    }

    return providers[0].id;
  }

  private calculateClaimAmount(codes: MedicalCode[]): number {
    // Simple fee calculation for MVP
    const feeSchedule: Record<string, number> = {
      '99213': 150.00,
      '99214': 200.00,
      'D1110': 120.00,
      '98940': 75.00
    };

    return codes.reduce((total, code) => {
      return total + (feeSchedule[code.code] || 100.00);
    }, 0);
  }

  private determineClaimStatus(
    codingResponse: any, 
    validation: any
  ): 'draft' | 'ready_for_review' | 'ready_for_submission' {
    if (validation.errors.length > 0) {
      return 'draft';
    }
    
    if (codingResponse.requiresReview || codingResponse.overallConfidence < 0.8) {
      return 'ready_for_review';
    }

    return 'ready_for_submission';
  }

  async batchGenerateClaims(requests: ClaimGenerationRequest[]): Promise<GeneratedClaim[]> {
    const results = await Promise.all(
      requests.map(request => this.generateClaim(request))
    );
    return results;
  }
}

export const claimGenerationService = new ClaimGenerationService();
