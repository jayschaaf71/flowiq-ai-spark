
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useCurrentTenant, getSpecialtyTheme } from '@/utils/enhancedTenantConfig';
import { useUserProfile } from '@/hooks/useUserProfile';

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
  'chiropractic': 'Chiropractic IQ',
  'dental-care': 'Dental IQ', 
  'dental': 'Dental IQ',
  'dentistry': 'Dental IQ',
  'dental-sleep-medicine': 'Dental Sleep IQ',
  'dental-sleep': 'Dental Sleep IQ',
  'appointment-scheduling': 'Appointment IQ'
};

export const SpecialtyProvider: React.FC<SpecialtyProviderProps> = ({ children }) => {
  const { currentTenant } = useCurrentTenant();
  const { data: userProfile } = useUserProfile();
  
  // Detect specialty from current tenant first, then fallback to other sources
  const detectSpecialty = () => {
    // Check localStorage first (highest priority - set by TenantWrapper)
    const storedSpecialty = localStorage.getItem('currentSpecialty');
    if (storedSpecialty) {
      return storedSpecialty;
    }
    
    // Prioritize current tenant specialty over user profile
    if (currentTenant?.specialty) {
      return currentTenant.specialty;
    }
    
    // Fall back to user profile specialty
    if (userProfile?.specialty) {
      return userProfile.specialty.toLowerCase().replace(/\s+/g, '-');
    }
    
    // Default to chiropractic
    return 'chiropractic-care';
  };
  
  const effectiveSpecialty = detectSpecialty();
  const [currentSpecialty, setCurrentSpecialty] = useState(effectiveSpecialty);
  
  const theme = getSpecialtyTheme(effectiveSpecialty);

  const getBrandName = () => {
    return specialtyBrands[effectiveSpecialty] || 'Flow IQ';
  };

  const value: SpecialtyContextType = {
    specialty: effectiveSpecialty,
    currentSpecialty: effectiveSpecialty,
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
