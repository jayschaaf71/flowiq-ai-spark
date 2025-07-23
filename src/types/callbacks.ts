// Comprehensive callback types for FlowIQ

export interface SymptomAssessmentData {
  symptoms: string[];
  severity: number;
  duration: string;
  location?: string;
  additionalNotes?: string;
  primaryComplaint?: string;
  painLocation?: string[];
  painLevel?: number;
  painType?: string;
  onsetDate?: string;
  onsetCause?: string;
  sensitivity?: string[];
  [key: string]: unknown; // Flexible for different symptom types
}

export interface PaymentConfigurationData {
  enablePayments: boolean;
  subscriptionPlan: string;
  paymentMethods: {
    creditCard: boolean;
    bankTransfer: boolean;
    paymentPlans: boolean;
  };
  pricing: {
    consultationFee: string;
    followUpFee: string;
    packageDeals: boolean;
  };
}

export interface EHRConfigurationData {
  enableIntegration: boolean;
  selectedEHR: string;
  syncSettings: {
    patientData: boolean;
    appointments: boolean;
    clinicalNotes: boolean;
    billing: boolean;
  };
  apiCredentials: {
    endpoint: string;
    apiKey: string;
    clientId: string;
  };
}

export interface IntegrationValidationResult {
  isValid: boolean;
  ehrValid: boolean;
  paymentValid: boolean;
  templateValid: boolean;
  overallStatus: 'success' | 'warning' | 'error';
  errors: string[];
  warnings: string[];
}

export interface PhotoVerificationData {
  photoUrl: string;
  idVerified: boolean;
  documentType?: string;
}

// Generic completion callbacks
export type OnCompleteCallback<T = Record<string, unknown>> = (data: T) => void;
export type OnValidationCompleteCallback = (results: IntegrationValidationResult) => void;
export type OnSubmissionCompleteCallback = (submission: Record<string, unknown>) => void;