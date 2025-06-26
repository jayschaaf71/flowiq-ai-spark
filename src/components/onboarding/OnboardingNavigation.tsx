
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  isSpecialStep?: boolean;
  isLoading?: boolean;
  canProceed?: boolean;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onComplete,
  isSpecialStep = false,
  isLoading = false,
  canProceed = true
}) => {
  if (isSpecialStep) {
    return null;
  }

  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isLoading}
        className="transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>
      
      <div className="text-sm text-gray-600">
        Step {currentStep + 1} of {totalSteps}
      </div>
      
      <Button
        onClick={isLastStep ? onComplete : onNext}
        disabled={!canProceed || isLoading}
        className="transition-all duration-200 hover:scale-105"
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isLastStep ? 'Complete Setup' : 'Continue'}
        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
      </Button>
    </div>
  );
};
