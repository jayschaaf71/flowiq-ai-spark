
import { supabase } from "@/integrations/supabase/client";
import { ValidationResult, ValidationIssue, ClaimValidationData } from "./types";

export class ProviderCredentialsValidator {
  async validate(claimData: ClaimValidationData): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    
    const { data: provider } = await supabase
      .from('providers')
      .select('*')
      .eq('id', claimData.providerInfo.id)
      .single();

    if (!provider) {
      issues.push({
        field: 'provider',
        issue: 'Provider not found in system',
        severity: 'critical'
      });
    } else if (!provider.is_active) {
      issues.push({
        field: 'provider',
        issue: 'Provider is not active',
        severity: 'high'
      });
    }

    // Handle NPI validation - check if npi exists in providerInfo first, then provider data
    const npiNumber = claimData.providerInfo?.npi || (provider as any)?.npi || null;
    if (provider && (!npiNumber || npiNumber.toString().length !== 10)) {
      issues.push({
        field: 'provider_npi',
        issue: 'Invalid or missing NPI number',
        severity: 'medium',
        suggestedFix: 'Update provider NPI information'
      });
    }

    return {
      isValid: issues.filter(i => i.severity === 'critical').length === 0,
      confidence: 95,
      issues,
      suggestions: [],
      aiAnalysis: ''
    };
  }
}
