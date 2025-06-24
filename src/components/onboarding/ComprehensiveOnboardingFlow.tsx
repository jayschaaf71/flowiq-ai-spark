import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Sparkles, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { SpecialtyType } from '@/utils/specialtyConfig';
import { SpecialtySelectionStep } from './SpecialtySelectionStep';
import { PracticeDetailsStep } from './PracticeDetailsStep';
import { AIAgentConfigurationStep } from './AIAgentConfigurationStep';
import { PaymentIntegrationStep } from './PaymentIntegrationStep';
import { EHRIntegrationStep } from './EHRIntegrationStep';
import { TeamInvitationStep } from './TeamInvitationStep';
import { TemplatePrePopulationStep } from './TemplatePrePopulationStep';

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
  paymentConfig: {
    enablePayments: boolean;
    subscriptionPlan: string;
    paymentMethods: {
      creditCard: boolean;
      bankTransfer: boolean;
      paymentPlans: boolean;
    };
    pricing: {
      consultationFee: string;
      followUpFee: string;
      packageDeals: boolean;
    };
  };
  ehrConfig: {
    enableIntegration: boolean;
    selectedEHR: string;
    syncSettings: {
      patientData: boolean;
      appointments: boolean;
      clinicalNotes: boolean;
      billing: boolean;
    };
    apiCredentials: {
      endpoint: string;
      apiKey: string;
      clientId: string;
    };
  };
  teamConfig: {
    inviteTeam: boolean;
    teamMembers: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      department: string;
      personalMessage: string;
    }>;
    roles: string[];
  };
  templateConfig: {
    enableAutoGeneration: boolean;
    selectedTemplates: string[];
    customizationPreferences: {
      useSpecialtyTerminology: boolean;
      includeBranding: boolean;
      autoTranslate: boolean;
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
  const { 
    progress, 
    isLoading: isLoadingProgress, 
    saveProgress, 
    isSaving, 
    completeProgress,
    clearProgress 
  } = useOnboardingProgress();

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
    },
    paymentConfig: {
      enablePayments: false,
      subscriptionPlan: 'professional',
      paymentMethods: {
        creditCard: true,
        bankTransfer: false,
        paymentPlans: false
      },
      pricing: {
        consultationFee: '',
        followUpFee: '',
        packageDeals: false
      }
    },
    ehrConfig: {
      enableIntegration: false,
      selectedEHR: '',
      syncSettings: {
        patientData: true,
        appointments: true,
        clinicalNotes: false,
        billing: false
      },
      apiCredentials: {
        endpoint: '',
        apiKey: '',
        clientId: ''
      }
    },
    teamConfig: {
      inviteTeam: false,
      teamMembers: [],
      roles: []
    },
    templateConfig: {
      enableAutoGeneration: true,
      selectedTemplates: [],
      customizationPreferences: {
        useSpecialtyTerminology: true,
        includeBranding: true,
        autoTranslate: false
      }
    }
  });

  // Load saved progress when component mounts
  useEffect(() => {
    if (progress && !isLoadingProgress) {
      setCurrentStep(progress.current_step);
      if (progress.form_data && Object.keys(progress.form_data).length > 0) {
        setOnboardingData(prev => ({ ...prev, ...progress.form_data }));
        toast({
          title: "Progress restored",
          description: "We've restored your previous onboarding progress.",
        });
      }
    }
  }, [progress, isLoadingProgress, toast]);

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
    },
    {
      id: 'payment-integration',
      title: 'Payment Setup',
      description: 'Configure billing and payments',
      component: PaymentIntegrationStep
    },
    {
      id: 'ehr-integration',
      title: 'EHR Integration',
      description: 'Connect your existing systems',
      component: EHRIntegrationStep
    },
    {
      id: 'team-invitation',
      title: 'Team Invitations',
      description: 'Invite your team members',
      component: TeamInvitationStep
    },
    {
      id: 'template-population',
      title: 'Template Setup',
      description: 'Generate specialty templates',
      component: TemplatePrePopulationStep
    }
  ];

  const currentStepData = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Auto-save progress when form data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentStep > 0 && onboardingData.specialty) {
        saveProgress({
          currentStep,
          formData: onboardingData,
        });
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [onboardingData, currentStep, saveProgress]);

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Specialty selection
        return onboardingData.specialty !== null;
      case 1: // Practice details
        const { practiceName, addressLine1, city, state, zipCode, phone, email } = onboardingData.practiceData;
        return !!(practiceName && addressLine1 && city && state && zipCode && phone && email);
      case 2: // AI configuration
      case 3: // Payment integration
      case 4: // EHR integration
      case 5: // Team invitation
      case 6: // Template population
        return true; // These steps are optional/have defaults
      default:
        return false;
    }
  };

  const handleSaveAndExit = () => {
    saveProgress({
      currentStep,
      formData: onboardingData,
    });
    
    toast({
      title: "Progress saved",
      description: "You can continue your setup later from where you left off.",
    });
    
    if (onCancel) {
      onCancel();
    }
  };

  const handleStartFresh = () => {
    clearProgress();
    setCurrentStep(0);
    setOnboardingData({
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
      },
      paymentConfig: {
        enablePayments: false,
        subscriptionPlan: 'professional',
        paymentMethods: {
          creditCard: true,
          bankTransfer: false,
          paymentPlans: false
        },
        pricing: {
          consultationFee: '',
          followUpFee: '',
          packageDeals: false
        }
      },
      ehrConfig: {
        enableIntegration: false,
        selectedEHR: '',
        syncSettings: {
          patientData: true,
          appointments: true,
          clinicalNotes: false,
          billing: false
        },
        apiCredentials: {
          endpoint: '',
          apiKey: '',
          clientId: ''
        }
      },
      teamConfig: {
        inviteTeam: false,
        teamMembers: [],
        roles: []
      },
      templateConfig: {
        enableAutoGeneration: true,
        selectedTemplates: [],
        customizationPreferences: {
          useSpecialtyTerminology: true,
          includeBranding: true,
          autoTranslate: false
        }
      }
    });
    
    toast({
      title: "Starting fresh",
      description: "Previous progress has been cleared.",
    });
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

    // Save progress before moving to next step
    saveProgress({
      currentStep: currentStep + 1,
      formData: onboardingData,
    });

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      // Save progress
      saveProgress({
        currentStep: newStep,
        formData: onboardingData,
      });
    }
  };

  const handleComplete = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      await onComplete(onboardingData);
      
      // Mark progress as completed after successful tenant creation
      if (progress?.id) {
        // This will be called from the parent component after tenant creation
        // completeProgress(createdTenantId);
      }
      
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
      case 3:
        return onboardingData.specialty ? (
          <PaymentIntegrationStep
            specialty={onboardingData.specialty}
            paymentConfig={onboardingData.paymentConfig}
            onUpdatePaymentConfig={(paymentConfig) => updateOnboardingData({ paymentConfig })}
          />
        ) : null;
      case 4:
        return onboardingData.specialty ? (
          <EHRIntegrationStep
            specialty={onboardingData.specialty}
            ehrConfig={onboardingData.ehrConfig}
            onUpdateEHRConfig={(ehrConfig) => updateOnboardingData({ ehrConfig })}
          />
        ) : null;
      case 5:
        return onboardingData.specialty ? (
          <TeamInvitationStep
            specialty={onboardingData.specialty}
            teamConfig={onboardingData.teamConfig}
            onUpdateTeamConfig={(teamConfig) => updateOnboardingData({ teamConfig })}
          />
        ) : null;
      case 6:
        return onboardingData.specialty ? (
          <TemplatePrePopulationStep
            specialty={onboardingData.specialty}
            templateConfig={onboardingData.templateConfig}
            onUpdateTemplateConfig={(templateConfig) => updateOnboardingData({ templateConfig })}
          />
        ) : null;
      default:
        return null;
    }
  };

  if (isLoadingProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
            <h1 className="text-4xl font-bold text-gray-900">Loading your progress...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              {progress ? 'Continue Your Setup' : 'Welcome to FlowIQ'}
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {progress ? 
              'Pick up where you left off with your practice setup' :
              "Let's get your practice set up with all the integrations and workflows you need"
            }
          </p>
          
          {progress && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <Button variant="outline" onClick={handleStartFresh}>
                Start Fresh
              </Button>
              <Button variant="outline" onClick={handleSaveAndExit}>
                <Save className="w-4 h-4 mr-2" />
                Save & Exit
              </Button>
            </div>
          )}
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-2">
                Setup Progress
                {isSaving && <Save className="w-4 h-4 animate-pulse text-blue-600" />}
              </CardTitle>
              <Badge variant="secondary">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="mb-4" />
            
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
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            <Button variant="ghost" onClick={handleSaveAndExit}>
              <Save className="w-4 h-4 mr-2" />
              Save & Exit
            </Button>
            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>
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
        
        {isSaving && (
          <div className="text-center mt-4 text-sm text-gray-600">
            <Save className="w-4 h-4 inline mr-1" />
            Saving progress...
          </div>
        )}
      </div>
    </div>
  );
};
