
import React from 'react';
import { UnifiedSpecialtyWrapper } from './UnifiedSpecialtyWrapper';

interface DentalSleepWrapperProps {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'staff' | 'practice_admin' | 'platform_admin';
}

export const DentalSleepWrapper: React.FC<DentalSleepWrapperProps> = ({ 
  children, 
  requiredRole = 'staff' 
}) => {
  return (
    <UnifiedSpecialtyWrapper 
      requiredRole={requiredRole}
      allowedSpecialties={['dental-sleep']}
      fallbackSpecialty="dental-sleep"
    >
      {children}
    </UnifiedSpecialtyWrapper>
  );
};
