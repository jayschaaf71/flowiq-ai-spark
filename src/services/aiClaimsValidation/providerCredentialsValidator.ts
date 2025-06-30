
import { ValidationCheck, ClaimValidationData, ValidationIssue } from './types';

export class ProviderCredentialsValidator implements ValidationCheck {
  async validate(data: ClaimValidationData): Promise<{ issues: ValidationIssue[]; confidence: number }> {
    const issues: ValidationIssue[] = [];

    // Validate NPI format
    if (!this.isValidNPI(data.providerInfo.npi)) {
      issues.push({
        field: 'provider',
        issue: 'Invalid NPI format',
        severity: 'critical',
        suggestion: 'Verify provider NPI is valid 10-digit number'
      });
    }

    // Check provider name completeness
    if (!data.providerInfo.firstName || !data.providerInfo.lastName) {
      issues.push({
        field: 'provider',
        issue: 'Incomplete provider name information',
        severity: 'high',
        suggestion: 'Ensure provider first and last names are complete'
      });
    }

    // Validate specialty-code alignment
    const specialtyIssues = this.validateSpecialtyAlignment(data.providerInfo.specialty, data.billingCodes);
    issues.push(...specialtyIssues);

    const confidence = issues.length === 0 ? 88 : Math.max(65 - (issues.length * 12), 25);
    return { issues, confidence };
  }

  private isValidNPI(npi: string): boolean {
    // NPI should be exactly 10 digits
    if (!/^\d{10}$/.test(npi)) return false;
    
    // Luhn algorithm check for NPI validation
    const digits = npi.split('').map(Number);
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      let digit = digits[i];
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[9];
  }

  private validateSpecialtyAlignment(specialty: string | undefined, codes: any[]): ValidationIssue[] {
    if (!specialty) return [];

    const issues: ValidationIssue[] = [];
    const specialtyCodeRules = {
      'Family Medicine': {
        common: ['99213', '99214', '99215', '99381-99385', '99391-99395'],
        unusual: ['99221-99223', '99231-99233'] // inpatient codes
      },
      'Cardiology': {
        common: ['93000', '93005', '93010', '99213', '99214'],
        unusual: ['99381-99385'] // preventive care less common
      },
      'Dermatology': {
        common: ['11100', '11200', '17000', '99213'],
        unusual: ['99221-99223'] // inpatient rare for derm
      }
    };

    const rules = specialtyCodeRules[specialty as keyof typeof specialtyCodeRules];
    if (rules) {
      codes.forEach(code => {
        if (rules.unusual.some(pattern => this.matchesCodePattern(code.code, pattern))) {
          issues.push({
            field: 'provider',
            issue: `Code ${code.code} unusual for ${specialty} specialty`,
            severity: 'medium',
            suggestion: `Verify medical necessity for ${specialty} provider billing ${code.code}`
          });
        }
      });
    }

    return issues;
  }

  private matchesCodePattern(code: string, pattern: string): boolean {
    if (pattern.includes('-')) {
      const [start, end] = pattern.split('-');
      return code >= start && code <= end;
    }
    return code === pattern;
  }
}
