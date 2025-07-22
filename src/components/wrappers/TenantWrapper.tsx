
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSpecialtyTheme } from '@/hooks/useSpecialtyTheme';
import { ChiropracticWrapper } from './ChiropracticWrapper';
import { DentalWrapper } from './DentalWrapper';
import { DentalSleepWrapper } from './DentalSleepWrapper';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface TenantWrapperProps {
  children: React.ReactNode;
}

export const TenantWrapper: React.FC<TenantWrapperProps> = ({ children }) => {
  const location = useLocation();
  const { currentTenant } = useCurrentTenant();
  const { data: userProfile } = useUserProfile();
  const { specialty, switchTheme } = useSpecialtyTheme();

  // Enhanced specialty detection with route-based priority
  const detectSpecialtyFromRoute = () => {
    const path = location.pathname;
    
    // Route-based specialty detection for specific routes
    if (path.includes('/agents/dental-sleep') || path.includes('/dental-sleep')) {
      switchTheme('dental-sleep');
      return 'dental-sleep';
    }
    if (path.includes('/dental')) {
      switchTheme('dental');
      return 'dental';
    }
    if (path.includes('/chiropractic')) {
      switchTheme('chiropractic');
      return 'chiropractic';
    }
    
    // Default to current specialty from theme hook
    return specialty;
  };

  const currentSpecialty = detectSpecialtyFromRoute();

  // Update tenant config when specialty changes
  useEffect(() => {
    console.log('TenantWrapper detected specialty:', currentSpecialty, 'from route:', location.pathname);
  }, [currentSpecialty, location.pathname]);
  
  return (
    <ErrorBoundary>
      {(() => {
        switch (currentSpecialty) {
          case 'dental-sleep':
            return <DentalSleepWrapper>{children}</DentalSleepWrapper>;
          
          case 'dental':
            return <DentalWrapper>{children}</DentalWrapper>;
          
          case 'chiropractic':
          default:
            return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
        }
      })()}
    </ErrorBoundary>
  );
};
