// Enhanced onboarding and configuration types

import { OnboardingCompletionData as BaseOnboardingCompletionData } from './onboarding';
import { PaymentConfigurationData, EHRConfigurationData } from './callbacks';

// Export OnboardingCompletionData for external use
export type { OnboardingCompletionData } from './onboarding';

// Agent Configuration Types
export interface AgentConfigData {
  scribeEnabled: boolean;
  communicationEnabled: boolean;
  workflowAutomation: boolean;
  aiInsights: boolean;
  customSettings: Record<string, unknown>;
  integrations: string[];
  responseTime: number;
  language: string;
  specialty: string;
}

// Practice Configuration Types
export interface PracticeData {
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
  [key: string]: unknown; // For flexible field access
}

// Skip Option Types
export interface OnboardingSkipOption {
  id: string;
  title: string; // Add title property
  reason: string;
  skipType: 'temporary' | 'permanent';
  canRetry: boolean;
}

// Template Configuration Types
export interface TemplateConfigData {
  enableAutoGeneration: boolean;
  selectedTemplates: string[];
  customizationPreferences: {
    includeBranding: boolean;
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    brandName?: string;
  };
  generationProgress: number;
  generatedTemplates: TemplateItem[];
}

export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any> | string;
  estimated_time: string;
  templates_count: number;
  category?: string;
  isActive?: boolean;
}

// Team Configuration Types
export interface TeamConfigData {
  invitations: TeamInvitation[];
  roles: TeamRole[];
  permissions: TeamPermission[];
  departmentStructure: Department[];
}

export interface TeamInvitation {
  email: string;
  role: string;
  department: string;
  permissions: string[];
  invitedBy: string;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface TeamRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export interface TeamPermission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  roles: string[];
}

// Integration and Validation Types
export interface IntegrationResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  warnings?: string[];
  errors?: string[];
}

export interface ValidationConfig {
  enabled: boolean;
  config: Record<string, unknown>;
  lastValidated?: string;
  status: 'valid' | 'invalid' | 'pending';
}