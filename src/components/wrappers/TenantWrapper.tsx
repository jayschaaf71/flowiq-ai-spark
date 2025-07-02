
import React from 'react';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ChiropracticWrapper } from './ChiropracticWrapper';
import { DentalWrapper } from './DentalWrapper';
import { DentalSleepWrapper } from './DentalSleepWrapper';

interface TenantWrapperProps {
  children: React.ReactNode;
}

export const TenantWrapper: React.FC<TenantWrapperProps> = ({ children }) => {
  const { currentTenant } = useCurrentTenant();
  const { data: userProfile } = useUserProfile();

  // Use user's profile specialty if available, otherwise fall back to tenant specialty
  const userSpecialty = userProfile?.specialty;
  const tenantSpecialty = currentTenant?.specialty;
  
  // Normalize specialty string and route to appropriate wrapper
  // Priority: user profile specialty > tenant specialty > default
  let specialty = '';
  if (userSpecialty) {
    specialty = userSpecialty.toLowerCase().replace(/\s+/g, '-');
  } else if (tenantSpecialty) {
    specialty = tenantSpecialty.toLowerCase().replace(/\s+/g, '-');
  } else {
    specialty = 'chiropractic';
  }
  
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
