
import { supabase } from "@/integrations/supabase/client";
import { ValidationResult, ValidationIssue, ClaimValidationData } from "./types";

export class BillingCodesValidator {
  async validate(claimData: ClaimValidationData): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    
    // Check if billing codes exist and are active
    for (const code of claimData.billingCodes) {
      const { data: billingCode } = await supabase
        .from('billing_codes')
        .select('*')
        .eq('code', code.code)
        .eq('is_active', true)
        .single();

      if (!billingCode) {
        issues.push({
          field: 'billing_codes',
          issue: `Billing code ${code.code} is not found or inactive`,
          severity: 'critical',
          suggestedFix: 'Verify code accuracy or use alternative code'
        });
      }
    }

    // Mock AI analysis for code-diagnosis matching
    const diagnosisMatch = Math.random() > 0.2; // 80% match rate for demo
    if (!diagnosisMatch) {
      issues.push({
        field: 'diagnosis_code_match',
        issue: 'Billing codes may not align with diagnosis',
        severity: 'medium',
        suggestedFix: 'Review code selection for diagnosis match'
      });
    }

    return {
      isValid: issues.filter(i => i.severity === 'critical').length === 0,
      confidence: 85,
      issues,
      suggestions: [],
      aiAnalysis: ''
    };
  }
}
