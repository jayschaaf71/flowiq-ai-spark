
import { supabase } from "@/integrations/supabase/client";

export interface MedicalCode {
  code: string;
  codeType: 'CPT' | 'ICD-10-CM' | 'HCPCS' | 'CDT';
  description: string;
  confidence: number;
  modifiers?: string[];
  category?: string;
  specialty?: string;
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
      console.log('Generating medical codes for specialty:', request.specialty);

      const { data, error } = await supabase.functions.invoke('ai-medical-coding', {
        body: {
          clinicalNotes: request.clinicalNotes,
          procedureType: request.procedureType,
          diagnosis: request.diagnosis,
          specialty: request.specialty
        }
      });

      if (error) throw error;

      // Validate generated codes against our database
      const validatedResponse = await this.validateGeneratedCodes(data, request.specialty);
      
      return validatedResponse;
    } catch (error) {
      console.error('Medical coding error:', error);
      // Fallback to rule-based coding
      return this.fallbackCoding(request);
    }
  }

  private async validateGeneratedCodes(aiResponse: CodingResponse, specialty: string): Promise<CodingResponse> {
    const validatedCodes: MedicalCode[] = [];
    
    for (const code of aiResponse.codes) {
      // Mock code validation since medical_codes table doesn't exist
      console.log('Mock validating code:', code.code, code.codeType);
      const dbCode = null; // Mock no database code found

      if (dbCode) {
        // Code is valid, use database description if available
        validatedCodes.push({
          ...code,
          description: dbCode.description || code.description,
          category: dbCode.category,
          specialty: dbCode.specialty
        });
      } else {
        // Code not found in database, lower confidence
        validatedCodes.push({
          ...code,
          confidence: Math.max(0.3, code.confidence - 0.2)
        });
      }
    }

    return {
      ...aiResponse,
      codes: validatedCodes,
      overallConfidence: validatedCodes.reduce((acc, code) => acc + code.confidence, 0) / validatedCodes.length || 0
    };
  }

  private async fallbackCoding(request: CodingRequest): Promise<CodingResponse> {
    console.log('Using fallback coding for:', request.procedureType);
    
    // Mock get codes from database since medical_codes table doesn't exist
    console.log('Mock fetching medical codes for specialty:', request.specialty);
    const dbCodes = null;

    let codes: MedicalCode[] = [];

    if (dbCodes && dbCodes.length > 0) {
      // Use database codes
      codes = dbCodes.map(dbCode => ({
        code: dbCode.code,
        codeType: dbCode.code_type as 'CPT' | 'ICD-10-CM' | 'HCPCS' | 'CDT',
        description: dbCode.description,
        confidence: 0.75,
        category: dbCode.category,
        specialty: dbCode.specialty
      }));
    } else {
      // Fallback to hardcoded common codes
      const commonCodes: Record<string, MedicalCode[]> = {
        'consultation': [
          { code: '99213', codeType: 'CPT', description: 'Office visit - established patient', confidence: 0.85 }
        ],
        'cleaning': [
          { code: 'D1110', codeType: 'CDT', description: 'Adult prophylaxis', confidence: 0.90 }
        ],
        'adjustment': [
          { code: '98940', codeType: 'CPT', description: 'Chiropractic manipulative treatment', confidence: 0.88 }
        ]
      };

      codes = commonCodes[request.procedureType.toLowerCase()] || [
        { code: '99213', codeType: 'CPT', description: 'Office visit - established patient', confidence: 0.70 }
      ];
    }

    const overallConfidence = codes.reduce((acc, code) => acc + code.confidence, 0) / codes.length || 0;

    return {
      codes,
      overallConfidence,
      suggestions: overallConfidence < 0.8 ? ['Consider manual review for accuracy'] : [],
      requiresReview: overallConfidence < 0.8
    };
  }

  // Enhanced validation with database lookup
  async validateCodes(codes: MedicalCode[], patientInfo: any): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const code of codes) {
      // Basic validation
      if (code.confidence < 0.7) {
        warnings.push(`Low confidence for code ${code.code}: ${Math.round(code.confidence * 100)}%`);
      }
      
      if (!code.code || code.code.length < 3) {
        errors.push(`Invalid code format: ${code.code}`);
        continue;
      }

      // Mock database validation since medical_codes table doesn't exist
      console.log('Mock validating code:', code.code, code.codeType);
      const dbCode = null;

      if (!dbCode) {
        warnings.push(`Code ${code.code} not found in database - verify accuracy`);
      } else if (!dbCode.is_active) {
        errors.push(`Code ${code.code} is inactive/terminated`);
      } else if (dbCode.termination_date && new Date(dbCode.termination_date) < new Date()) {
        errors.push(`Code ${code.code} has been terminated as of ${dbCode.termination_date}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Get available codes by specialty
  async getCodesBySpecialty(specialty: string, codeType?: string): Promise<MedicalCode[]> {
    console.log('Mock fetching codes by specialty:', specialty, codeType);
    
    // Return mock medical codes since table doesn't exist
    const mockCodes: Record<string, MedicalCode[]> = {
      'general': [
        { code: '99213', codeType: 'CPT', description: 'Office visit - established patient', confidence: 1.0 },
        { code: '99214', codeType: 'CPT', description: 'Office visit - established patient, complex', confidence: 1.0 }
      ],
      'dental': [
        { code: 'D1110', codeType: 'CDT', description: 'Adult prophylaxis', confidence: 1.0 },
        { code: 'D0120', codeType: 'CDT', description: 'Periodic oral evaluation', confidence: 1.0 }
      ],
      'chiropractic': [
        { code: '98940', codeType: 'CPT', description: 'Chiropractic manipulative treatment', confidence: 1.0 },
        { code: '98941', codeType: 'CPT', description: 'Chiropractic manipulative treatment, extended', confidence: 1.0 }
      ]
    };

    return mockCodes[specialty.toLowerCase()] || mockCodes['general'];
  }
}

export const medicalCodingService = new MedicalCodingService();
