
import { useState, useEffect } from 'react';
import { getStepValidation, ValidationResult } from '@/utils/onboardingValidation';
import { OnboardingData } from '@/hooks/useOnboardingFlow';

export const useOnboardingValidation = (currentStep: string, onboardingData: OnboardingData) => {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: []
  });
  const [isValidating, setIsValidating] = useState(false);

  const validateCurrentStep = () => {
    setIsValidating(true);
    
    try {
      const result = getStepValidation(currentStep, onboardingData);
      setValidation(result);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      setValidation({
        isValid: false,
        errors: [{ field: 'general', message: 'Validation failed. Please try again.', type: 'error' }],
        warnings: []
      });
      return { isValid: false, errors: [], warnings: [] };
    } finally {
      setIsValidating(false);
    }
  };

  // Validate when step or data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateCurrentStep();
    }, 500); // Debounce validation

    return () => clearTimeout(timeoutId);
  }, [currentStep, onboardingData]);

  return {
    validation,
    isValidating,
    validateCurrentStep,
    canProceed: validation.isValid
  };
};
