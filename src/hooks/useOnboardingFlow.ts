
import { useState } from 'react';

export interface OnboardingData {
  specialty?: 'chiropractic' | 'dental-sleep' | 'med-spa' | 'concierge' | 'hrt';
  practiceData?: any;
  teamConfig?: any;
  agentConfig?: any;
  scribeConfig?: any;
  paymentConfig?: any;
  ehrConfig?: any;
  templateConfig?: any;
  completionPercentage?: number;
  skippedSteps?: string[];
  validationResults?: any;
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
