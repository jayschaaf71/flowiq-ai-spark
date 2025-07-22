
import React from 'react';
import { UnifiedSpecialtyWrapper } from './UnifiedSpecialtyWrapper';

interface ChiropracticWrapperProps {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'staff' | 'practice_admin' | 'platform_admin';
}

export const ChiropracticWrapper: React.FC<ChiropracticWrapperProps> = ({ 
  children, 
  requiredRole = 'staff' 
}) => {
  return (
    <UnifiedSpecialtyWrapper 
      requiredRole={requiredRole}
      allowedSpecialties={['chiropractic']}
      fallbackSpecialty="chiropractic"
    >
      {children}
    </UnifiedSpecialtyWrapper>
  );
};
