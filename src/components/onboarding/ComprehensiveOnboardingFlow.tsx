
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingNavigation } from './OnboardingNavigation';
import { OnboardingStepsRenderer } from './OnboardingStepsRenderer';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';

interface ComprehensiveOnboardingFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export const ComprehensiveOnboardingFlow: React.FC<ComprehensiveOnboardingFlowProps> = ({ 
  onComplete, 
  onCancel 
}) => {
  const {
    currentStep,
    onboardingData,
    updateOnboardingData,
    steps,
    nextStep,
    prevStep
  } = useOnboardingFlow();

  const handleSubmit = () => {
    console.log('Submitting onboarding data:', onboardingData);
    onComplete(onboardingData);
  };

  const currentStepData = steps[currentStep];
  const isSpecialStep = currentStepData.component === 'payment' || currentStepData.component === 'review';

  return (
    <div className="container mx-auto mt-10 p-6">
      <Card className="shadow-md rounded-md">
        <OnboardingHeader
          title={currentStepData.title}
          description={currentStepData.id}
        />
        <CardContent className="py-6 px-8">
          <OnboardingStepsRenderer
            currentStep={currentStepData}
            onboardingData={onboardingData}
            updateOnboardingData={updateOnboardingData}
            nextStep={nextStep}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          />
          <OnboardingNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevious={prevStep}
            onNext={nextStep}
            onComplete={handleSubmit}
            isSpecialStep={isSpecialStep}
          />
        </CardContent>
      </Card>
    </div>
  );
};
