import { supabase } from "@/integrations/supabase/client";

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  issues: ValidationIssue[];
  suggestions: string[];
  aiAnalysis: string;
}

export interface ValidationIssue {
  field: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedFix?: string;
}

export interface ClaimValidationData {
  claimNumber: string;
  patientInfo: any;
  providerInfo: any;
  insuranceInfo: any;
  serviceDate: string;
  billingCodes: any[];
  totalAmount: number;
  diagnosis: string;
}

class AIClaimsValidationService {
  // Validate a single claim using AI analysis
  async validateClaim(claimData: ClaimValidationData): Promise<ValidationResult> {
    try {
      console.log('Starting AI validation for claim:', claimData.claimNumber);

      // Perform multiple validation checks
      const validationChecks = await Promise.all([
        this.validateBillingCodes(claimData),
        this.validatePatientEligibility(claimData),
        this.validateProviderCredentials(claimData),
        this.validateServiceDate(claimData),
        this.validateDiagnosisCodeMatch(claimData),
        this.validateAmountAccuracy(claimData)
      ]);

      // Aggregate all validation results
      const allIssues = validationChecks.flatMap(check => check.issues);
      const averageConfidence = validationChecks.reduce((sum, check) => sum + check.confidence, 0) / validationChecks.length;
      
      // Generate AI analysis summary
      const aiAnalysis = await this.generateAIAnalysis(claimData, allIssues);
      
      // Determine overall validity
      const criticalIssues = allIssues.filter(issue => issue.severity === 'critical');
      const highIssues = allIssues.filter(issue => issue.severity === 'high');
      
      const isValid = criticalIssues.length === 0 && highIssues.length <= 2;
      
      // Generate improvement suggestions
      const suggestions = this.generateSuggestions(allIssues);

      const result: ValidationResult = {
        isValid,
        confidence: Math.round(averageConfidence),
        issues: allIssues,
        suggestions,
        aiAnalysis
      };

      // Save validation results to database
      await this.saveValidationResult(claimData.claimNumber, result);

      return result;

    } catch (error) {
      console.error('AI validation error:', error);
      return {
        isValid: false,
        confidence: 0,
        issues: [{
          field: 'system',
          issue: 'AI validation service temporarily unavailable',
          severity: 'high'
        }],
        suggestions: ['Retry validation', 'Manual review required'],
        aiAnalysis: 'Validation could not be completed due to system error'
      };
    }
  }

  // Validate billing codes against diagnosis
  private async validateBillingCodes(claimData: ClaimValidationData): Promise<ValidationResult> {
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

  // Validate patient eligibility
  private async validatePatientEligibility(claimData: ClaimValidationData): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    
    // Check patient insurance coverage
    const { data: patientInsurance } = await supabase
      .from('patient_insurance')
      .select('*')
      .eq('patient_id', claimData.patientInfo.id)
      .eq('is_active', true);

    if (!patientInsurance || patientInsurance.length === 0) {
      issues.push({
        field: 'patient_eligibility',
        issue: 'No active insurance found for patient',
        severity: 'critical',
        suggestedFix: 'Verify patient insurance status'
      });
    } else {
      // Check if service date falls within coverage period
      const serviceDate = new Date(claimData.serviceDate);
      const activeCoverage = patientInsurance.find(ins => {
        const effectiveDate = new Date(ins.effective_date);
        const expirationDate = ins.expiration_date ? new Date(ins.expiration_date) : new Date('2099-12-31');
        return serviceDate >= effectiveDate && serviceDate <= expirationDate;
      });

      if (!activeCoverage) {
        issues.push({
          field: 'coverage_period',
          issue: 'Service date outside of insurance coverage period',
          severity: 'high',
          suggestedFix: 'Verify coverage dates or update insurance information'
        });
      }
    }

    return {
      isValid: issues.filter(i => i.severity === 'critical').length === 0,
      confidence: 90,
      issues,
      suggestions: [],
      aiAnalysis: ''
    };
  }

  // Validate provider credentials
  private async validateProviderCredentials(claimData: ClaimValidationData): Promise<ValidationResult> {
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

    // Handle NPI validation - check if npi exists in provider data or providerInfo
    const npiNumber = claimData.providerInfo.npi || provider?.npi || null;
    if (provider && (!npiNumber || npiNumber.toString().length !== 10)) {
      issues.push({
        field: 'provider_npi',
        issue: 'Invalid or missing NPI number',
        severity: 'high',
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

  // Validate service date
  private async validateServiceDate(claimData: ClaimValidationData): Promise<ValidationResult> {
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

  // Validate diagnosis code matching
  private async validateDiagnosisCodeMatch(claimData: ClaimValidationData): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    
    // Mock AI-powered diagnosis-procedure matching
    const matchConfidence = Math.random() * 100;
    
    if (matchConfidence < 60) {
      issues.push({
        field: 'diagnosis_procedure_match',
        issue: 'Low confidence in diagnosis-procedure code alignment',
        severity: 'medium',
        suggestedFix: 'Review diagnosis and procedure code selections'
      });
    }

    return {
      isValid: true,
      confidence: Math.round(matchConfidence),
      issues,
      suggestions: [],
      aiAnalysis: ''
    };
  }

  // Validate amount accuracy
  private async validateAmountAccuracy(claimData: ClaimValidationData): Promise<ValidationResult> {
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

  // Generate AI analysis summary
  private async generateAIAnalysis(claimData: ClaimValidationData, issues: ValidationIssue[]): Promise<string> {
    if (issues.length === 0) {
      return "Claim appears to be well-formed with no significant issues detected. All validation checks passed successfully.";
    }

    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const highCount = issues.filter(i => i.severity === 'high').length;
    const mediumCount = issues.filter(i => i.severity === 'medium').length;

    let analysis = `AI Analysis Summary for Claim ${claimData.claimNumber}:\n\n`;
    
    if (criticalCount > 0) {
      analysis += `🚨 ${criticalCount} critical issue(s) found that may result in claim denial.\n`;
    }
    if (highCount > 0) {
      analysis += `⚠️ ${highCount} high-priority issue(s) that should be addressed.\n`;
    }
    if (mediumCount > 0) {
      analysis += `📝 ${mediumCount} medium-priority issue(s) for optimization.\n`;
    }

    analysis += "\nRecommendation: ";
    if (criticalCount > 0) {
      analysis += "Address critical issues before submission to avoid denial.";
    } else if (highCount > 2) {
      analysis += "Review and fix high-priority issues to improve approval chances.";
    } else {
      analysis += "Claim is ready for submission with minor optimizations suggested.";
    }

    return analysis;
  }

  // Generate improvement suggestions
  private generateSuggestions(issues: ValidationIssue[]): string[] {
    const suggestions: string[] = [];
    
    if (issues.some(i => i.field === 'billing_codes')) {
      suggestions.push("Review and verify all billing codes");
    }
    if (issues.some(i => i.field === 'patient_eligibility')) {
      suggestions.push("Confirm patient insurance eligibility");
    }
    if (issues.some(i => i.field === 'provider')) {
      suggestions.push("Verify provider information and credentials");
    }
    if (issues.some(i => i.field.includes('diagnosis'))) {
      suggestions.push("Review diagnosis-procedure code alignment");
    }
    if (issues.some(i => i.field === 'total_amount')) {
      suggestions.push("Verify claim amounts against fee schedules");
    }

    // Add general suggestions
    if (issues.length > 3) {
      suggestions.push("Consider manual review before submission");
    }
    if (issues.some(i => i.severity === 'critical')) {
      suggestions.push("Do not submit until critical issues are resolved");
    }

    return suggestions;
  }

  // Save validation results to database
  private async saveValidationResult(claimNumber: string, result: ValidationResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('claims')
        .update({ 
          ai_confidence_score: result.confidence,
          processing_status: result.isValid ? 'validated' : 'validation_failed'
        })
        .eq('claim_number', claimNumber);

      if (error) {
        console.error('Error saving validation result:', error);
      }
    } catch (error) {
      console.error('Error saving validation result:', error);
    }
  }

  // Batch validate multiple claims
  async batchValidateClaims(claims: ClaimValidationData[]): Promise<ValidationResult[]> {
    console.log(`Starting batch validation for ${claims.length} claims`);
    
    const results = await Promise.allSettled(
      claims.map(claim => this.validateClaim(claim))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          isValid: false,
          confidence: 0,
          issues: [{
            field: 'system',
            issue: 'Validation failed due to system error',
            severity: 'high' as const
          }],
          suggestions: ['Retry validation'],
          aiAnalysis: `Validation failed for claim ${claims[index].claimNumber}`
        };
      }
    });
  }
}

export const aiClaimsValidationService = new AIClaimsValidationService();
