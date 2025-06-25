
import { supabase } from '@/integrations/supabase/client';

export interface BillingCodeSuggestion {
  code: string;
  codeType: 'CPT' | 'ICD10' | 'HCPCS';
  description: string;
  confidence: number;
  fee: number;
  reasoning: string;
  modifiers?: string[];
}

export interface AppointmentBillingAnalysis {
  appointmentId: string;
  patientId: string;
  appointmentType: string;
  suggestedCodes: BillingCodeSuggestion[];
  totalEstimatedFee: number;
  complianceNotes: string[];
  generatedAt: Date;
}

class BillingCodeSuggestionService {
  async suggestBillingCodes(appointmentId: string, appointmentNotes?: string): Promise<AppointmentBillingAnalysis> {
    console.log('Generating AI-powered billing code suggestions for appointment:', appointmentId);

    try {
      // Get appointment details
      const { data: appointment } = await supabase
        .from('appointments')
        .select('*, patients(*)')
        .eq('id', appointmentId)
        .single();

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Get patient medical history for context
      const { data: medicalHistory } = await supabase
        .from('medical_history')
        .select('*')
        .eq('patient_id', appointment.patient_id);

      // Analyze appointment and generate suggestions
      const suggestions = await this.analyzeAppointmentForCodes(
        appointment,
        appointmentNotes,
        medicalHistory || []
      );

      const totalFee = suggestions.reduce((sum, suggestion) => sum + suggestion.fee, 0);

      return {
        appointmentId,
        patientId: appointment.patient_id,
        appointmentType: appointment.appointment_type,
        suggestedCodes: suggestions,
        totalEstimatedFee: totalFee,
        complianceNotes: this.generateComplianceNotes(suggestions),
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Billing code suggestion failed:', error);
      throw error;
    }
  }

  private async analyzeAppointmentForCodes(
    appointment: any,
    notes?: string,
    medicalHistory?: any[]
  ): Promise<BillingCodeSuggestion[]> {
    const suggestions: BillingCodeSuggestion[] = [];

    // Base appointment type mapping
    const appointmentTypeCodes = {
      'routine_checkup': {
        code: '99213',
        codeType: 'CPT' as const,
        description: 'Office visit, established patient, low complexity',
        fee: 150.00,
        confidence: 0.9
      },
      'follow_up': {
        code: '99212',
        codeType: 'CPT' as const,
        description: 'Office visit, established patient, straightforward',
        fee: 120.00,
        confidence: 0.85
      },
      'new_patient': {
        code: '99203',
        codeType: 'CPT' as const,
        description: 'Office visit, new patient, low complexity',
        fee: 200.00,
        confidence: 0.9
      },
      'annual_physical': {
        code: '99395',
        codeType: 'CPT' as const,
        description: 'Periodic comprehensive preventive medicine, adult',
        fee: 300.00,
        confidence: 0.95
      }
    };

    // Get base code for appointment type
    const baseCode = appointmentTypeCodes[appointment.appointment_type];
    if (baseCode) {
      suggestions.push({
        ...baseCode,
        reasoning: `Standard code for ${appointment.appointment_type} appointment`
      });
    }

    // Add ICD-10 codes based on medical history
    if (medicalHistory && medicalHistory.length > 0) {
      for (const condition of medicalHistory.slice(0, 3)) { // Limit to top 3 conditions
        const icdCode = this.mapConditionToICD10(condition.condition_name);
        if (icdCode) {
          suggestions.push({
            code: icdCode.code,
            codeType: 'ICD10',
            description: icdCode.description,
            confidence: 0.8,
            fee: 0, // ICD codes don't have fees
            reasoning: `Based on patient's medical history: ${condition.condition_name}`
          });
        }
      }
    }

    // Analyze notes for additional codes
    if (notes) {
      const noteBasedCodes = this.analyzeNotesForCodes(notes);
      suggestions.push(...noteBasedCodes);
    }

    return suggestions;
  }

  private mapConditionToICD10(conditionName: string): { code: string; description: string } | null {
    const conditionMappings = {
      'hypertension': { code: 'I10', description: 'Essential hypertension' },
      'diabetes': { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
      'high blood pressure': { code: 'I10', description: 'Essential hypertension' },
      'depression': { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
      'anxiety': { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
      'arthritis': { code: 'M19.90', description: 'Unspecified osteoarthritis, unspecified site' }
    };

    const lowerCondition = conditionName.toLowerCase();
    for (const [condition, mapping] of Object.entries(conditionMappings)) {
      if (lowerCondition.includes(condition)) {
        return mapping;
      }
    }

    return null;
  }

  private analyzeNotesForCodes(notes: string): BillingCodeSuggestion[] {
    const suggestions: BillingCodeSuggestion[] = [];
    const lowerNotes = notes.toLowerCase();

    // Look for common procedures in notes
    const procedureKeywords = {
      'blood pressure': {
        code: '99213',
        codeType: 'CPT' as const,
        description: 'Blood pressure monitoring included in visit',
        fee: 0,
        confidence: 0.7
      },
      'vaccination': {
        code: '90471',
        codeType: 'CPT' as const,
        description: 'Immunization administration',
        fee: 25.00,
        confidence: 0.9
      },
      'ekg': {
        code: '93000',
        codeType: 'CPT' as const,
        description: 'Electrocardiogram, routine ECG',
        fee: 75.00,
        confidence: 0.85
      }
    };

    for (const [keyword, code] of Object.entries(procedureKeywords)) {
      if (lowerNotes.includes(keyword)) {
        suggestions.push({
          ...code,
          reasoning: `Detected "${keyword}" in appointment notes`
        });
      }
    }

    return suggestions;
  }

  private generateComplianceNotes(suggestions: BillingCodeSuggestion[]): string[] {
    const notes: string[] = [];

    // Check for common compliance issues
    const cptCodes = suggestions.filter(s => s.codeType === 'CPT');
    const icdCodes = suggestions.filter(s => s.codeType === 'ICD10');

    if (cptCodes.length > 0 && icdCodes.length === 0) {
      notes.push('Consider adding appropriate ICD-10 diagnosis codes to support CPT codes');
    }

    if (suggestions.some(s => s.confidence < 0.7)) {
      notes.push('Some suggestions have low confidence - verify with clinical documentation');
    }

    if (suggestions.length > 5) {
      notes.push('Large number of codes suggested - review for medical necessity');
    }

    return notes;
  }

  async getBillingCodeDatabase(): Promise<any[]> {
    const { data: codes } = await supabase
      .from('billing_codes')
      .select('*')
      .eq('is_active', true)
      .order('code');

    return codes || [];
  }

  async updateBillingCodeFees(codeUpdates: { code: string; fee: number }[]): Promise<void> {
    for (const update of codeUpdates) {
      await supabase
        .from('billing_codes')
        .update({ default_fee: update.fee })
        .eq('code', update.code);
    }
  }
}

export const billingCodeSuggestionService = new BillingCodeSuggestionService();
