
import React from 'react';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { ChiropracticWrapper } from './ChiropracticWrapper';
import { DentalWrapper } from './DentalWrapper';

interface TenantWrapperProps {
  children: React.ReactNode;
}

export const TenantWrapper: React.FC<TenantWrapperProps> = ({ children }) => {
  const currentTenant = useCurrentTenant();

  // Default fallback if no tenant is detected
  if (!currentTenant) {
    return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
  }

  // Route to appropriate specialty wrapper based on tenant specialty
  switch (currentTenant.specialty?.toLowerCase()) {
    case 'chiropractic care':
    case 'chiropractic':
      return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
    
    case 'dental care':
    case 'dental':
    case 'dental-sleep':
      return <DentalWrapper>{children}</DentalWrapper>;
    
    default:
      return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
  }
};
