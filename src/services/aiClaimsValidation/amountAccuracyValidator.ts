
import { ValidationCheck, ClaimValidationData, ValidationIssue } from './types';

export class AmountAccuracyValidator implements ValidationCheck {
  async validate(data: ClaimValidationData): Promise<{ issues: ValidationIssue[]; confidence: number }> {
    const issues: ValidationIssue[] = [];

    // Check if total amount is reasonable
    if (data.totalAmount <= 0) {
      issues.push({
        field: 'totalAmount',
        issue: 'Invalid claim amount',
        severity: 'critical',
        suggestion: 'Claim amount must be greater than zero'
      });
      return { issues, confidence: 0 };
    }

    // Calculate expected amount from billing codes
    const expectedAmount = this.calculateExpectedAmount(data.billingCodes);
    const discrepancy = Math.abs(data.totalAmount - expectedAmount);
    const discrepancyPercentage = (discrepancy / expectedAmount) * 100;

    if (discrepancyPercentage > 20) {
      issues.push({
        field: 'totalAmount',
        issue: `Claim amount ${data.totalAmount} differs significantly from expected ${expectedAmount}`,
        severity: 'high',
        suggestion: 'Verify billing code amounts and calculation accuracy'
      });
    } else if (discrepancyPercentage > 10) {
      issues.push({
        field: 'totalAmount',
        issue: `Minor discrepancy in claim amount calculation`,
        severity: 'medium',
        suggestion: 'Review individual line item amounts for accuracy'
      });
    }

    // Check for unusually high amounts
    const averageAmounts = this.getAverageAmountsBySpecialty();
    const specialty = data.providerInfo.specialty || 'General';
    const expectedAverage = averageAmounts[specialty] || averageAmounts['General'];

    if (data.totalAmount > expectedAverage * 3) {
      issues.push({
        field: 'totalAmount',
        issue: 'Claim amount significantly higher than specialty average',
        severity: 'medium',
        suggestion: 'Verify services rendered justify the claim amount'
      });
    }

    const confidence = issues.length === 0 ? 85 : Math.max(60 - (issues.length * 15), 30);
    return { issues, confidence };
  }

  private calculateExpectedAmount(billingCodes: any[]): number {
    const standardFees: { [key: string]: number } = {
      '99213': 150,
      '99214': 200,
      '99215': 275,
      '99381': 180,
      '99391': 200,
      '93000': 45, // EKG
      '99000': 15  // Specimen handling
    };

    return billingCodes.reduce((total, code) => {
      const fee = code.amount || standardFees[code.code] || 100;
      return total + fee;
    }, 0);
  }

  private getAverageAmountsBySpecialty(): { [key: string]: number } {
    return {
      'Family Medicine': 175,
      'Internal Medicine': 200,
      'Cardiology': 350,
      'Dermatology': 250,
      'Orthopedics': 400,
      'General': 200
    };
  }
}
