
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { StreamlinedPatientOnboarding } from './StreamlinedPatientOnboarding';
import { ComprehensiveOnboardingFlow } from './ComprehensiveOnboardingFlow';

import { OnboardingCompletionData } from '@/types/configuration';

interface ResponsiveOnboardingWrapperProps {
  onComplete: (data: OnboardingCompletionData | string) => void;
  onCancel: () => void;
  variant?: 'patient' | 'practice';
}

export const ResponsiveOnboardingWrapper: React.FC<ResponsiveOnboardingWrapperProps> = ({
  onComplete,
  onCancel,
  variant = 'patient'
}) => {
  const isMobile = useIsMobile();

  console.log('ResponsiveOnboardingWrapper rendering:', { isMobile, variant });

  // For patient onboarding, use the streamlined flow
  if (variant === 'patient') {
    return (
      <StreamlinedPatientOnboarding
        onComplete={(patientId: string) => onComplete(patientId)}
        onCancel={onCancel}
      />
    );
  }

  // For practice setup, use the comprehensive flow
  return (
    <ComprehensiveOnboardingFlow
      onComplete={(data: OnboardingCompletionData) => onComplete(data)}
      onCancel={onCancel}
    />
  );
};
