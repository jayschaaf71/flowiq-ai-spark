
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

  // Enhanced specialty detection with route-based priority
  const detectSpecialtyFromRoute = () => {
    const path = location.pathname;
    
    // Route-based specialty detection (highest priority)
    if (path.includes('/agents/dental-sleep') || path.includes('/dental-sleep')) {
      const userSpecificKey = `currentSpecialty_${userProfile?.id}`;
      localStorage.setItem('currentSpecialty', 'dental-sleep');
      localStorage.setItem(userSpecificKey, 'dental-sleep');
      return 'dental-sleep';
    }
    if (path.includes('/dental')) {
      const userSpecificKey = `currentSpecialty_${userProfile?.id}`;
      localStorage.setItem('currentSpecialty', 'dental');
      localStorage.setItem(userSpecificKey, 'dental');
      return 'dental';
    }
    if (path.includes('/chiropractic') || path.includes('/chiro')) {
      const userSpecificKey = `currentSpecialty_${userProfile?.id}`;
      localStorage.setItem('currentSpecialty', 'chiropractic');
      localStorage.setItem(userSpecificKey, 'chiropractic');
      return 'chiropractic';
    }
    
    // Check persistent storage (both keys for compatibility)
    const userSpecificKey = `currentSpecialty_${userProfile?.id}`;
    const storedSpecialty = localStorage.getItem(userSpecificKey) || localStorage.getItem('currentSpecialty');
    if (storedSpecialty) {
      // Sync both keys
      localStorage.setItem('currentSpecialty', storedSpecialty);
      localStorage.setItem(userSpecificKey, storedSpecialty);
      return storedSpecialty;
    }
    
    // Use user's profile specialty if available
    const userSpecialty = userProfile?.specialty;
    if (userSpecialty) {
      const normalizedSpecialty = userSpecialty.toLowerCase().replace(/\s+/g, '-');
      localStorage.setItem('currentSpecialty', normalizedSpecialty);
      localStorage.setItem(userSpecificKey, normalizedSpecialty);
      return normalizedSpecialty;
    }
    
    // Fall back to tenant specialty
    const tenantSpecialty = currentTenant?.specialty;
    if (tenantSpecialty) {
      const normalizedSpecialty = tenantSpecialty.toLowerCase().replace(/\s+/g, '-');
      localStorage.setItem('currentSpecialty', normalizedSpecialty);
      localStorage.setItem(userSpecificKey, normalizedSpecialty);
      return normalizedSpecialty;
    }
    
    // Default to chiropractic
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
    case 'chiropractic-care':
    case 'chiropractic':
      return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
    
    case 'dental-care':
    case 'dental':
    case 'dentistry':
      return <DentalWrapper>{children}</DentalWrapper>;
    
    case 'dental-sleep-medicine':
    case 'dental-sleep':
      return <DentalSleepWrapper>{children}</DentalSleepWrapper>;
    
    default:
      return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
  }
};
