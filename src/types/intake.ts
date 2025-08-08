// Core Form Field Types (preserved from original)
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'number';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  [key: string]: unknown; // Database compatibility
}

// Use JSON-compatible type for database (using any for Supabase compatibility)
export type FormFieldsJson = any;
export type FormDataJson = Record<string, unknown>; // Flexible form data structure

export interface IntakeForm {
  id: string;
  title: string;
  description?: string;
  form_fields: FormFieldsJson;
  is_active: boolean;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface IntakeSubmission {
  id: string;
  form_id: string;
  form_data: FormDataJson;
  patient_name: string;
  patient_email: string;
  patient_phone?: string;
  ai_summary?: string;
  priority_level: string;
  status: string;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

// Enhanced intake and form types
export interface ConditionalRuleData {
  dependsOn: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number | boolean;
  action: 'show' | 'hide' | 'require' | 'disable';
}

export interface AdvancedFieldData {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  conditionalRules: ConditionalRuleData[];
  options?: string[];
  defaultValue?: string | number | boolean;
  helpText?: string;
  fileUpload?: {
    acceptedTypes: string[];
    maxSize: number;
    multiple: boolean;
  };
  signature?: {
    consentText?: string;
    signerNameRequired: boolean;
    dateRequired: boolean;
  };
}


export interface CommunicationLogEntry {
  id: string;
  type: 'email' | 'sms' | 'phone' | 'portal';
  recipient: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  message: string;
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  created_at: string;
  metadata: {
    templateId?: string;
    submissionId?: string;
    retryCount?: number;
    priority?: 'low' | 'normal' | 'high';
    channel?: string;
    [key: string]: unknown;
  };
}

export interface FormSubmissionData {
  id: string;
  formId: string;
  patientId?: string;
  submissionData: Record<string, unknown>;
  status: 'draft' | 'submitted' | 'reviewed' | 'completed';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  priority: 'low' | 'normal' | 'high';
  flags: string[];
  aiSummary?: string;
}

export interface AISuggestedField {
  type: string;
  label: string;
  placeholder?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
  };
  confidence: number;
  reasoning: string;
  category: string;
}

export interface ConfirmationStepData {
  personalInfo?: Record<string, unknown>;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  medicalHistory: Array<{
    condition: string;
    date: string;
    notes?: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  allergies: Array<{
    allergen: string;
    reaction: string;
    severity: string;
  }>;
  insurance: Record<string, unknown>;
  symptomAssessment?: Record<string, unknown>;
  appointmentDate?: string;
  appointmentType?: string;
  appointmentTime?: string;
  photoVerification?: Record<string, unknown>;
}

export interface InsuranceCardData {
  extractedData?: {
    insuranceProvider: string;
    policyNumber: string;
    groupNumber: string;
    memberId: string;
    memberName: string;
  };
  frontImageUrl?: string;
  backImageUrl?: string;
  uploadedAt: string;
  processedAt?: string;
  confidence?: number;
}