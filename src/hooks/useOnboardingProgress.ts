
import { useState, useCallback, useEffect } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  estimatedTime?: string;
  isRequired?: boolean;
  validationFn?: (data: any) => boolean | string;
}

interface OnboardingProgressState {
  currentStepIndex: number;
  completedSteps: Set<number>;
  stepData: Record<string, any>;
  errors: Record<string, string>;
  isComplete: boolean;
}

export const useOnboardingProgress = (steps: OnboardingStep[], autoSave = true) => {
  const [state, setState] = useState<OnboardingProgressState>({
    currentStepIndex: 0,
    completedSteps: new Set(),
    stepData: {},
    errors: {},
    isComplete: false
  });

  const storageKey = 'onboarding_progress';

  // Load saved progress on mount
  useEffect(() => {
    if (autoSave) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsedState = JSON.parse(saved);
          setState(prev => ({
            ...prev,
            ...parsedState,
            completedSteps: new Set(parsedState.completedSteps || [])
          }));
        }
      } catch (error) {
        console.error('Failed to load onboarding progress:', error);
      }
    }
  }, [autoSave]);

  // Save progress when state changes
  useEffect(() => {
    if (autoSave) {
      try {
        const stateToSave = {
          ...state,
          completedSteps: Array.from(state.completedSteps)
        };
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Failed to save onboarding progress:', error);
      }
    }
  }, [state, autoSave]);

  const validateStep = useCallback((stepIndex: number, data: any): boolean | string => {
    const step = steps[stepIndex];
    if (!step) return true;

    if (step.validationFn) {
      return step.validationFn(data);
    }

    // Basic validation for required steps
    if (step.isRequired && (!data || Object.keys(data).length === 0)) {
      return `${step.title} is required`;
    }

    return true;
  }, [steps]);

  const updateStepData = useCallback((stepId: string, data: any) => {
    setState(prev => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        [stepId]: data
      }
    }));
  }, []);

  const completeStep = useCallback((stepIndex: number, data?: any) => {
    const step = steps[stepIndex];
    if (!step) return false;

    // Validate step data
    const validation = validateStep(stepIndex, data);
    if (validation !== true) {
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [step.id]: typeof validation === 'string' ? validation : 'Validation failed'
        }
      }));
      return false;
    }

    // Clear any existing errors
    setState(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[step.id];

      return {
        ...prev,
        completedSteps: new Set([...prev.completedSteps, stepIndex]),
        stepData: data ? { ...prev.stepData, [step.id]: data } : prev.stepData,
        errors: newErrors
      };
    });

    return true;
  }, [steps, validateStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setState(prev => ({
        ...prev,
        currentStepIndex: stepIndex
      }));
    }
  }, [steps.length]);

  const nextStep = useCallback(() => {
    setState(prev => {
      const nextIndex = Math.min(prev.currentStepIndex + 1, steps.length - 1);
      const isComplete = nextIndex === steps.length - 1 && prev.completedSteps.has(nextIndex);
      
      return {
        ...prev,
        currentStepIndex: nextIndex,
        isComplete
      };
    });
  }, [steps.length]);

  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStepIndex: Math.max(prev.currentStepIndex - 1, 0)
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setState({
      currentStepIndex: 0,
      completedSteps: new Set(),
      stepData: {},
      errors: {},
      isComplete: false
    });

    if (autoSave) {
      localStorage.removeItem(storageKey);
    }
  }, [autoSave]);

  const getStepProgress = useCallback(() => {
    const totalSteps = steps.length;
    const completedCount = state.completedSteps.size;
    return {
      current: state.currentStepIndex + 1,
      total: totalSteps,
      completed: completedCount,
      percentage: Math.round(((state.currentStepIndex + 1) / totalSteps) * 100)
    };
  }, [steps.length, state.currentStepIndex, state.completedSteps.size]);

  const canProceed = useCallback(() => {
    const currentStep = steps[state.currentStepIndex];
    if (!currentStep) return false;

    const hasError = !!state.errors[currentStep.id];
    const isCompleted = state.completedSteps.has(state.currentStepIndex);
    
    return !hasError && (isCompleted || !currentStep.isRequired);
  }, [steps, state.currentStepIndex, state.errors, state.completedSteps]);

  return {
    // State
    currentStepIndex: state.currentStepIndex,
    completedSteps: state.completedSteps,
    stepData: state.stepData,
    errors: state.errors,
    isComplete: state.isComplete,
    
    // Current step info
    currentStep: steps[state.currentStepIndex],
    
    // Actions
    updateStepData,
    completeStep,
    goToStep,
    nextStep,
    previousStep,
    resetProgress,
    
    // Helpers
    getStepProgress,
    canProceed,
    validateStep
  };
};
