import React from 'react';
import { SpecialtyProvider } from '@/contexts/SpecialtyContext';

interface SpecialtyWrapperProps {
  specialty: string;
  children: React.ReactNode;
}

export const SpecialtyWrapper: React.FC<SpecialtyWrapperProps> = ({ 
  specialty, 
  children 
}) => {
  return (
    <SpecialtyProvider>
      {children}
    </SpecialtyProvider>
  );
};