
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileOnboardingFlow } from './MobileOnboardingFlow';
import { MobileStepMenu } from './MobileStepMenu';
import { ComprehensiveOnboardingFlow } from './ComprehensiveOnboardingFlow';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';

interface EnhancedMobileOnboardingProps {
  onComplete: (data: any) => void;
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
    steps,
    nextStep,
    prevStep,
    setCurrentStep
  } = useOnboardingFlow();

  console.log('EnhancedMobileOnboarding rendering:', { isMobile, currentStep, stepsLength: steps.length });

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
    setCurrentStep(stepIndex);
    setShowMobileMenu(false);
  };

  const handleComplete = () => {
    onComplete(onboardingData);
  };

  console.log('Rendering mobile flow');

  return (
    <>
      <MobileOnboardingFlow
        currentStep={currentStep}
        totalSteps={steps.length}
        stepTitle={currentStepData.title}
        stepDescription={getStepDescription(currentStepData.component)}
        onNext={nextStep}
        onPrevious={prevStep}
        onComplete={handleComplete}
        canProceed={true}
        isLoading={false}
        completionPercentage={onboardingData.completionPercentage || 0}
        completedSteps={completedSteps}
        showMenu={showMobileMenu}
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
      >
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center p-6">
            <h3 className="text-lg font-semibold mb-2">{currentStepData.title}</h3>
            <p className="text-gray-600 mb-4">
              {getStepDescription(currentStepData.component)}
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Step {currentStep + 1} of {steps.length} - {currentStepData.component}
              </p>
            </div>
          </div>
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
