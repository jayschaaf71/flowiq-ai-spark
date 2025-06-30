
import { ValidationCheck, ClaimValidationData, ValidationIssue } from './types';

export class PatientEligibilityValidator implements ValidationCheck {
  async validate(data: ClaimValidationData): Promise<{ issues: ValidationIssue[]; confidence: number }> {
    const issues: ValidationIssue[] = [];

    // Check patient information completeness
    if (!data.patientInfo.firstName || !data.patientInfo.lastName) {
      issues.push({
        field: 'patientInfo',
        issue: 'Incomplete patient name information',
        severity: 'critical',
        suggestion: 'Ensure both first and last names are provided'
      });
    }

    if (!data.patientInfo.dateOfBirth) {
      issues.push({
        field: 'patientInfo',
        issue: 'Missing patient date of birth',
        severity: 'high',
        suggestion: 'Date of birth is required for claim processing'
      });
    }

    // Validate insurance information
    if (!data.patientInfo.insuranceInfo) {
      issues.push({
        field: 'insurance',
        issue: 'No insurance information provided',
        severity: 'critical',
        suggestion: 'Verify patient insurance coverage before submitting claim'
      });
    } else {
      if (!data.patientInfo.insuranceInfo.policyNumber) {
        issues.push({
          field: 'insurance',
          issue: 'Missing insurance policy number',
          severity: 'high',
          suggestion: 'Policy number is required for claim submission'
        });
      }

      // Check for insurance-provider mismatch
      if (data.patientInfo.insuranceInfo.provider !== data.insuranceInfo.name) {
        issues.push({
          field: 'insurance',
          issue: 'Insurance provider mismatch between patient record and claim',
          severity: 'medium',
          suggestion: 'Verify patient current insurance provider'
        });
      }
    }

    // Age validation for certain procedures
    const patientAge = this.calculateAge(data.patientInfo.dateOfBirth);
    const ageIssues = this.validateAgeForCodes(patientAge, data.billingCodes);
    issues.push(...ageIssues);

    const confidence = issues.length === 0 ? 90 : Math.max(70 - (issues.length * 15), 30);
    return { issues, confidence };
  }

  private calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private validateAgeForCodes(age: number, codes: any[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    const ageRestrictedCodes = [
      { codes: ['99381', '99391'], minAge: 18, maxAge: 39, description: 'Adult preventive care (18-39)' },
      { codes: ['99384', '99394'], minAge: 40, maxAge: 64, description: 'Adult preventive care (40-64)' },
      { codes: ['99385', '99395'], minAge: 65, maxAge: 999, description: 'Senior preventive care (65+)' }
    ];

    codes.forEach(code => {
      const restriction = ageRestrictedCodes.find(r => r.codes.includes(code.code));
      if (restriction && (age < restriction.minAge || age > restriction.maxAge)) {
        issues.push({
          field: 'billingCodes',
          issue: `Code ${code.code} not appropriate for patient age ${age}`,
          severity: 'high',
          suggestion: `Use age-appropriate code for ${restriction.description}`
        });
      }
    });

    return issues;
  }
}
