
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  primaryColor: string;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  isSubmitting,
  primaryColor,
  onPrevious,
  onNext,
  onSubmit
}) => {
  return (
    <Card>
      <CardContent className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        {currentStep < totalSteps - 1 ? (
          <Button
            onClick={onNext}
            className={`bg-${primaryColor}-600 hover:bg-${primaryColor}-700`}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`bg-${primaryColor}-600 hover:bg-${primaryColor}-700`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
