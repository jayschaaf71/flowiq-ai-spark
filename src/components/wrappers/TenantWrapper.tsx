
import React from 'react';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { ChiropracticWrapper } from './ChiropracticWrapper';
import { DentalWrapper } from './DentalWrapper';
import { DentalSleepWrapper } from './DentalSleepWrapper';

interface TenantWrapperProps {
  children: React.ReactNode;
}

export const TenantWrapper: React.FC<TenantWrapperProps> = ({ children }) => {
  const { currentTenant } = useCurrentTenant();

  // Default fallback if no tenant is detected
  if (!currentTenant) {
    return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
  }

  // Normalize specialty string and route to appropriate wrapper
  const specialty = currentTenant?.specialty?.toLowerCase().replace(/\s+/g, '-');
  
  switch (specialty) {
    case 'chiropractic-care':
    case 'chiropractic':
      return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
    
    case 'dental-care':
    case 'dental':
      return <DentalWrapper>{children}</DentalWrapper>;
    
    case 'dental-sleep-medicine':
    case 'dental-sleep':
      return <DentalSleepWrapper>{children}</DentalSleepWrapper>;
    
    default:
      return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
  }
};
