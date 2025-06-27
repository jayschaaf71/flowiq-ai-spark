
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { EnhancedMobileOnboarding } from './EnhancedMobileOnboarding';
import { ComprehensiveOnboardingFlow } from './ComprehensiveOnboardingFlow';

interface ResponsiveOnboardingWrapperProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export const ResponsiveOnboardingWrapper: React.FC<ResponsiveOnboardingWrapperProps> = ({
  onComplete,
  onCancel
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <EnhancedMobileOnboarding
        onComplete={onComplete}
        onCancel={onCancel}
      />
    );
  }

  return (
    <ComprehensiveOnboardingFlow
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
};
