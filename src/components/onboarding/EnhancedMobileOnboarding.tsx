
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileOnboardingFlow } from './MobileOnboardingFlow';
import { MobileStepMenu } from './MobileStepMenu';
import { ComprehensiveOnboardingFlow } from './ComprehensiveOnboardingFlow';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { OnboardingStepsRenderer } from './OnboardingStepsRenderer';
import { OnboardingCompletionData } from '@/types/configuration';

interface EnhancedMobileOnboardingProps {
  onComplete: (data: OnboardingCompletionData) => void;
  onCancel: () => void;
}

export const EnhancedMobileOnboarding: React.FC<EnhancedMobileOnboardingProps> = ({
  onComplete,
  onCancel
}) => {
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const {
    currentStep,
    onboardingData,
    updateOnboardingData,
    steps,
    nextStep,
    prevStep,
    setCurrentStep
  } = useOnboardingFlow();

  console.log('EnhancedMobileOnboarding rendering:', { 
    isMobile, 
    currentStep, 
    stepsLength: steps.length,
    onboardingData 
  });

  const completedSteps = new Set<number>();
  const currentStepData = steps[currentStep];

  // If not mobile, use the comprehensive flow
  if (!isMobile) {
    console.log('Rendering comprehensive flow for desktop');
    return (
      <ComprehensiveOnboardingFlow
        onComplete={onComplete}
        onCancel={onCancel}
      />
    );
  }

  const handleStepSelect = (stepIndex: number) => {
    console.log('Selecting step:', stepIndex);
    setCurrentStep(stepIndex);
    setShowMobileMenu(false);
  };

  const handleComplete = () => {
    console.log('Completing onboarding with data:', onboardingData);
    const completionData: OnboardingCompletionData = {
      ...onboardingData,
      completedAt: new Date().toISOString(),
      setupVersion: '2.0'
    };
    onComplete(completionData);
  };

  const handleNext = () => {
    console.log('Moving to next step from:', currentStep);
    nextStep();
  };

  const handlePrevious = () => {
    console.log('Moving to previous step from:', currentStep);
    prevStep();
  };

  console.log('Rendering mobile flow with step:', currentStepData);

  return (
    <>
      <MobileOnboardingFlow
        currentStep={currentStep}
        totalSteps={steps.length}
        stepTitle={currentStepData.title}
        stepDescription={getStepDescription(currentStepData.component)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onComplete={handleComplete}
        canProceed={true}
        isLoading={false}
        completionPercentage={Math.round((currentStep / (steps.length - 1)) * 100)}
        completedSteps={completedSteps}
        showMenu={showMobileMenu}
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
      >
        <div className="min-h-[400px]">
          <OnboardingStepsRenderer
            currentStep={currentStepData}
            onboardingData={onboardingData}
            updateOnboardingData={updateOnboardingData}
            nextStep={handleNext}
            onSubmit={handleComplete}
            onCancel={onCancel}
          />
        </div>
      </MobileOnboardingFlow>

      <MobileStepMenu
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        skippedSteps={onboardingData.skippedSteps || []}
        onStepSelect={handleStepSelect}
        onClose={() => setShowMobileMenu(false)}
        isVisible={showMobileMenu}
      />
    </>
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
