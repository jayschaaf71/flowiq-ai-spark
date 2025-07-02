
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useCurrentTenant, getSpecialtyTheme } from '@/utils/enhancedTenantConfig';

interface SpecialtyContextType {
  specialty: string;
  currentSpecialty: string; // Add alias
  setCurrentSpecialty: (specialty: string) => void;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    theme: string;
  };
  tenantConfig: any;
  config: any; // Add alias for compatibility
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

const specialtyBrands: Record<string, string> = {
  'chiropractic-care': 'Chiropractic IQ',
  'dental-care': 'Dental IQ', 
  'dental-sleep-medicine': 'Dental Sleep IQ',
  'appointment-scheduling': 'Appointment IQ'
};

export const SpecialtyProvider: React.FC<SpecialtyProviderProps> = ({ children }) => {
  const { currentTenant } = useCurrentTenant();
  
  const [currentSpecialty, setCurrentSpecialty] = useState(
    currentTenant?.specialty || 'chiropractic-care'
  );
  
  const theme = getSpecialtyTheme(currentSpecialty);

  const getBrandName = () => {
    return specialtyBrands[currentSpecialty] || 'Flow IQ';
  };

  const value: SpecialtyContextType = {
    specialty: currentSpecialty,
    currentSpecialty,
    setCurrentSpecialty,
    theme,
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
