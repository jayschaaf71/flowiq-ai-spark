
import React from 'react';
import { UnifiedSpecialtyWrapper } from './UnifiedSpecialtyWrapper';

interface DentalWrapperProps {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'staff' | 'practice_admin' | 'platform_admin';
}

export const DentalWrapper: React.FC<DentalWrapperProps> = ({ 
  children, 
  requiredRole = 'staff' 
}) => {
  return (
    <UnifiedSpecialtyWrapper 
      requiredRole={requiredRole}
      allowedSpecialties={['dental']}
      fallbackSpecialty="dental"
    >
      {children}
    </UnifiedSpecialtyWrapper>
  );
};
