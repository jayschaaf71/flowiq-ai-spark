
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSpecialtyTheme } from '@/hooks/useSpecialtyTheme';
import { parseTenantFromUrl } from '@/utils/tenantRouting';
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

  // Enhanced specialty detection with production tenant priority
  const detectSpecialtyFromRoute = () => {
    const path = location.pathname;
    
    // Check if we have a production tenant first - this should override route-based detection
    const tenantRoute = parseTenantFromUrl();
    if (tenantRoute?.isProduction) {
      console.log('Production tenant detected in TenantWrapper:', tenantRoute.specialty);
      // Map tenant specialty to wrapper specialty
      switch (tenantRoute.specialty) {
        case 'dental-sleep-medicine':
          return 'dental-sleep';
        case 'chiropractic-care':
          return 'chiropractic';
        case 'general-dentistry':
        case 'dental-care':
          return 'dental';
        default:
          return 'chiropractic';
      }
    }
    
    // Fallback to route-based specialty detection for development
    if (path.includes('/agents/dental-sleep') || path.includes('/dental-sleep')) {
      return 'dental-sleep';
    }
    if (path.includes('/dental') && !path.includes('/dental-sleep')) {
      return 'dental';
    }
    if (path.includes('/chiropractic')) {
      return 'chiropractic';
    }
    
    // For other routes in development, try to determine from current tenant config
    if (currentTenant?.specialty) {
      console.log('Using tenant config specialty:', currentTenant.specialty);
      switch (currentTenant.specialty) {
        case 'dental-sleep-medicine':
          return 'dental-sleep';
        case 'chiropractic-care':
          return 'chiropractic';
        case 'general-dentistry':
        case 'dental-care':
          return 'dental';
        default:
          return 'chiropractic';
      }
    }
    
    // Final fallback
    return 'chiropractic';
  };

  const currentSpecialty = detectSpecialtyFromRoute();

  // Update theme when route changes
  useEffect(() => {
    // Use the same logic as detectSpecialtyFromRoute for theme switching
    const targetSpecialty = currentSpecialty;
    
    if (targetSpecialty && targetSpecialty !== specialty) {
      console.log('TenantWrapper switching theme from', specialty, 'to', targetSpecialty);
      switchTheme(targetSpecialty);
    }
    
    console.log('TenantWrapper detected specialty:', currentSpecialty, 'from route:', location.pathname, 'useSpecialtyTheme specialty:', specialty);
  }, [location.pathname, specialty, switchTheme, currentSpecialty]);
  
  return (
    <ErrorBoundary>
      {(() => {
        console.log('TenantWrapper rendering with specialty:', currentSpecialty, 'route:', location.pathname);
        switch (currentSpecialty) {
          case 'dental-sleep':
            console.log('Rendering DentalSleepWrapper');
            return <DentalSleepWrapper>{children}</DentalSleepWrapper>;
          
          case 'dental':
            console.log('Rendering DentalWrapper');
            return <DentalWrapper>{children}</DentalWrapper>;
          
          case 'chiropractic':
          default:
            console.log('Rendering ChiropracticWrapper');
            return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
        }
      })()}
    </ErrorBoundary>
  );
};
