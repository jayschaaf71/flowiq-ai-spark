
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSpecialtyTheme } from '@/hooks/useSpecialtyTheme';
import { detectSpecialty, persistSpecialtyDetection } from '@/utils/unifiedSpecialtyDetection';
import { useUserProfile } from '@/hooks/useUserProfile';
import { SpecialtyType } from '@/utils/specialtyConfig';
import { ChiropracticWrapper } from './ChiropracticWrapper';
import { DentalSleepWrapper } from './DentalSleepWrapper';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface TenantWrapperProps {
  children: React.ReactNode;
}

export const TenantWrapper: React.FC<TenantWrapperProps> = ({ children }) => {
  const location = useLocation();
  const { switchTheme } = useSpecialtyTheme();
  const { data: userProfile } = useUserProfile();

  // Phase 3: Use unified specialty detection system
  const detectCurrentSpecialty = (): SpecialtyType => {
    console.log('🎨 TenantWrapper - detecting specialty for path:', location.pathname);

    const detectionResult = detectSpecialty(userProfile, location.pathname);

    console.log('🎨 TenantWrapper - unified detection result:', detectionResult);

    // Persist for consistency across components
    persistSpecialtyDetection(detectionResult);

    return detectionResult.specialty;
  };

  const currentSpecialty = detectCurrentSpecialty();

  // Apply theme when specialty changes
  useEffect(() => {
    console.log('🎨 TenantWrapper switching theme to:', currentSpecialty);
    switchTheme(currentSpecialty);
  }, [currentSpecialty, switchTheme, location.pathname]);

  // Phase 3: More permissive wrapper rendering with better error handling
  const renderSpecialtyWrapper = () => {
    console.log('🎨 TenantWrapper rendering wrapper for specialty:', currentSpecialty);

    try {
      switch (currentSpecialty) {
        case 'dental-sleep':
          return <DentalSleepWrapper>{children}</DentalSleepWrapper>;
        case 'general-dentistry':
          // Use DentalSleepWrapper for general dentistry (same theme structure)
          return <DentalSleepWrapper>{children}</DentalSleepWrapper>;
        case 'communication':
          // Use DentalSleepWrapper for communication (blue theme)
          return <DentalSleepWrapper>{children}</DentalSleepWrapper>;
        case 'chiropractic':
        case 'med-spa':
        case 'concierge':
        case 'hrt':
        default:
          // Fallback to chiropractic wrapper for any unrecognized specialties
          console.log('🎨 Using ChiropracticWrapper as fallback for specialty:', currentSpecialty);
          return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
      }
    } catch (error) {
      console.error('🚨 Error rendering specialty wrapper:', error);
      // Ultimate fallback - render children directly with basic wrapper
      return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
    }
  };

  return (
    <ErrorBoundary>
      {renderSpecialtyWrapper()}
    </ErrorBoundary>
  );
};
