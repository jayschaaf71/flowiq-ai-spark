
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { PracticeSpecialty } from './PracticeSpecialty';
import { PracticeDetails } from './PracticeDetails';
import { TeamConfiguration } from './TeamConfiguration';
import { AgentConfiguration } from './AgentConfiguration';
import { PaymentConfiguration } from './PaymentConfiguration';
import { EHRConfiguration } from './EHRConfiguration';
import { TemplateConfiguration } from './TemplateConfiguration';
import { ReviewAndLaunch } from './ReviewAndLaunch';
import { IntegrationValidationStep } from './IntegrationValidationStep';

export const ComprehensiveOnboardingFlow = ({ onComplete, onCancel }: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
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
    { id: 'payment', title: 'Payment Setup', component: 'payment' },
    { id: 'ehr', title: 'EHR Integration', component: 'ehr' },
    { id: 'templates', title: 'Templates', component: 'templates' },
    { id: 'validation', title: 'Integration Test', component: 'validation' },
    { id: 'review', title: 'Review & Launch', component: 'review' }
  ];

  // Debounced auto-save - only saves after user stops typing for 3 seconds
  useEffect(() => {
    if (steps[currentStep].component !== 'review') {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout for 3 seconds
      saveTimeoutRef.current = setTimeout(() => {
        saveProgress();
      }, 3000);
    }

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [onboardingData, currentStep]);

  const updateOnboardingData = (updates: Partial<any>) => {
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
      // Simulate API call to save progress
      console.log('Saving onboarding progress:', onboardingData);
      // Removed the toast notification to prevent constant popups
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error Saving Progress",
        description: "There was an issue saving your progress. Please try again.",
        variant: "destructive",
        className: "bg-white border border-red-200" // Make toast opaque
      });
    }
  };

  const handleSubmit = () => {
    console.log('Submitting onboarding data:', onboardingData);
    onComplete(onboardingData);
  };

  const renderStepContent = () => {
    switch (steps[currentStep].component) {
      case 'specialty':
        return (
          <PracticeSpecialty
            specialty={onboardingData.specialty}
            onSpecialtySelect={(specialty) => updateOnboardingData({ specialty })}
          />
        );

      case 'practice':
        return (
          <PracticeDetails
            practiceData={onboardingData.practiceData}
            onPracticeDetailsUpdate={(practiceData) => updateOnboardingData({ practiceData })}
          />
        );

      case 'team':
        return (
          <TeamConfiguration
            specialty={onboardingData.specialty || 'chiropractic'}
            teamConfig={onboardingData.teamConfig}
            onTeamConfigUpdate={(teamConfig) => updateOnboardingData({ teamConfig })}
          />
        );

      case 'agents':
        return (
          <AgentConfiguration
            agentConfig={onboardingData.agentConfig}
            onAgentConfigUpdate={(agentConfig) => updateOnboardingData({ agentConfig })}
          />
        );

      case 'payment':
        return (
          <PaymentConfiguration
            specialty={onboardingData.specialty || 'chiropractic'}
            paymentConfig={onboardingData.paymentConfig}
            onPaymentConfigUpdate={(paymentConfig) => updateOnboardingData({ paymentConfig })}
          />
        );

      case 'ehr':
        return (
          <EHRConfiguration
            specialty={onboardingData.specialty || 'chiropractic'}
            ehrConfig={onboardingData.ehrConfig}
            onEHRConfigUpdate={(ehrConfig) => updateOnboardingData({ ehrConfig })}
          />
        );

      case 'templates':
        return (
          <TemplateConfiguration
            specialty={onboardingData.specialty || 'chiropractic'}
            templateConfig={onboardingData.templateConfig}
            onTemplateConfigUpdate={(templateConfig) => updateOnboardingData({ templateConfig })}
          />
        );

      case 'validation':
        return (
          <IntegrationValidationStep
            onboardingData={onboardingData}
            onValidationComplete={(results) => {
              console.log('Integration validation results:', results);
              updateOnboardingData({ validationResults: results });
            }}
            onSkip={() => {
              console.log('Skipping integration validation');
              nextStep();
            }}
          />
        );

      case 'review':
        return (
          <ReviewAndLaunch
            onboardingData={onboardingData}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          />
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <Card className="shadow-md rounded-md">
        <CardHeader className="py-4 px-6 border-b">
          <CardTitle className="text-2xl font-semibold">{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].id}</CardDescription>
        </CardHeader>
        <CardContent className="py-6 px-8">
          {renderStepContent()}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
            >
              {currentStep === steps.length - 1 ? 'Complete Onboarding' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
