
import { supabase } from "@/integrations/supabase/client";
import { ClaimValidationData, ValidationResult } from "@/services/aiClaimsValidation";

export interface ClaimReviewResult {
  claimId: string;
  overallScore: number;
  validationResults: ValidationResult;
  autoCorrections: AutoCorrection[];
  riskFactors: RiskFactor[];
  recommendedActions: RecommendedAction[];
  processingTime: number;
  submissionReady: boolean;
}

export interface AutoCorrection {
  field: string;
  originalValue: string;
  correctedValue: string;
  confidence: number;
  reasoning: string;
  autoApplicable: boolean;
}

export interface RiskFactor {
  type: 'denial_risk' | 'compliance_risk' | 'audit_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation: string;
}

export interface RecommendedAction {
  priority: 'immediate' | 'high' | 'medium' | 'low';
  action: string;
  description: string;
  estimatedImpact: string;
  timeframe: string;
}

class AIClaimsReviewEngine {
  async reviewClaim(claimData: ClaimValidationData): Promise<ClaimReviewResult> {
    const startTime = Date.now();
    
    try {
      console.log('Starting AI review for claim:', claimData.claimNumber);

      // Run parallel AI analysis
      const [validationResults, autoCorrections, riskFactors] = await Promise.all([
        this.runValidationAnalysis(claimData),
        this.generateAutoCorrections(claimData),
        this.assessRiskFactors(claimData)
      ]);

      // Calculate overall score
      const overallScore = this.calculateOverallScore(validationResults, riskFactors);

      // Generate recommended actions
      const recommendedActions = this.generateRecommendedActions(
        validationResults,
        autoCorrections,
        riskFactors
      );

      const processingTime = (Date.now() - startTime) / 1000;

      const result: ClaimReviewResult = {
        claimId: claimData.claimNumber,
        overallScore,
        validationResults,
        autoCorrections,
        riskFactors,
        recommendedActions,
        processingTime,
        submissionReady: overallScore >= 85 && riskFactors.filter(r => r.severity === 'critical').length === 0
      };

      // Save review results
      await this.saveReviewResults(result);

      return result;

    } catch (error) {
      console.error('AI Claims Review error:', error);
      throw error;
    }
  }

  private async runValidationAnalysis(claimData: ClaimValidationData): Promise<ValidationResult> {
    // Use existing validation service but with enhanced AI analysis
    const { aiClaimsValidationService } = await import('@/services/aiClaimsValidation');
    return aiClaimsValidationService.validateClaim(claimData);
  }

  private async generateAutoCorrections(claimData: ClaimValidationData): Promise<AutoCorrection[]> {
    const corrections: AutoCorrection[] = [];

    // AI-powered code corrections
    if (claimData.billingCodes) {
      for (const code of claimData.billingCodes) {
        const correction = await this.analyzeCodeAccuracy(code, claimData);
        if (correction) corrections.push(correction);
      }
    }

    // Provider information corrections
    const providerCorrection = await this.analyzeProviderInfo(claimData.providerInfo);
    if (providerCorrection) corrections.push(providerCorrection);

    // Patient eligibility corrections
    const eligibilityCorrection = await this.analyzeEligibility(claimData.patientInfo);
    if (eligibilityCorrection) corrections.push(eligibilityCorrection);

    return corrections;
  }

  private async analyzeCodeAccuracy(code: any, claimData: ClaimValidationData): Promise<AutoCorrection | null> {
    // Simulate AI analysis of coding accuracy
    const codePatterns = {
      '99213': { common: true, specialty: 'Family Medicine', avgAmount: 150 },
      '99214': { common: true, specialty: 'Family Medicine', avgAmount: 200 },
      '99215': { common: false, specialty: 'Family Medicine', avgAmount: 275 }
    };

    const pattern = codePatterns[code.code as keyof typeof codePatterns];
    
    if (pattern && code.amount && Math.abs(code.amount - pattern.avgAmount) > 50) {
      return {
        field: 'billing_code_amount',
        originalValue: code.amount.toString(),
        correctedValue: pattern.avgAmount.toString(),
        confidence: 78,
        reasoning: `Amount ${code.amount} differs significantly from typical ${code.code} fee of $${pattern.avgAmount}`,
        autoApplicable: false
      };
    }

    return null;
  }

  private async analyzeProviderInfo(providerInfo: any): Promise<AutoCorrection | null> {
    // Check NPI format and validity
    if (providerInfo.npi && !this.isValidNPI(providerInfo.npi)) {
      return {
        field: 'provider_npi',
        originalValue: providerInfo.npi,
        correctedValue: 'NEEDS_VERIFICATION',
        confidence: 95,
        reasoning: 'NPI format validation failed - requires manual verification',
        autoApplicable: false
      };
    }

    return null;
  }

  private async analyzeEligibility(patientInfo: any): Promise<AutoCorrection | null> {
    // Simulate eligibility verification
    if (patientInfo.insuranceInfo && !patientInfo.insuranceInfo.policyNumber) {
      return {
        field: 'insurance_policy',
        originalValue: 'MISSING',
        correctedValue: 'REQUIRED',
        confidence: 100,
        reasoning: 'Policy number is required for claim submission',
        autoApplicable: false
      };
    }

    return null;
  }

  private async assessRiskFactors(claimData: ClaimValidationData): Promise<RiskFactor[]> {
    const risks: RiskFactor[] = [];

    // Denial risk assessment
    const denialRisk = this.assessDenialRisk(claimData);
    if (denialRisk) risks.push(denialRisk);

    // Compliance risk assessment
    const complianceRisk = this.assessComplianceRisk(claimData);
    if (complianceRisk) risks.push(complianceRisk);

    // Audit risk assessment
    const auditRisk = this.assessAuditRisk(claimData);
    if (auditRisk) risks.push(auditRisk);

    return risks;
  }

  private assessDenialRisk(claimData: ClaimValidationData): RiskFactor | null {
    const serviceDate = new Date(claimData.serviceDate);
    const daysSinceService = Math.floor((Date.now() - serviceDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceService > 90) {
      return {
        type: 'denial_risk',
        severity: 'high',
        description: `Claim is ${daysSinceService} days old - approaching timely filing limits`,
        mitigation: 'Submit immediately to avoid timely filing denial'
      };
    }

    return null;
  }

  private assessComplianceRisk(claimData: ClaimValidationData): RiskFactor | null {
    // Check for missing required fields
    if (!claimData.diagnosis || claimData.diagnosis.trim().length === 0) {
      return {
        type: 'compliance_risk',
        severity: 'critical',
        description: 'Missing primary diagnosis - required for compliance',
        mitigation: 'Add ICD-10 diagnosis code before submission'
      };
    }

    return null;
  }

  private assessAuditRisk(claimData: ClaimValidationData): RiskFactor | null {
    // High dollar amounts trigger audit risk
    if (claimData.totalAmount > 1000) {
      return {
        type: 'audit_risk',
        severity: 'medium',
        description: 'High-value claim may trigger payer audit',
        mitigation: 'Ensure thorough documentation is available'
      };
    }

    return null;
  }

  private calculateOverallScore(validation: ValidationResult, risks: RiskFactor[]): number {
    let score = validation.confidence;

    // Deduct points for risks
    risks.forEach(risk => {
      switch (risk.severity) {
        case 'critical': score -= 25; break;
        case 'high': score -= 15; break;
        case 'medium': score -= 10; break;
        case 'low': score -= 5; break;
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  private generateRecommendedActions(
    validation: ValidationResult,
    corrections: AutoCorrection[],
    risks: RiskFactor[]
  ): RecommendedAction[] {
    const actions: RecommendedAction[] = [];

    // Critical issues first
    risks.filter(r => r.severity === 'critical').forEach(risk => {
      actions.push({
        priority: 'immediate',
        action: 'Fix Critical Issue',
        description: risk.description,
        estimatedImpact: 'Prevents claim rejection',
        timeframe: 'Before submission'
      });
    });

    // Auto-corrections
    corrections.filter(c => c.autoApplicable).forEach(correction => {
      actions.push({
        priority: 'high',
        action: 'Apply Auto-Correction',
        description: `${correction.field}: ${correction.reasoning}`,
        estimatedImpact: `${correction.confidence}% confidence improvement`,
        timeframe: 'Immediate'
      });
    });

    // General improvements
    if (validation.confidence < 90) {
      actions.push({
        priority: 'medium',
        action: 'Review Validation Issues',
        description: 'Address validation concerns to improve claim quality',
        estimatedImpact: 'Reduces denial risk',
        timeframe: '15-30 minutes'
      });
    }

    return actions;
  }

  private async saveReviewResults(result: ClaimReviewResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('claims')
        .update({
          ai_confidence_score: result.overallScore,
          processing_status: result.submissionReady ? 'ai_approved' : 'ai_review_required'
        })
        .eq('claim_number', result.claimId);

      if (error) console.error('Error saving review results:', error);
    } catch (error) {
      console.error('Error saving review results:', error);
    }
  }

  private isValidNPI(npi: string): boolean {
    if (!/^\d{10}$/.test(npi)) return false;
    
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

  // Batch processing for multiple claims
  async batchReviewClaims(claims: ClaimValidationData[]): Promise<ClaimReviewResult[]> {
    console.log(`Starting batch review for ${claims.length} claims`);
    
    const results = await Promise.allSettled(
      claims.map(claim => this.reviewClaim(claim))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Review failed for claim ${claims[index].claimNumber}:`, result.reason);
        return {
          claimId: claims[index].claimNumber,
          overallScore: 0,
          validationResults: {
            isValid: false,
            confidence: 0,
            issues: [{ field: 'system', issue: 'Review failed', severity: 'critical' as const }],
            suggestions: ['Manual review required'],
            aiAnalysis: 'AI review could not be completed'
          },
          autoCorrections: [],
          riskFactors: [],
          recommendedActions: [],
          processingTime: 0,
          submissionReady: false
        };
      }
    });
  }
}

export const aiClaimsReviewEngine = new AIClaimsReviewEngine();
