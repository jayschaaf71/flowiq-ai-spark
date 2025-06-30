
import { ClaimValidationData, ValidationIssue } from './types';

export class AIAnalysisGenerator {
  async generate(claimData: ClaimValidationData, issues: ValidationIssue[]): Promise<string> {
    if (issues.length === 0) {
      return this.generateCleanAnalysis(claimData);
    }

    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const highIssues = issues.filter(i => i.severity === 'high');
    const mediumIssues = issues.filter(i => i.severity === 'medium');
    const lowIssues = issues.filter(i => i.severity === 'low');

    let analysis = '';

    if (criticalIssues.length > 0) {
      analysis += `Critical Issues Detected: This claim has ${criticalIssues.length} critical issue(s) that will likely result in claim denial. `;
      analysis += `Primary concerns include ${criticalIssues.map(i => i.issue.toLowerCase()).join(', ')}. `;
      analysis += `Immediate correction required before submission. `;
    }

    if (highIssues.length > 0) {
      analysis += `High Priority Issues: ${highIssues.length} high-priority issue(s) detected that may cause processing delays or denials. `;
      analysis += `Key areas needing attention: ${highIssues.map(i => this.categorizeIssue(i.field)).join(', ')}. `;
    }

    if (mediumIssues.length > 0) {
      analysis += `Optimization Opportunities: ${mediumIssues.length} areas identified for improvement to enhance claim acceptance rate. `;
    }

    if (lowIssues.length > 0) {
      analysis += `Minor Considerations: ${lowIssues.length} minor item(s) flagged for review. `;
    }

    // Add specialty-specific insights
    analysis += this.generateSpecialtyInsights(claimData);

    // Add submission recommendation
    analysis += this.generateSubmissionRecommendation(issues);

    return analysis.trim();
  }

  private generateCleanAnalysis(claimData: ClaimValidationData): string {
    let analysis = `Claim Analysis Complete: No critical issues detected. This claim meets standard validation criteria and is ready for submission. `;
    
    // Add positive reinforcement based on claim characteristics
    if (claimData.billingCodes.length > 1) {
      analysis += `Multiple service codes properly documented. `;
    }
    
    if (claimData.totalAmount > 0 && claimData.totalAmount < 1000) {
      analysis += `Claim amount within normal range for services rendered. `;
    }

    analysis += `Expected processing time: 2-5 business days. Recommend submission within current processing cycle.`;

    return analysis;
  }

  private categorizeIssue(field: string): string {
    const categories = {
      'billingCodes': 'coding accuracy',
      'provider': 'provider credentials',
      'patientInfo': 'patient demographics',
      'insurance': 'insurance verification',
      'serviceDate': 'service timing',
      'diagnosis': 'diagnostic coding',
      'totalAmount': 'financial calculations'
    };

    return categories[field as keyof typeof categories] || field;
  }

  private generateSpecialtyInsights(claimData: ClaimValidationData): string {
    const specialty = claimData.providerInfo.specialty;
    
    const insights = {
      'Family Medicine': 'Family practice claims typically have high acceptance rates when preventive care codes are properly documented.',
      'Cardiology': 'Cardiology claims benefit from detailed diagnostic testing documentation and proper modifier usage.',
      'Dermatology': 'Dermatology procedures require specific anatomical location coding for optimal reimbursement.',
      'Orthopedics': 'Orthopedic claims should include detailed injury history and treatment necessity documentation.'
    };

    const insight = insights[specialty as keyof typeof insights];
    return insight ? `Specialty Insight: ${insight} ` : '';
  }

  private generateSubmissionRecommendation(issues: ValidationIssue[]): string {
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const highCount = issues.filter(i => i.severity === 'high').length;

    if (criticalCount > 0) {
      return `Recommendation: DO NOT SUBMIT until critical issues are resolved. Risk of immediate denial is high.`;
    }

    if (highCount > 2) {
      return `Recommendation: REVIEW AND CORRECT high-priority issues before submission to avoid processing delays.`;
    }

    if (highCount > 0) {
      return `Recommendation: Consider addressing high-priority issues, but claim may be submitted with monitoring.`;
    }

    return `Recommendation: APPROVED for submission. All validation checks passed satisfactorily.`;
  }
}
