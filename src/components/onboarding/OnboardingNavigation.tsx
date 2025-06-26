
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  isSpecialStep?: boolean;
  isLoading?: boolean;
  canProceed?: boolean;
  hasValidationErrors?: boolean;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onComplete,
  isSpecialStep = false,
  isLoading = false,
  canProceed = true,
  hasValidationErrors = false
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const getNextButtonText = () => {
    if (isLoading) return 'Processing...';
    if (isLastStep) return 'Complete Setup';
    return 'Continue';
  };

  const getNextButtonIcon = () => {
    if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (isLastStep) return <CheckCircle className="w-4 h-4" />;
    return <ArrowRight className="w-4 h-4" />;
  };

  return (
    <div className="border-t border-gray-200 pt-6 mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirstStep || isLoading}
            className="transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {hasValidationErrors && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Please fix the issues above
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {totalSteps}
          </div>
          
          {!isSpecialStep && (
            <Button
              onClick={isLastStep ? onComplete : onNext}
              disabled={!canProceed || isLoading}
              className={`transition-all duration-200 ${
                canProceed && !hasValidationErrors 
                  ? 'hover:scale-105 shadow-md' 
                  : 'opacity-60'
              }`}
            >
              {getNextButtonText()}
              <span className="ml-2">{getNextButtonIcon()}</span>
            </Button>
          )}
        </div>
      </div>

      {!canProceed && !hasValidationErrors && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500">
            Complete the required fields to continue
          </p>
        </div>
      )}
    </div>
  );
};
