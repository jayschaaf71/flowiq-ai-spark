
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SpecialtyType } from '@/utils/specialtyConfig';
import { SpecialtySelectionStep } from './SpecialtySelectionStep';
import { PracticeDetailsStep } from './PracticeDetailsStep';
import { AIAgentConfigurationStep } from './AIAgentConfigurationStep';

interface OnboardingData {
  specialty: SpecialtyType | null;
  practiceData: {
    practiceName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
    website: string;
    description: string;
    teamSize: string;
  };
  agentConfig: {
    receptionistAgent: boolean;
    intakeAgent: boolean;
    followUpAgent: boolean;
    reminderAgent: boolean;
    automationLevel: number;
    businessHours: {
      start: string;
      end: string;
      timezone: string;
    };
  };
}

interface ComprehensiveOnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onCancel?: () => void;
}

export const ComprehensiveOnboardingFlow = ({ onComplete, onCancel }: ComprehensiveOnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    specialty: null,
    practiceData: {
      practiceName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      website: '',
      description: '',
      teamSize: ''
    },
    agentConfig: {
      receptionistAgent: true,
      intakeAgent: true,
      followUpAgent: false,
      reminderAgent: true,
      automationLevel: 50,
      businessHours: {
        start: '09:00',
        end: '17:00',
        timezone: 'America/New_York'
      }
    }
  });

  const steps = [
    {
      id: 'specialty',
      title: 'Choose Specialty',
      description: 'Select your practice type',
      component: SpecialtySelectionStep
    },
    {
      id: 'practice-details',
      title: 'Practice Details',
      description: 'Tell us about your practice',
      component: PracticeDetailsStep
    },
    {
      id: 'ai-configuration',
      title: 'AI Configuration',
      description: 'Configure your AI agents',
      component: AIAgentConfigurationStep
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Specialty selection
        return onboardingData.specialty !== null;
      case 1: // Practice details
        const { practiceName, addressLine1, city, state, zipCode, phone, email } = onboardingData.practiceData;
        return !!(practiceName && addressLine1 && city && state && zipCode && phone && email);
      case 2: // AI configuration
        return true; // AI config is optional/has defaults
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Please complete required fields",
        description: "Fill in all required information before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      await onComplete(onboardingData);
      toast({
        title: "Welcome to FlowIQ!",
        description: "Your practice has been successfully set up.",
      });
    } catch (error) {
      toast({
        title: "Setup Error",
        description: "There was an issue setting up your practice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentStep = () => {
    const StepComponent = currentStepData.component;
    
    switch (currentStep) {
      case 0:
        return (
          <SpecialtySelectionStep
            selectedSpecialty={onboardingData.specialty}
            onSelectSpecialty={(specialty) => updateOnboardingData({ specialty })}
          />
        );
      case 1:
        return (
          <PracticeDetailsStep
            practiceData={onboardingData.practiceData}
            onUpdatePracticeData={(practiceData) => updateOnboardingData({ practiceData })}
          />
        );
      case 2:
        return onboardingData.specialty ? (
          <AIAgentConfigurationStep
            specialty={onboardingData.specialty}
            agentConfig={onboardingData.agentConfig}
            onUpdateAgentConfig={(agentConfig) => updateOnboardingData({ agentConfig })}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Welcome to FlowIQ</h1>
          </div>
          <p className="text-xl text-gray-600">
            Let's get your practice set up in just a few minutes
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Setup Progress</CardTitle>
              <Badge variant="secondary">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <Progress value={progress} className="mb-4" />
            
            {/* Steps indicator */}
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index < currentStep 
                      ? 'bg-green-500 text-white' 
                      : index === currentStep 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            {onCancel && (
              <Button variant="ghost" onClick={onCancel} className="ml-2">
                Cancel
              </Button>
            )}
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={!validateCurrentStep() || isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isSubmitting ? (
              'Setting up...'
            ) : currentStep === steps.length - 1 ? (
              'Complete Setup'
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
