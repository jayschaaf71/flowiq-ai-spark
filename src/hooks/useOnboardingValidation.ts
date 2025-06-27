
import { useState, useCallback } from 'react';
import { OnboardingData } from './useOnboardingFlow';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export const useOnboardingValidation = (stepComponent: string, data: OnboardingData) => {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: []
  });

  const validateCurrentStep = useCallback((): ValidationResult => {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Basic validation logic
    switch (stepComponent) {
      case 'specialty':
        if (!data.specialty) {
          errors.push({
            field: 'specialty',
            message: 'Please select your practice specialty'
          });
        }
        break;
      case 'practice':
        if (!data.practiceData?.practiceName) {
          errors.push({
            field: 'practiceName',
            message: 'Practice name is required'
          });
        }
        break;
    }

    const result = {
      isValid: errors.length === 0,
      errors,
      warnings
    };

    setValidation(result);
    return result;
  }, [stepComponent, data]);

  const canProceed = validation.isValid;

  return {
    validation,
    validateCurrentStep,
    canProceed
  };
};
