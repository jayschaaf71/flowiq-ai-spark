// UI and Component specific types

export interface MobileFormFieldProps {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number';
  label: string;
  value: string | number | boolean | string[];
  onChange: (value: string | number | boolean | string[]) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ProgressSidebarData {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  steps: Array<{
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'active' | 'completed' | 'skipped';
  }>;
}

export interface PracticeDetailsData {
  id?: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
  npiNumber?: string;
  specialty: string;
  practitioners: Array<{
    id: string;
    name: string;
    title: string;
    license: string;
    email: string;
  }>;
}

export interface TeamInvitationData {
  email: string;
  role: 'admin' | 'practitioner' | 'staff' | 'billing';
  firstName: string;
  lastName: string;
  department?: string;
  permissions: string[];
}

export interface ReviewLaunchData {
  practiceSetup: boolean;
  agentConfiguration: boolean;
  ehrIntegration: boolean;
  paymentSetup: boolean;
  templateConfiguration: boolean;
  teamInvitations: boolean;
  testingCompleted: boolean;
  readyToLaunch: boolean;
}