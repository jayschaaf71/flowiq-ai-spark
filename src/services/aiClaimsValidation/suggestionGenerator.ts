
import { ValidationIssue } from "./types";

export class SuggestionGenerator {
  generate(issues: ValidationIssue[]): string[] {
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
}
