
import { supabase } from "@/integrations/supabase/client";
import { ValidationResult, ValidationIssue, ClaimValidationData } from "./types";

export class AmountAccuracyValidator {
  async validate(claimData: ClaimValidationData): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    
    // Calculate expected amount based on billing codes
    let expectedAmount = 0;
    for (const code of claimData.billingCodes) {
      const { data: billingCode } = await supabase
        .from('billing_codes')
        .select('default_fee')
        .eq('code', code.code)
        .single();
      
      if (billingCode?.default_fee) {
        expectedAmount += parseFloat(billingCode.default_fee.toString());
      }
    }

    const amountDifference = Math.abs(claimData.totalAmount - expectedAmount);
    const percentageDiff = expectedAmount > 0 ? (amountDifference / expectedAmount) * 100 : 0;

    if (percentageDiff > 20) {
      issues.push({
        field: 'total_amount',
        issue: `Claim amount varies significantly from expected (${percentageDiff.toFixed(1)}% difference)`,
        severity: 'medium',
        suggestedFix: `Expected: $${expectedAmount.toFixed(2)}, Claimed: $${claimData.totalAmount.toFixed(2)}`
      });
    }

    return {
      isValid: percentageDiff <= 50, // Major discrepancies are invalid
      confidence: Math.max(0, 100 - percentageDiff),
      issues,
      suggestions: [],
      aiAnalysis: ''
    };
  }
}
