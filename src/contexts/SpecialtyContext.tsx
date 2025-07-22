
import React, { createContext, useContext, ReactNode } from 'react';
import { useSpecialtyTheme } from '@/hooks/useSpecialtyTheme';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';

interface SpecialtyContextType {
  specialty: string;
  currentSpecialty: string;
  setCurrentSpecialty: (specialty: string) => void;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    theme: string;
  };
  tenantConfig: any;
  config: any;
  getBrandName: () => string;
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
  const { currentTheme, specialty, switchTheme, getBrandName } = useSpecialtyTheme();

  const value: SpecialtyContextType = {
    specialty,
    currentSpecialty: specialty,
    setCurrentSpecialty: (newSpecialty: string) => {
      switchTheme(newSpecialty as any);
    },
    theme: {
      primaryColor: `hsl(${currentTheme.cssVariables.primary})`,
      secondaryColor: `hsl(${currentTheme.cssVariables.secondary})`,
      accentColor: `hsl(${currentTheme.cssVariables.accent})`,
      theme: currentTheme.name
    },
    tenantConfig: currentTenant,
    config: currentTenant,
    getBrandName
  };

  return (
    <SpecialtyContext.Provider value={value}>
      {children}
    </SpecialtyContext.Provider>
  );
};
