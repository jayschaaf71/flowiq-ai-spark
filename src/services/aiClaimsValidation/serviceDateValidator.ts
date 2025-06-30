
import { ValidationCheck, ClaimValidationData, ValidationIssue } from './types';

export class ServiceDateValidator implements ValidationCheck {
  async validate(data: ClaimValidationData): Promise<{ issues: ValidationIssue[]; confidence: number }> {
    const issues: ValidationIssue[] = [];
    const serviceDate = new Date(data.serviceDate);
    const today = new Date();

    // Check if service date is in the future
    if (serviceDate > today) {
      issues.push({
        field: 'serviceDate',
        issue: 'Service date is in the future',
        severity: 'critical',
        suggestion: 'Verify service date - claims cannot be submitted for future services'
      });
    }

    // Check if service date is too old (timely filing)
    const daysSinceService = Math.floor((today.getTime() - serviceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceService > 365) {
      issues.push({
        field: 'serviceDate',
        issue: 'Service date exceeds timely filing limits',
        severity: 'high',
        suggestion: 'Most insurers require claims within 12 months of service date'
      });
    } else if (daysSinceService > 90) {
      issues.push({
        field: 'serviceDate',
        issue: 'Service date approaching timely filing limits',
        severity: 'medium',
        suggestion: 'Submit claim promptly to avoid timely filing denials'
      });
    }

    // Validate service date format
    if (isNaN(serviceDate.getTime())) {
      issues.push({
        field: 'serviceDate',
        issue: 'Invalid service date format',
        severity: 'critical',
        suggestion: 'Provide service date in valid YYYY-MM-DD format'
      });
    }

    // Check for weekend services with certain codes
    const isWeekend = serviceDate.getDay() === 0 || serviceDate.getDay() === 6;
    if (isWeekend) {
      const routineCodes = ['99213', '99214', '99381', '99391'];
      const hasRoutineCodes = data.billingCodes.some(code => routineCodes.includes(code.code));
      
      if (hasRoutineCodes) {
        issues.push({
          field: 'serviceDate',
          issue: 'Routine office visit codes on weekend date',
          severity: 'low',
          suggestion: 'Verify weekend service or consider urgent care codes if applicable'
        });
      }
    }

    const confidence = issues.length === 0 ? 92 : Math.max(75 - (issues.length * 10), 40);
    return { issues, confidence };
  }
}
