
import { ValidationResult, ValidationIssue, ClaimValidationData } from "./types";

export class ServiceDateValidator {
  async validate(claimData: ClaimValidationData): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const serviceDate = new Date(claimData.serviceDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - serviceDate.getTime()) / (1000 * 60 * 60 * 24));

    if (serviceDate > today) {
      issues.push({
        field: 'service_date',
        issue: 'Service date is in the future',
        severity: 'critical',
        suggestedFix: 'Correct the service date'
      });
    } else if (daysDiff > 365) {
      issues.push({
        field: 'service_date',
        issue: 'Service date is over 1 year old',
        severity: 'medium',
        suggestedFix: 'Verify if claim is still valid for submission'
      });
    }

    return {
      isValid: issues.filter(i => i.severity === 'critical').length === 0,
      confidence: 98,
      issues,
      suggestions: [],
      aiAnalysis: ''
    };
  }
}
