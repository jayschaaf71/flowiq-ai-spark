
import React from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  isSpecialStep?: boolean;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onComplete,
  isSpecialStep = false
}) => {
  if (isSpecialStep) {
    return null;
  }

  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
      >
        Previous
      </Button>
      <Button
        onClick={currentStep === totalSteps - 1 ? onComplete : onNext}
      >
        {currentStep === totalSteps - 1 ? 'Complete Onboarding' : 'Next'}
      </Button>
    </div>
  );
};
