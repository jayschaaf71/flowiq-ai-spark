// Enhanced type definitions for comprehensive FlowIQ type safety

// EHR and Medical Records (matching database schema)
export interface SOAPNote {
  id: string;
  patientId: string;
  date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Extended properties for UI
  patientName?: string;
  provider?: string;
  status?: string;
  generatedByAI?: boolean;
}

export interface Medication {
  id: string;
  medication_name: string; // Database field name
  name?: string; // Alias for UI
  dosage: string;
  frequency: string;
  prescribed_by: string; // Database field name
  prescribedBy?: string; // Alias for UI
  prescribed_date: string; // Database field name
  startDate?: string; // Alias for UI
  endDate?: string;
  instructions?: string;
  sideEffects?: string[];
  status: 'active' | 'completed' | 'discontinued';
  notes?: string;
  patient_id?: string;
}

export interface Claim {
  id: string;
  patientId: string;
  providerId: string;
  status: 'pending' | 'approved' | 'denied' | 'processing';
  amount: number;
  submittedDate: string;
  processedDate?: string;
  denialReason?: string;
  claimNumber: string;
}

// Configuration and Settings
export interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
}

export interface AIAssistantSuggestion {
  id: string;
  type: 'field' | 'template' | 'workflow';
  title: string;
  description: string;
  confidence: number;
  category: string;
  data: Record<string, unknown>;
}

// Form and Field Types
export interface FieldConfigurationData {
  id: string;
  type: string;
  label: string;
  value: string | number | boolean | string[];
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
  options?: string[];
  defaultValue?: unknown;
}

export interface ConditionalRule {
  id: string;
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number;
  action: 'show' | 'hide' | 'require' | 'disable';
  targetFieldId: string;
}

// Lifecycle and Demo Types
export interface PatientLifecycleStage {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
  status: 'pending' | 'active' | 'completed';
  tasks: Array<{
    id: string;
    name: string;
    completed: boolean;
    dueDate?: string;
  }>;
}

// Communication and Submission Types
export interface CommunicationMetadata {
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  failureReason?: string;
  retryCount: number;
  priority: 'low' | 'normal' | 'high';
  channel: 'email' | 'sms' | 'phone' | 'portal';
}

export interface FormSubmissionSummary {
  id: string;
  formId: string;
  patientName: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'completed';
  priority: 'low' | 'normal' | 'high';
  assignedTo?: string;
  completionPercentage: number;
  flags: string[];
  patient_name?: string; // Alias for compatibility
  patient_email?: string;
  patient_phone?: string;
  form_data?: Record<string, unknown>;
  currentAssignment?: {
    staff_name: string;
    status: string;
  };
}