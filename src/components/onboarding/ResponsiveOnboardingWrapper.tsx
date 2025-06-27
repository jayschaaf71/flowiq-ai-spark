
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

  console.log('ResponsiveOnboardingWrapper rendering:', { isMobile });

  // Always render the enhanced mobile onboarding for now since it handles both mobile and desktop
  return (
    <EnhancedMobileOnboarding
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
};
