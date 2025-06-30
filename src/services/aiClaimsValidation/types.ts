
export interface ClaimValidationData {
  claimNumber: string;
  patientInfo: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    insuranceInfo?: {
      provider: string;
      policyNumber: string;
      groupNumber?: string;
    };
  };
  providerInfo: {
    id: string;
    firstName: string;
    lastName: string;
    npi: string;
    specialty?: string;
  };
  insuranceInfo: {
    name: string;
    id: string;
  };
  serviceDate: string;
  billingCodes: BillingCode[];
  totalAmount: number;
  diagnosis: string;
}

export interface BillingCode {
  code: string;
  codeType: 'CPT' | 'ICD-10-CM' | 'HCPCS' | 'CDT';
  description: string;
  amount?: number;
  modifiers?: string[];
}

export interface ValidationIssue {
  field: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  issues: ValidationIssue[];
  suggestions: string[];
  aiAnalysis: string;
}

export interface ValidationCheck {
  validate(data: ClaimValidationData): Promise<{
    issues: ValidationIssue[];
    confidence: number;
  }>;
}
