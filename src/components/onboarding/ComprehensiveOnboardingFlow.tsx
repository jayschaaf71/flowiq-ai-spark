
import React, { useState } from 'react';
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
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { useOnboardingValidation } from '@/hooks/useOnboardingValidation';
import { useToast } from '@/hooks/use-toast';
import { OnboardingCompletionData, OnboardingSkipOption } from '@/types/configuration';

interface ComprehensiveOnboardingFlowProps {
  onComplete: (data: OnboardingCompletionData) => void;
  onCancel: () => void;
}

export const ComprehensiveOnboardingFlow: React.FC<ComprehensiveOnboardingFlowProps> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSkipOptions, setShowSkipOptions] = useState(false);
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

  const handleNext = () => {
    const result = validateCurrentStep();
    if (result.isValid) {
      nextStep();
      setShowSkipOptions(false);
    } else {
      toast({
        title: "Please fix the issues below",
        description: "Some required information is missing or invalid.",
        variant: "destructive"
      });
    }
  };

  const handleSkip = (option: OnboardingSkipOption) => {
    skipStep(currentStepData.id, option.reason);
    nextStep();
    setShowSkipOptions(false);
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
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(true);
      
      setTimeout(() => {
        console.log('Submitting onboarding data:', onboardingData);
        onComplete({
          specialty: onboardingData.specialty || 'general',
          practiceData: onboardingData.practiceData || {},
          agentConfig: onboardingData.agentConfig || {},
          ehrConfig: onboardingData.ehrConfig || {},
          paymentConfig: onboardingData.paymentConfig || {},
          templateConfig: onboardingData.templateConfig || {},
          completedAt: new Date().toISOString()
        } as OnboardingCompletionData);
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

  const isSpecialStep = currentStepData.component === 'payment' || currentStepData.component === 'review';

  if (isSubmitting || showSuccess) {
    return (
      <OnboardingErrorBoundary onRetry={() => setIsSubmitting(false)}>
        <div className="container mx-auto mt-10 p-6">
          <Card className="shadow-lg rounded-lg border-0">
            <CardContent className="py-16">
              {!showSuccess ? (
                <OnboardingLoadingState 
                  message="Setting up your FlowIQ practice..."
                  showProgress={true}
                  progress={onboardingData.completionPercentage || 85}
                />
              ) : (
                <OnboardingSuccessState
                  title="🎉 Welcome to FlowIQ!"
                  message="Your practice is now ready. Let's get you started with your new intelligent workflow system."
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Progress Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <OnboardingProgressSidebar
              currentStep={currentStep}
              steps={steps}
              onboardingData={onboardingData}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg rounded-lg border-0 overflow-hidden">
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
                {/* Validation Alerts */}
                <OnboardingValidationAlert 
                  errors={validation.errors}
                  warnings={validation.warnings}
                  className="mb-6"
                />

                {!showSkipOptions ? (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Step Guide */}
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
      </div>
    </OnboardingErrorBoundary>
  );
};

const getStepDescription = (component: string): string => {
  const descriptions = {
    specialty: "Tell us about your practice type so we can customize FlowIQ for your needs",
    practice: "Let's set up your practice information and contact details",
    team: "Add your team members and assign roles for collaborative workflows",
    agents: "Configure AI agents to automate your practice operations",
    scribe: "Set up intelligent documentation and transcription features",
    payment: "Enable secure payment processing for seamless transactions",
    ehr: "Connect your existing EHR system for unified patient records",
    templates: "Generate custom forms and templates for your specialty",
    validation: "Test your integrations to ensure everything works perfectly",
    review: "Review your configuration and launch your FlowIQ practice"
  };
  
  return descriptions[component as keyof typeof descriptions] || 
         "Configure this aspect of your FlowIQ practice";
};
