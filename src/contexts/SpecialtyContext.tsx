
import React, { createContext, useContext, ReactNode } from 'react';
import { useCurrentTenant, getSpecialtyTheme } from '@/utils/enhancedTenantConfig';

interface SpecialtyContextType {
  specialty: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    theme: string;
  };
  tenantConfig: any;
}

const SpecialtyContext = createContext<SpecialtyContextType | undefined>(undefined);

export const useSpecialty = () => {
  const context = useContext(SpecialtyContext);
  if (context === undefined) {
    throw new Error('useSpecialty must be used within a SpecialtyProvider');
  }
  return context;
};

interface SpecialtyProviderProps {
  children: ReactNode;
}

export const SpecialtyProvider: React.FC<SpecialtyProviderProps> = ({ children }) => {
  const { currentTenant } = useCurrentTenant();
  
  const specialty = currentTenant?.specialty || 'chiropractic-care';
  const theme = getSpecialtyTheme(specialty);

  const value: SpecialtyContextType = {
    specialty,
    theme,
    tenantConfig: currentTenant
  };

  return (
    <SpecialtyContext.Provider value={value}>
      {children}
    </SpecialtyContext.Provider>
  );
};
