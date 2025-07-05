
import { supabase } from "@/integrations/supabase/client";
import { ValidationResult, ClaimValidationData } from "./types";
import { BillingCodesValidator } from "./billingCodesValidator";
import { PatientEligibilityValidator } from "./patientEligibilityValidator";
import { ProviderCredentialsValidator } from "./providerCredentialsValidator";
import { ServiceDateValidator } from "./serviceDateValidator";
import { DiagnosisCodeValidator } from "./diagnosisCodeValidator";
import { AmountAccuracyValidator } from "./amountAccuracyValidator";
import { AIAnalysisGenerator } from "./aiAnalysisGenerator";
import { SuggestionGenerator } from "./suggestionGenerator";

class AIClaimsValidationService {
  private billingCodesValidator = new BillingCodesValidator();
  private patientEligibilityValidator = new PatientEligibilityValidator();
  private providerCredentialsValidator = new ProviderCredentialsValidator();
  private serviceDateValidator = new ServiceDateValidator();
  private diagnosisCodeValidator = new DiagnosisCodeValidator();
  private amountAccuracyValidator = new AmountAccuracyValidator();
  private aiAnalysisGenerator = new AIAnalysisGenerator();
  private suggestionGenerator = new SuggestionGenerator();

  // Validate a single claim using AI analysis
  async validateClaim(claimData: ClaimValidationData): Promise<ValidationResult> {
    try {
      console.log('Starting AI validation for claim:', claimData.claimNumber);

      // Perform multiple validation checks
      const validationChecks = await Promise.all([
        this.billingCodesValidator.validate(claimData),
        this.patientEligibilityValidator.validate(claimData),
        this.providerCredentialsValidator.validate(claimData),
        this.serviceDateValidator.validate(claimData),
        this.diagnosisCodeValidator.validate(claimData),
        this.amountAccuracyValidator.validate(claimData)
      ]);

      // Aggregate all validation results
      const allIssues = validationChecks.flatMap(check => check.issues);
      const averageConfidence = validationChecks.reduce((sum, check) => sum + check.confidence, 0) / validationChecks.length;
      
      // Generate AI analysis summary
      const aiAnalysis = await this.aiAnalysisGenerator.generate(claimData, allIssues);
      
      // Determine overall validity
      const criticalIssues = allIssues.filter(issue => issue.severity === 'critical');
      const highIssues = allIssues.filter(issue => issue.severity === 'high');
      
      const isValid = criticalIssues.length === 0 && highIssues.length <= 2;
      
      // Generate improvement suggestions
      const suggestions = this.suggestionGenerator.generate(allIssues);

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

  // Save validation results to database
  private async saveValidationResult(claimNumber: string, result: ValidationResult): Promise<void> {
    try {
      // Mock saving validation result since fields don't exist yet
      console.log('Mock saving validation result:', {
        claim_number: claimNumber,
        ai_confidence_score: result.confidence,
        processing_status: result.isValid ? 'validated' : 'validation_failed'
      });
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
export * from "./types";
