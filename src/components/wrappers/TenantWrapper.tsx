
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ChiropracticWrapper } from './ChiropracticWrapper';
import { DentalWrapper } from './DentalWrapper';
import { DentalSleepWrapper } from './DentalSleepWrapper';

interface TenantWrapperProps {
  children: React.ReactNode;
}

export const TenantWrapper: React.FC<TenantWrapperProps> = ({ children }) => {
  const location = useLocation();
  const { currentTenant } = useCurrentTenant();
  const { data: userProfile } = useUserProfile();

  // Enhanced specialty detection with route-based priority - Default to chiropractic
  const detectSpecialtyFromRoute = () => {
    const path = location.pathname;
    const userSpecificKey = `currentSpecialty_${userProfile?.id}`;
    
    // Route-based specialty detection for specific dental routes only
    if (path.includes('/agents/dental-sleep') || path.includes('/dental-sleep')) {
      localStorage.setItem('currentSpecialty', 'dental-sleep');
      localStorage.setItem(userSpecificKey, 'dental-sleep');
      return 'dental-sleep';
    }
    if (path.includes('/dental')) {
      localStorage.setItem('currentSpecialty', 'dental');
      localStorage.setItem(userSpecificKey, 'dental');
      return 'dental';
    }
    
    // Default all other routes to chiropractic
    localStorage.setItem('currentSpecialty', 'chiropractic');
    localStorage.setItem(userSpecificKey, 'chiropractic');
    return 'chiropractic';
  };

  const specialty = detectSpecialtyFromRoute();

  // Update tenant config when specialty changes
  useEffect(() => {
    console.log('TenantWrapper detected specialty:', specialty, 'from route:', location.pathname);
  }, [specialty, location.pathname]);
  
  switch (specialty) {
    case 'dental-sleep':
      return <DentalSleepWrapper>{children}</DentalSleepWrapper>;
    
    case 'dental':
      return <DentalWrapper>{children}</DentalWrapper>;
    
    case 'chiropractic':
    default:
      return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
  }
};
