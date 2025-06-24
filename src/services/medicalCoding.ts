
import { supabase } from "@/integrations/supabase/client";

export interface MedicalCode {
  code: string;
  codeType: 'CPT' | 'ICD-10-CM' | 'HCPCS';
  description: string;
  confidence: number;
  modifiers?: string[];
}

export interface CodingRequest {
  clinicalNotes: string;
  procedureType: string;
  diagnosis: string[];
  specialty: string;
}

export interface CodingResponse {
  codes: MedicalCode[];
  overallConfidence: number;
  suggestions: string[];
  requiresReview: boolean;
}

class MedicalCodingService {
  // AI-powered medical coding using OpenAI
  async generateCodes(request: CodingRequest): Promise<CodingResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-medical-coding', {
        body: {
          clinicalNotes: request.clinicalNotes,
          procedureType: request.procedureType,
          diagnosis: request.diagnosis,
          specialty: request.specialty
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Medical coding error:', error);
      // Fallback to rule-based coding
      return this.fallbackCoding(request);
    }
  }

  private async fallbackCoding(request: CodingRequest): Promise<CodingResponse> {
    // Simple rule-based fallback for MVP
    const commonCodes: Record<string, MedicalCode[]> = {
      'consultation': [
        { code: '99213', codeType: 'CPT', description: 'Office visit - established patient', confidence: 0.85 }
      ],
      'cleaning': [
        { code: 'D1110', codeType: 'CPT', description: 'Adult prophylaxis', confidence: 0.90 }
      ],
      'adjustment': [
        { code: '98940', codeType: 'CPT', description: 'Chiropractic manipulative treatment', confidence: 0.88 }
      ]
    };

    const codes = commonCodes[request.procedureType.toLowerCase()] || [];
    const overallConfidence = codes.reduce((acc, code) => acc + code.confidence, 0) / codes.length || 0;

    return {
      codes,
      overallConfidence,
      suggestions: overallConfidence < 0.8 ? ['Consider manual review for accuracy'] : [],
      requiresReview: overallConfidence < 0.8
    };
  }

  // Validate codes against billing rules
  async validateCodes(codes: MedicalCode[], patientInfo: any): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation rules
    codes.forEach(code => {
      if (code.confidence < 0.7) {
        warnings.push(`Low confidence for code ${code.code}: ${code.confidence}`);
      }
      
      if (!code.code || code.code.length < 3) {
        errors.push(`Invalid code format: ${code.code}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

export const medicalCodingService = new MedicalCodingService();
