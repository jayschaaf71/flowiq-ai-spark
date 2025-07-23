// Comprehensive onboarding types for FlowIQ
export interface OnboardingStepData {
  stepId: string;
  completed: boolean;
  skipped?: boolean;
  data: Record<string, unknown>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface OnboardingSkipOption {
  id: string;
  reason: string;
  allowSkip: boolean;
}

export interface OnboardingStepProps<T = Record<string, unknown>> {
  specialty: string;
  currentConfig?: T;
  onStepComplete: (stepData: OnboardingStepData) => void;
  onSkipStep?: () => void;
}

export interface OnboardingCompletionData {
  specialty: string;
  practiceData: Record<string, unknown>;
  agentConfig: Record<string, unknown>;
  ehrConfig: Record<string, unknown>;
  paymentConfig: Record<string, unknown>;
  templateConfig: Record<string, unknown>;
  completedAt: string;
}