
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
