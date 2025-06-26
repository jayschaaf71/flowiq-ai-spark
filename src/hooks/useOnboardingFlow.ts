
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface OnboardingData {
  specialty: any;
  practiceData: {
    practiceName: string;
    address: string;
    phone: string;
    email: string;
  };
  teamConfig: {
    inviteTeam: boolean;
    teamMembers: any[];
  };
  agentConfig: {
    receptionistAgent: boolean;
    schedulingAgent: boolean;
    billingAgent: boolean;
  };
  scribeConfig: {
    enableScribeAgent: boolean;
    enablePlaudIntegration: boolean;
    zapierWebhookUrl: string;
    autoSOAPGeneration: boolean;
    realTimeTranscription: boolean;
  };
  paymentConfig: {
    enablePayments: boolean;
    subscriptionPlan: string;
  };
  ehrConfig: {
    enableIntegration: boolean;
    ehrSystem: string;
    apiEndpoint: string;
  };
  templateConfig: {
    enableAutoGeneration: boolean;
    customizationPreferences: {
      includeBranding: boolean;
      primaryColor: string;
      secondaryColor: string;
      logoUrl: any;
      brandName: string;
    };
  };
  validationResults: {
    ehrIntegration: any;
    paymentProcessor: any;
    templateGeneration: any;
  };
}

export const useOnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    specialty: null,
    practiceData: {
      practiceName: '',
      address: '',
      phone: '',
      email: ''
    },
    teamConfig: {
      inviteTeam: false,
      teamMembers: []
    },
    agentConfig: {
      receptionistAgent: false,
      schedulingAgent: false,
      billingAgent: false
    },
    scribeConfig: {
      enableScribeAgent: false,
      enablePlaudIntegration: false,
      zapierWebhookUrl: '',
      autoSOAPGeneration: true,
      realTimeTranscription: true
    },
    paymentConfig: {
      enablePayments: false,
      subscriptionPlan: 'professional'
    },
    ehrConfig: {
      enableIntegration: false,
      ehrSystem: '',
      apiEndpoint: ''
    },
    templateConfig: {
      enableAutoGeneration: false,
      customizationPreferences: {
        includeBranding: true,
        primaryColor: '#007BFF',
        secondaryColor: '#6C757D',
        logoUrl: undefined,
        brandName: ''
      }
    },
    validationResults: {
      ehrIntegration: null,
      paymentProcessor: null,
      templateGeneration: null
    }
  });

  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const steps = [
    { id: 'specialty', title: 'Practice Specialty', component: 'specialty' },
    { id: 'practice', title: 'Practice Details', component: 'practice' },
    { id: 'team', title: 'Team Setup', component: 'team' },
    { id: 'agents', title: 'AI Agents', component: 'agents' },
    { id: 'scribe', title: 'Scribe iQ Setup', component: 'scribe' },
    { id: 'payment', title: 'Payment Setup', component: 'payment' },
    { id: 'ehr', title: 'EHR Integration', component: 'ehr' },
    { id: 'templates', title: 'Templates', component: 'templates' },
    { id: 'validation', title: 'Integration Test', component: 'validation' },
    { id: 'review', title: 'Review & Launch', component: 'review' }
  ];

  // Debounced auto-save
  useEffect(() => {
    if (steps[currentStep].component !== 'review') {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        saveProgress();
      }, 3000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [onboardingData, currentStep]);

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prevData => ({ ...prevData, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
  };

  const saveProgress = async () => {
    try {
      console.log('Saving onboarding progress:', onboardingData);
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error Saving Progress",
        description: "There was an issue saving your progress. Please try again.",
        variant: "destructive",
        className: "bg-white border border-red-200"
      });
    }
  };

  return {
    currentStep,
    setCurrentStep,
    onboardingData,
    updateOnboardingData,
    steps,
    nextStep,
    prevStep
  };
};
