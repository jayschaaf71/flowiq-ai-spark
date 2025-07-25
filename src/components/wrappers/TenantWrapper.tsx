
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
      return 'dental-sleep';
    }
    if (path.includes('/dental')) {
      return 'dental';
    }
    if (path.includes('/chiropractic') || 
        path.startsWith('/dashboard') || 
        path.startsWith('/schedule') || 
        path.startsWith('/calendar') ||
        path.startsWith('/analytics') ||
        path.startsWith('/ehr') ||
        path.startsWith('/patient-management') ||
        path.startsWith('/financial') ||
        path.startsWith('/patient-experience') ||
        path.startsWith('/ai-automation') ||
        path.startsWith('/team') ||
        path.startsWith('/checkin') ||
        path.startsWith('/insights') ||
        path.startsWith('/notifications') ||
        path.startsWith('/help') ||
        path.startsWith('/settings') ||
        path.startsWith('/agents/')) {
      return 'chiropractic';
    }
    
    // Default to current specialty from theme hook
    return specialty;
  };

  const currentSpecialty = detectSpecialtyFromRoute();

  // Update theme when route changes
  useEffect(() => {
    const path = location.pathname;
    let targetSpecialty = null;
    
    if (path.includes('/agents/dental-sleep') || path.includes('/dental-sleep')) {
      targetSpecialty = 'dental-sleep';
    } else if (path.includes('/dental')) {
      targetSpecialty = 'dental';
    } else if (path.includes('/chiropractic') || 
               path.startsWith('/dashboard') || 
               path.startsWith('/schedule') || 
               path.startsWith('/calendar') ||
               path.startsWith('/analytics') ||
               path.startsWith('/ehr') ||
               path.startsWith('/patient-management') ||
               path.startsWith('/financial') ||
               path.startsWith('/patient-experience') ||
               path.startsWith('/ai-automation') ||
               path.startsWith('/team') ||
               path.startsWith('/checkin') ||
               path.startsWith('/insights') ||
               path.startsWith('/notifications') ||
               path.startsWith('/help') ||
               path.startsWith('/settings') ||
               path.startsWith('/agents/')) {
      targetSpecialty = 'chiropractic';
    }
    
    if (targetSpecialty && targetSpecialty !== specialty) {
      switchTheme(targetSpecialty);
    }
    
    console.log('TenantWrapper detected specialty:', currentSpecialty, 'from route:', location.pathname);
  }, [location.pathname, specialty, switchTheme]);
  
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
