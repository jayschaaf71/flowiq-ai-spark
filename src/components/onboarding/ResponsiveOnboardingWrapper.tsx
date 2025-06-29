
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { StreamlinedPatientOnboarding } from './StreamlinedPatientOnboarding';
import { ComprehensiveOnboardingFlow } from './ComprehensiveOnboardingFlow';

interface ResponsiveOnboardingWrapperProps {
  onComplete: (data: any) => void;
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
        onComplete={onComplete}
        onCancel={onCancel}
      />
    );
  }

  // For practice setup, use the comprehensive flow
  return (
    <ComprehensiveOnboardingFlow
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
};
