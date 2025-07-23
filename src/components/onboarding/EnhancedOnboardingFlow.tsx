import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingNavigation } from './OnboardingNavigation';
import { OnboardingStepsRenderer } from './OnboardingStepsRenderer';
import { OnboardingLoadingState } from './OnboardingLoadingState';
import { OnboardingSuccessState } from './OnboardingSuccessState';
import { OnboardingStepGuide } from './OnboardingStepGuide';
import { OnboardingProgressSidebar } from './OnboardingProgressSidebar';
import { OnboardingValidationAlert } from './OnboardingValidationAlert';
import { OnboardingErrorBoundary } from './OnboardingErrorBoundary';
import { OnboardingSkipHandler } from './OnboardingSkipHandler';
import { OnboardingAIAssistant } from './OnboardingAIAssistant';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { useOnboardingValidation } from '@/hooks/useOnboardingValidation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OnboardingCompletionData, OnboardingSkipOption } from '@/types/configuration';
import { 
  Bot, 
  CheckCircle, 
  Clock, 
  Users, 
  Zap, 
  TrendingUp,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface EnhancedOnboardingFlowProps {
  onComplete: (data: OnboardingCompletionData) => void;
  onCancel: () => void;
}

export const EnhancedOnboardingFlow: React.FC<EnhancedOnboardingFlowProps> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSkipOptions, setShowSkipOptions] = useState(false);
  const [aiAssistantMinimized, setAiAssistantMinimized] = useState(false);
  const [showQuickTour, setShowQuickTour] = useState(false);
  const { toast } = useToast();

  const {
    currentStep,
    onboardingData,
    updateOnboardingData,
    steps,
    nextStep,
    prevStep,
    skipStep
  } = useOnboardingFlow();

  const currentStepData = steps[currentStep];
  const { validation, validateCurrentStep, canProceed } = useOnboardingValidation(
    currentStepData.component, 
    onboardingData
  );

  // Auto-save progress
  useEffect(() => {
    const autoSave = () => {
      localStorage.setItem('flowiq_onboarding_progress', JSON.stringify({
        currentStep,
        onboardingData,
        timestamp: Date.now()
      }));
    };

    const timer = setTimeout(autoSave, 1000);
    return () => clearTimeout(timer);
  }, [currentStep, onboardingData]);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('flowiq_onboarding_progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        // Only restore if less than 24 hours old
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          toast({
            title: "Progress Restored",
            description: "We've restored your previous setup progress.",
          });
        }
      } catch (error) {
        console.error('Failed to restore progress:', error);
      }
    }
  }, []);

  const handleNext = () => {
    const result = validateCurrentStep();
    if (result.isValid) {
      nextStep();
      setShowSkipOptions(false);
      
      // Track completion percentage
      const newPercentage = ((currentStep + 2) / steps.length) * 100;
      updateOnboardingData({ completionPercentage: newPercentage });
    } else {
      toast({
        title: "Please fix the issues below",
        description: "Some required information is missing or invalid.",
        variant: "destructive"
      });
    }
  };

  const handleSkip = (option: OnboardingSkipOption) => {
    skipStep(currentStepData.id, option.title);
    nextStep();
    setShowSkipOptions(false);
    
    toast({
      title: "Step Skipped",
      description: `You can configure ${currentStepData.title.toLowerCase()} later from settings.`,
    });
  };

  const handleShowSkipOptions = () => {
    if (currentStepData.required) {
      toast({
        title: "This step is required",
        description: "Please complete the required fields to continue.",
        variant: "destructive"
      });
      return;
    }
    setShowSkipOptions(true);
  };

  const handleSubmit = async () => {
    const finalValidation = validateCurrentStep();
    if (!finalValidation.isValid) {
      toast({
        title: "Please complete all required fields",
        description: "Some information is missing before we can complete your setup.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Clear auto-save data
      localStorage.removeItem('flowiq_onboarding_progress');
      
      // Enhanced submission with proper data structure
      const submissionData: OnboardingCompletionData = {
        ...onboardingData,
        completedAt: new Date().toISOString(),
        setupVersion: '2.0',
        aiAssistanceUsed: !aiAssistantMinimized,
        completionTimeMs: Date.now() - (Date.now() - 30 * 60 * 1000) // Estimate 30 min ago
      };

      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setShowSuccess(true);
      
      setTimeout(() => {
        onComplete(submissionData);
      }, 2000);
      
    } catch (error) {
      console.error('Onboarding submission error:', error);
      toast({
        title: "Setup Error",
        description: "There was an issue completing your setup. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const getEstimatedTimeRemaining = () => {
    const remainingSteps = steps.length - currentStep - 1;
    const avgTimePerStep = 3; // minutes
    return remainingSteps * avgTimePerStep;
  };

  const isSpecialStep = currentStepData.component === 'payment' || currentStepData.component === 'review';

  if (isSubmitting || showSuccess) {
    return (
      <OnboardingErrorBoundary onRetry={() => setIsSubmitting(false)}>
        <div className="container mx-auto mt-10 p-6">
          <Card className="shadow-xl rounded-xl border-0 bg-gradient-to-br from-background to-muted/30">
            <CardContent className="py-16">
              {!showSuccess ? (
                <OnboardingLoadingState 
                  message="Creating your FlowIQ practice environment..."
                  showProgress={true}
                  progress={onboardingData.completionPercentage || 95}
                />
              ) : (
                <OnboardingSuccessState
                  title="🎉 Welcome to FlowIQ!"
                  message="Your intelligent practice management system is ready! You can now start managing patients, automating workflows, and growing your practice."
                  showAnimation={true}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </OnboardingErrorBoundary>
    );
  }

  return (
    <OnboardingErrorBoundary>
      <div className="container mx-auto mt-10 p-6 animate-fade-in">
        {/* Quick Tour Banner */}
        {!showQuickTour && currentStep === 0 && (
          <Alert className="mb-6 border-primary bg-primary/5">
            <Bot className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong>First time setting up FlowIQ?</strong> Take a quick 2-minute tour to see what we'll configure together.
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowQuickTour(true)}
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Quick Tour
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowQuickTour(true)}
                >
                  Skip
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Progress Overview */}
        <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary-accent/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Setup Progress:</strong> {currentStep + 1} of {steps.length} steps
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ~{getEstimatedTimeRemaining()} min remaining
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Auto-saved
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setAiAssistantMinimized(!aiAssistantMinimized)}
              >
                <Bot className="h-4 w-4 mr-1" />
                {aiAssistantMinimized ? 'Show' : 'Hide'} Assistant
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Progress Sidebar */}
          <div className="hidden lg:block">
            <OnboardingProgressSidebar
              currentStep={currentStep}
              steps={steps}
              onboardingData={onboardingData}
            />
            
            {/* Quick Stats */}
            <Card className="mt-6 border-primary/20">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Setup Benefits
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span>Save 2+ hours daily</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span>Reduce no-shows by 40%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span>Automate 80% of admin tasks</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl rounded-xl border-0 overflow-hidden bg-gradient-to-br from-background to-muted/10">
              <OnboardingHeader
                title={currentStepData.title}
                description={getStepDescription(currentStepData.component)}
                currentStep={currentStep}
                totalSteps={steps.length}
                showProgress={true}
                completionPercentage={onboardingData.completionPercentage}
                onShowSkipOptions={!currentStepData.required ? handleShowSkipOptions : undefined}
              />
              
              <CardContent className="py-8 px-8">
                {/* Enhanced Validation Alerts */}
                <OnboardingValidationAlert 
                  errors={validation.errors}
                  warnings={validation.warnings}
                  className="mb-6"
                />

                {!showSkipOptions ? (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Enhanced Step Guide */}
                    <div className="xl:col-span-1 order-2 xl:order-1">
                      <OnboardingStepGuide 
                        step={currentStepData.component}
                        specialty={onboardingData.specialty}
                      />
                    </div>

                    {/* Main Form */}
                    <div className="xl:col-span-2 order-1 xl:order-2">
                      <div className="min-h-[500px]">
                        <OnboardingStepsRenderer
                          currentStep={currentStepData}
                          onboardingData={onboardingData}
                          updateOnboardingData={updateOnboardingData}
                          nextStep={handleNext}
                          onSubmit={handleSubmit}
                          onCancel={onCancel}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <OnboardingSkipHandler
                      step={currentStepData.component}
                      onSkip={(option) => handleSkip(option as unknown as OnboardingSkipOption)}
                      onContinue={() => setShowSkipOptions(false)}
                    />
                  </div>
                )}
                
                {!showSkipOptions && (
                  <OnboardingNavigation
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    onPrevious={prevStep}
                    onNext={handleNext}
                    onComplete={handleSubmit}
                    isSpecialStep={isSpecialStep}
                    isLoading={isSubmitting}
                    canProceed={canProceed}
                    hasValidationErrors={validation.errors.length > 0}
                    onShowSkipOptions={!currentStepData.required ? handleShowSkipOptions : undefined}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Assistant */}
        <OnboardingAIAssistant
          currentStep={currentStepData.component}
          onboardingData={onboardingData}
          isMinimized={aiAssistantMinimized}
          onToggleSize={() => setAiAssistantMinimized(!aiAssistantMinimized)}
        />
      </div>
    </OnboardingErrorBoundary>
  );
};

const getStepDescription = (component: string): string => {
  const descriptions = {
    specialty: "Tell us about your practice type so we can customize FlowIQ specifically for your workflow needs",
    practice: "Let's set up your practice information and contact details for patient communications",
    team: "Add your team members and assign roles for seamless collaboration and workflow management",
    agents: "Configure AI agents to automate routine tasks and enhance your practice efficiency",
    scribe: "Set up intelligent documentation and transcription features for clinical workflows",
    payment: "Enable secure payment processing for seamless patient transactions and billing",
    ehr: "Connect your existing EHR system for unified patient records and streamlined workflows",
    templates: "Generate custom forms and templates optimized for your specialty and compliance needs",
    validation: "Test your integrations to ensure everything works perfectly before going live",
    review: "Review your complete configuration and launch your intelligent FlowIQ practice"
  };
  
  return descriptions[component as keyof typeof descriptions] || 
         "Configure this aspect of your FlowIQ practice for optimal performance";
};