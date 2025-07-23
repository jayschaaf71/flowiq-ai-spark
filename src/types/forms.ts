// Comprehensive form types for FlowIQ
export interface FormFieldOption {
  value: string;
  label: string;
}

export interface MedicalCondition {
  condition: string;
  date: string;
  notes: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface Allergy {
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | string;
}

export interface PatientInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  cardData?: string; // Base64 encoded image
}

export interface MedicalHistoryData {
  medicalHistory: MedicalCondition[];
  medications: Medication[];
  allergies: Allergy[];
}

export interface PhotoVerificationData {
  photoUrl: string;
  idVerified: boolean;
}

export interface FormSubmissionData {
  patientInfo?: PatientInfo;
  medicalHistory?: MedicalHistoryData;
  insurance?: InsuranceInfo;
  photoVerification?: PhotoVerificationData;
  [key: string]: unknown; // For additional dynamic fields
}

export interface StaffAssignment {
  staff_id: string;
  staff_name: string;
  assigned_at: string;
  status: string;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  type: 'email' | 'sms';
}

export interface FormStepProps<T = FormSubmissionData> {
  initialData: T;
  onComplete: (data: T) => void;
  onSkip?: () => void;
}

// Add index signature compatibility for database integration
export interface MedicalHistoryDataCompat extends MedicalHistoryData {
  [key: string]: unknown;
}