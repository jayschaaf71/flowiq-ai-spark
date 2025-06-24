
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
      // Check if code exists in our database
      const { data: dbCode } = await supabase
        .from('medical_codes')
        .select('*')
        .eq('code', code.code)
        .eq('code_type', code.codeType)
        .eq('is_active', true)
        .single();

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
    
    // Try to get codes from database based on specialty and procedure type
    const { data: dbCodes } = await supabase
      .from('medical_codes')
      .select('*')
      .eq('specialty', request.specialty.toLowerCase())
      .eq('is_active', true)
      .limit(5);

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

      // Database validation
      const { data: dbCode } = await supabase
        .from('medical_codes')
        .select('*')
        .eq('code', code.code)
        .eq('code_type', code.codeType)
        .single();

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
    let query = supabase
      .from('medical_codes')
      .select('*')
      .eq('specialty', specialty.toLowerCase())
      .eq('is_active', true);

    if (codeType) {
      query = query.eq('code_type', codeType);
    }

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('Error fetching codes:', error);
      return [];
    }

    return (data || []).map(dbCode => ({
      code: dbCode.code,
      codeType: dbCode.code_type as 'CPT' | 'ICD-10-CM' | 'HCPCS' | 'CDT',
      description: dbCode.description,
      confidence: 1.0,
      category: dbCode.category,
      specialty: dbCode.specialty
    }));
  }
}

export const medicalCodingService = new MedicalCodingService();
