
import { useState } from 'react';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface PracticeData {
  practiceName: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
  businessHours?: {
    start: string;
    end: string;
  };
  teamSize?: number;
  name: string;
  license_number?: string;
}

interface TeamMember {
  name: string;
  email: string;
  role: string;
}

interface TeamConfig {
  inviteTeam: boolean;
  teamMembers: TeamMember[];
  members: TeamMember[];
}

interface AgentConfig {
  'appointment-iq'?: boolean;
  'intake-iq'?: boolean;
  'billing-iq'?: boolean;
  'claims-iq'?: boolean;
  'assist-iq'?: boolean;
  'scribe-iq'?: boolean;
  automationLevel?: number;
  businessHours?: {
    start: string;
    end: string;
    timezone: string;
  };
}

interface ScribeConfig {
  enabled: boolean;
  specialty_templates: string[];
}

interface PaymentConfig {
  enablePayments: boolean;
  subscriptionPlan: string;
}

interface EHRConfig {
  enableIntegration: boolean;
  ehrSystem: string;
  apiEndpoint: string;
}

interface TemplateConfig {
  enableAutoGeneration: boolean;
  customizationPreferences: {
    includeBranding: boolean;
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    brandName?: string;
  };
}

interface ValidationResults {
  isValid: boolean;
  errors: string[];
}

export interface OnboardingData {
  specialty?: SpecialtyType;
  practiceData?: PracticeData;
  teamConfig?: TeamConfig;
  agentConfig?: AgentConfig;
  scribeConfig?: ScribeConfig;
  paymentConfig?: PaymentConfig;
  ehrConfig?: EHRConfig;
  templateConfig?: TemplateConfig;
  completionPercentage?: number;
  skippedSteps?: string[];
  validationResults?: ValidationResults;
}

export interface OnboardingStep {
  id: string;
  title: string;
  component: string;
  required: boolean;
}

export const useOnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    completionPercentage: 0,
    skippedSteps: []
  });

  const steps: OnboardingStep[] = [
    {
      id: 'specialty',
      title: 'Practice Specialty',
      component: 'specialty',
      required: true
    },
    {
      id: 'practice',
      title: 'Practice Details',
      component: 'practice',
      required: true
    },
    {
      id: 'team',
      title: 'Team Setup',
      component: 'team',
      required: false
    },
    {
      id: 'agents',
      title: 'AI Agents',
      component: 'agents',
      required: false
    },
    {
      id: 'review',
      title: 'Review & Launch',
      component: 'review',
      required: true
    }
  ];

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = (stepId: string, reason: string) => {
    setOnboardingData(prev => ({
      ...prev,
      skippedSteps: [...(prev.skippedSteps || []), stepId]
    }));
  };

  return {
    currentStep,
    setCurrentStep,
    onboardingData,
    updateOnboardingData,
    steps,
    nextStep,
    prevStep,
    skipStep
  };
};
