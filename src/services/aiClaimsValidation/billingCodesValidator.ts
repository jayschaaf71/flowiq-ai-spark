
import { ValidationCheck, ClaimValidationData, ValidationIssue } from './types';

export class BillingCodesValidator implements ValidationCheck {
  async validate(data: ClaimValidationData): Promise<{ issues: ValidationIssue[]; confidence: number }> {
    const issues: ValidationIssue[] = [];
    
    // Check for missing or invalid billing codes
    if (!data.billingCodes || data.billingCodes.length === 0) {
      issues.push({
        field: 'billingCodes',
        issue: 'No billing codes provided',
        severity: 'critical',
        suggestion: 'Add appropriate CPT/HCPCS codes for services rendered'
      });
      return { issues, confidence: 0 };
    }

    // Validate code formats
    for (const code of data.billingCodes) {
      if (!this.isValidCodeFormat(code.code, code.codeType)) {
        issues.push({
          field: 'billingCodes',
          issue: `Invalid ${code.codeType} code format: ${code.code}`,
          severity: 'high',
          suggestion: `Verify ${code.code} follows proper ${code.codeType} format standards`
        });
      }
    }

    // Check for code-diagnosis alignment
    if (!this.areCodesAlignedWithDiagnosis(data.billingCodes, data.diagnosis)) {
      issues.push({
        field: 'billingCodes',
        issue: 'Billing codes may not align with primary diagnosis',
        severity: 'medium',
        suggestion: 'Review medical necessity and code-diagnosis relationship'
      });
    }

    // Check for missing modifiers
    const missingModifiers = this.checkForMissingModifiers(data.billingCodes);
    missingModifiers.forEach(modifier => {
      issues.push({
        field: 'billingCodes',
        issue: `Missing modifier: ${modifier.code} may require ${modifier.modifier}`,
        severity: 'medium',
        suggestion: modifier.suggestion
      });
    });

    const confidence = issues.length === 0 ? 95 : Math.max(60 - (issues.length * 10), 20);
    return { issues, confidence };
  }

  private isValidCodeFormat(code: string, codeType: string): boolean {
    const patterns = {
      'CPT': /^\d{5}$/,
      'ICD-10-CM': /^[A-Z]\d{2}(\.[A-Z0-9]{1,4})?$/,
      'HCPCS': /^[A-Z]\d{4}$/,
      'CDT': /^D\d{4}$/
    };
    
    return patterns[codeType as keyof typeof patterns]?.test(code) || false;
  }

  private areCodesAlignedWithDiagnosis(codes: any[], diagnosis: string): boolean {
    // Simplified alignment check - in real implementation would use medical coding databases
    const suspiciousPatterns = [
      { diagnosis: /cancer|oncology/i, code: /99213|99214/, issue: 'routine visit codes with cancer diagnosis' },
      { diagnosis: /diabetes/i, code: /99401/, issue: 'counseling codes without diabetes management codes' }
    ];

    return !suspiciousPatterns.some(pattern => 
      pattern.diagnosis.test(diagnosis) && 
      codes.some(code => pattern.code.test(code.code))
    );
  }

  private checkForMissingModifiers(codes: any[]): Array<{ code: string; modifier: string; suggestion: string }> {
    const modifierRules = [
      {
        codePattern: /9921[3-5]/,
        modifier: '-25',
        condition: (codes: any[]) => codes.some(c => c.code.startsWith('9')),
        suggestion: 'Add modifier -25 when E&M service is performed with procedure'
      }
    ];

    const missing: Array<{ code: string; modifier: string; suggestion: string }> = [];
    
    codes.forEach(code => {
      modifierRules.forEach(rule => {
        if (rule.codePattern.test(code.code) && 
            rule.condition(codes) && 
            !code.modifiers?.includes(rule.modifier.replace('-', ''))) {
          missing.push({
            code: code.code,
            modifier: rule.modifier,
            suggestion: rule.suggestion
          });
        }
      });
    });

    return missing;
  }
}
