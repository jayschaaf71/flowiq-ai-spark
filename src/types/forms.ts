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
  gender?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  [key: string]: unknown; // For database compatibility
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberName?: string;
  relationship?: string;
  cardData?: string; // Base64 encoded image
}

export interface InsuranceCardData {
  extractedData?: {
    insuranceProvider: string;
    policyNumber: string;
    groupNumber: string;
    memberId: string;
    memberName: string;
    insurance_provider_name?: string;
    member_id?: string;
    group_number?: string;
  };
  frontImageUrl?: string;
  backImageUrl?: string;
  uploadedAt: string;
  processedAt?: string;
  confidence?: number;
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