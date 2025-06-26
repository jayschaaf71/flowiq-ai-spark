
import { ValidationIssue, ClaimValidationData } from "./types";

export class AIAnalysisGenerator {
  async generate(claimData: ClaimValidationData, issues: ValidationIssue[]): Promise<string> {
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
}
