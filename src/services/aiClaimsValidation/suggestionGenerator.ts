
import { ValidationIssue } from './types';

export class SuggestionGenerator {
  generate(issues: ValidationIssue[]): string[] {
    const suggestions: string[] = [];
    const issuesByCategory = this.groupIssuesByCategory(issues);

    // Generate category-specific suggestions
    Object.entries(issuesByCategory).forEach(([category, categoryIssues]) => {
      const categorySuggestions = this.generateCategorySuggestions(category, categoryIssues);
      suggestions.push(...categorySuggestions);
    });

    // Add general improvement suggestions
    if (issues.length > 3) {
      suggestions.push('Consider implementing automated pre-submission validation to catch issues earlier');
    }

    if (issues.some(i => i.severity === 'critical')) {
      suggestions.push('Review claim entry procedures to prevent critical errors');
    }

    // Add proactive suggestions
    suggestions.push('Enable real-time eligibility verification to prevent insurance-related denials');
    suggestions.push('Set up automated coding assistance to improve accuracy');

    return [...new Set(suggestions)]; // Remove duplicates
  }

  private groupIssuesByCategory(issues: ValidationIssue[]): { [key: string]: ValidationIssue[] } {
    return issues.reduce((groups, issue) => {
      const category = issue.field;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(issue);
      return groups;
    }, {} as { [key: string]: ValidationIssue[] });
  }

  private generateCategorySuggestions(category: string, issues: ValidationIssue[]): string[] {
    const suggestions: string[] = [];

    switch (category) {
      case 'billingCodes':
        suggestions.push('Implement medical coding software with built-in validation');
        suggestions.push('Provide additional training on CPT/ICD-10 coding guidelines');
        if (issues.some(i => i.issue.includes('modifier'))) {
          suggestions.push('Create modifier reference guide for common procedures');
        }
        break;

      case 'provider':
        suggestions.push('Verify provider credentials and NPI information in system');
        suggestions.push('Maintain updated provider specialty and certification data');
        break;

      case 'patientInfo':
        suggestions.push('Implement patient information verification at registration');
        suggestions.push('Set up automated insurance eligibility checks');
        break;

      case 'serviceDate':
        suggestions.push('Configure timely filing alerts in your practice management system');
        suggestions.push('Establish daily claim review process to prevent filing delays');
        break;

      case 'diagnosis':
        suggestions.push('Use ICD-10 coding assistance tools for more specific diagnoses');
        suggestions.push('Implement clinical decision support for diagnosis coding');
        break;

      case 'totalAmount':
        suggestions.push('Set up automated fee schedule verification');
        suggestions.push('Implement claim amount validation against standard fee schedules');
        break;

      default:
        suggestions.push(`Review ${category} data entry procedures for accuracy`);
        break;
    }

    return suggestions;
  }
}
