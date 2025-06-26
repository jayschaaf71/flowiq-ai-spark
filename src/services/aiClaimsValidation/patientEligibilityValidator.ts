
import { supabase } from "@/integrations/supabase/client";
import { ValidationResult, ValidationIssue, ClaimValidationData } from "./types";

export class PatientEligibilityValidator {
  async validate(claimData: ClaimValidationData): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    
    // Check patient insurance coverage
    const { data: patientInsurance } = await supabase
      .from('patient_insurance')
      .select('*')
      .eq('patient_id', claimData.patientInfo.id)
      .eq('is_active', true);

    if (!patientInsurance || patientInsurance.length === 0) {
      issues.push({
        field: 'patient_eligibility',
        issue: 'No active insurance found for patient',
        severity: 'critical',
        suggestedFix: 'Verify patient insurance status'
      });
    } else {
      // Check if service date falls within coverage period
      const serviceDate = new Date(claimData.serviceDate);
      const activeCoverage = patientInsurance.find(ins => {
        const effectiveDate = new Date(ins.effective_date);
        const expirationDate = ins.expiration_date ? new Date(ins.expiration_date) : new Date('2099-12-31');
        return serviceDate >= effectiveDate && serviceDate <= expirationDate;
      });

      if (!activeCoverage) {
        issues.push({
          field: 'coverage_period',
          issue: 'Service date outside of insurance coverage period',
          severity: 'high',
          suggestedFix: 'Verify coverage dates or update insurance information'
        });
      }
    }

    return {
      isValid: issues.filter(i => i.severity === 'critical').length === 0,
      confidence: 90,
      issues,
      suggestions: [],
      aiAnalysis: ''
    };
  }
}
