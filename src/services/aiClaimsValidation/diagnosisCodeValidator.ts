
import { ValidationCheck, ClaimValidationData, ValidationIssue } from './types';

export class DiagnosisCodeValidator implements ValidationCheck {
  async validate(data: ClaimValidationData): Promise<{ issues: ValidationIssue[]; confidence: number }> {
    const issues: ValidationIssue[] = [];

    // Check diagnosis presence
    if (!data.diagnosis || data.diagnosis.trim().length === 0) {
      issues.push({
        field: 'diagnosis',
        issue: 'No diagnosis provided',
        severity: 'critical',
        suggestion: 'Primary diagnosis is required for claim processing'
      });
      return { issues, confidence: 0 };
    }

    // Validate diagnosis specificity
    if (this.isVagueDiagnosis(data.diagnosis)) {
      issues.push({
        field: 'diagnosis',
        issue: 'Diagnosis may lack specificity',
        severity: 'medium',
        suggestion: 'Consider more specific diagnosis code if available'
      });
    }

    // Check diagnosis-gender alignment
    const genderIssues = this.validateDiagnosisGenderAlignment(data.diagnosis, data.patientInfo);
    issues.push(...genderIssues);

    // Check diagnosis-age alignment
    const patientAge = this.calculateAge(data.patientInfo.dateOfBirth);
    const ageIssues = this.validateDiagnosisAgeAlignment(data.diagnosis, patientAge);
    issues.push(...ageIssues);

    const confidence = issues.length === 0 ? 87 : Math.max(65 - (issues.length * 8), 35);
    return { issues, confidence };
  }

  private isVagueDiagnosis(diagnosis: string): boolean {
    const vaguePatterns = [
      /unspecified/i,
      /not otherwise specified/i,
      /nos\b/i,
      /general/i,
      /routine/i
    ];
    
    return vaguePatterns.some(pattern => pattern.test(diagnosis));
  }

  private validateDiagnosisGenderAlignment(diagnosis: string, patientInfo: any): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // This would typically reference actual ICD-10 gender-specific codes
    const maleOnlyConditions = /prostat|testicular|male reproductive/i;
    const femaleOnlyConditions = /pregnan|menstrual|ovarian|cervical|uterine/i;
    
    // Note: We don't have gender info in current patient data structure
    // This is a placeholder for when gender data is available
    
    return issues;
  }

  private validateDiagnosisAgeAlignment(diagnosis: string, age: number): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    const ageSpecificConditions = [
      { condition: /congenital/i, inappropriateAge: age > 50, message: 'Congenital conditions typically diagnosed in infancy' },
      { condition: /alzheimer|dementia/i, inappropriateAge: age < 60, message: 'Dementia diagnoses uncommon in younger patients' },
      { condition: /osteoporosis/i, inappropriateAge: age < 50, message: 'Osteoporosis typically affects older adults' }
    ];

    ageSpecificConditions.forEach(rule => {
      if (rule.condition.test(diagnosis) && rule.inappropriateAge) {
        issues.push({
          field: 'diagnosis',
          issue: `${diagnosis} may be unusual for patient age ${age}`,
          severity: 'low',
          suggestion: rule.message
        });
      }
    });

    return issues;
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
}
