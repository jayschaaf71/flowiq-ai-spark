
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

  const completedSteps = new Set<number>();
  const currentStepData = steps[currentStep];

  // If not mobile, use the comprehensive flow
  if (!isMobile) {
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
        canProceed={true} // This would come from validation
        isLoading={false}
        completionPercentage={onboardingData.completionPercentage || 0}
        completedSteps={completedSteps}
        showMenu={showMobileMenu}
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
      >
        {/* Step content would be rendered here */}
        <div className="min-h-[300px] flex items-center justify-center text-gray-500">
          Content for {currentStepData.component} step
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
