
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { applySmartDefaults } from '@/utils/onboardingSmartDefaults';

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
    suggestedRoles?: string[];
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
  skippedSteps?: string[];
  completionPercentage?: number;
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
      teamMembers: [],
      suggestedRoles: []
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
    },
    skippedSteps: [],
    completionPercentage: 0
  });

  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedData = useRef<string>('');

  const steps = [
    { id: 'specialty', title: 'Practice Specialty', component: 'specialty', required: true },
    { id: 'practice', title: 'Practice Details', component: 'practice', required: true },
    { id: 'team', title: 'Team Setup', component: 'team', required: false },
    { id: 'agents', title: 'AI Agents', component: 'agents', required: false },
    { id: 'scribe', title: 'Scribe iQ Setup', component: 'scribe', required: false },
    { id: 'payment', title: 'Payment Setup', component: 'payment', required: false },
    { id: 'ehr', title: 'EHR Integration', component: 'ehr', required: false },
    { id: 'templates', title: 'Templates', component: 'templates', required: false },
    { id: 'validation', title: 'Integration Test', component: 'validation', required: false },
    { id: 'review', title: 'Review & Launch', component: 'review', required: true }
  ];

  // Calculate completion percentage
  const calculateCompletionPercentage = useCallback((data: OnboardingData) => {
    const requiredSteps = steps.filter(step => step.required).length;
    const optionalSteps = steps.filter(step => !step.required).length;
    
    let completedRequired = 0;
    let completedOptional = 0;

    // Check required steps
    if (data.specialty) completedRequired++;
    if (data.practiceData.practiceName && data.practiceData.email) completedRequired++;

    // Check optional steps
    if (data.teamConfig.inviteTeam || data.skippedSteps?.includes('team')) completedOptional++;
    if (data.agentConfig.receptionistAgent || data.agentConfig.schedulingAgent) completedOptional++;
    if (data.scribeConfig.enableScribeAgent || data.skippedSteps?.includes('scribe')) completedOptional++;
    if (data.paymentConfig.enablePayments || data.skippedSteps?.includes('payment')) completedOptional++;
    if (data.ehrConfig.enableIntegration || data.skippedSteps?.includes('ehr')) completedOptional++;
    if (data.templateConfig.enableAutoGeneration || data.skippedSteps?.includes('templates')) completedOptional++;

    // Weight required steps more heavily (70%) vs optional (30%)
    const requiredPercentage = (completedRequired / requiredSteps) * 70;
    const optionalPercentage = (completedOptional / optionalSteps) * 30;
    
    return Math.round(requiredPercentage + optionalPercentage);
  }, []);

  // Enhanced auto-save with change detection
  useEffect(() => {
    const dataString = JSON.stringify(onboardingData);
    
    // Only save if data actually changed
    if (dataString !== lastSavedData.current && steps[currentStep].component !== 'review') {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        saveProgress();
        lastSavedData.current = dataString;
      }, 1500); // Reduced debounce time for better UX
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [onboardingData, currentStep]);

  // Load saved progress on mount
  useEffect(() => {
    loadSavedProgress();
  }, []);

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prevData => {
      const newData = { ...prevData, ...updates };
      
      // Apply smart defaults based on the current step
      const currentStepData = steps[currentStep];
      const smartDefaultsApplied = applySmartDefaults(newData, currentStepData.component, updates);
      
      // Update completion percentage
      const completionPercentage = calculateCompletionPercentage(smartDefaultsApplied);
      
      return { ...smartDefaultsApplied, completionPercentage };
    });
  };

  const skipStep = (stepId: string, reason?: string) => {
    setOnboardingData(prevData => ({
      ...prevData,
      skippedSteps: [...(prevData.skippedSteps || []), stepId]
    }));
    
    console.log(`Skipped step: ${stepId}`, reason ? `Reason: ${reason}` : '');
    
    toast({
      title: "Step skipped",
      description: `${steps.find(s => s.id === stepId)?.title} can be configured later from settings.`,
      className: "bg-blue-50 border-blue-200"
    });
  };

  const nextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
  };

  const saveProgress = async () => {
    try {
      const progressData = {
        currentStep,
        onboardingData,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('onboarding_progress', JSON.stringify(progressData));
      console.log('Auto-saved onboarding progress');
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Auto-save failed",
        description: "Your progress couldn't be saved automatically. Please don't close this tab.",
        variant: "destructive",
        className: "bg-white border border-red-200"
      });
    }
  };

  const loadSavedProgress = () => {
    try {
      const savedProgress = localStorage.getItem('onboarding_progress');
      if (savedProgress) {
        const { currentStep: savedStep, onboardingData: savedData } = JSON.parse(savedProgress);
        
        setCurrentStep(savedStep);
        setOnboardingData(prevData => ({
          ...savedData,
          completionPercentage: calculateCompletionPercentage(savedData)
        }));
        
        toast({
          title: "Progress restored",
          description: "We've restored your previous onboarding progress.",
          className: "bg-green-50 border-green-200"
        });
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
  };

  const clearProgress = () => {
    localStorage.removeItem('onboarding_progress');
    console.log('Onboarding progress cleared');
  };

  return {
    currentStep,
    setCurrentStep,
    onboardingData,
    updateOnboardingData,
    steps,
    nextStep,
    prevStep,
    skipStep,
    saveProgress,
    loadSavedProgress,
    clearProgress
  };
};
