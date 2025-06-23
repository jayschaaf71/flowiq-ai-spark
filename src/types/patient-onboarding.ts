
export interface PatientData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Insurance Information
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    subscriberName: string;
    relationship: string;
  };
  
  // Medical History
  medicalHistory: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    surgeries: string[];
  };
  
  // Consent and Agreements
  consents: {
    treatment: boolean;
    privacy: boolean;
    financial: boolean;
    communication: boolean;
  };
}

export interface PatientOnboardingWorkflowProps {
  onComplete: (patientId: string) => void;
  onCancel: () => void;
}
