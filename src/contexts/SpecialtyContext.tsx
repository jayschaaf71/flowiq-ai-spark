
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
    const storedSpecialty = localStorage.getItem('currentSpecialty');
    const tenantSpecialty = currentTenant?.specialty;
    const userSpecialty = userProfile?.specialty?.toLowerCase().replace(/\s+/g, '-');
    
    console.log('detectSpecialty - storedSpecialty:', storedSpecialty);
    console.log('detectSpecialty - tenantSpecialty:', tenantSpecialty);
    console.log('detectSpecialty - userSpecialty:', userSpecialty);
    console.log('detectSpecialty - currentTenant:', currentTenant);
    
    // If tenant specialty exists and is different from stored, update localStorage
    if (tenantSpecialty && tenantSpecialty !== storedSpecialty) {
      console.log('Updating localStorage with tenant specialty:', tenantSpecialty);
      localStorage.setItem('currentSpecialty', tenantSpecialty);
      return tenantSpecialty;
    }
    
    // Check localStorage first (highest priority - set by TenantWrapper)
    if (storedSpecialty) {
      return storedSpecialty;
    }
    
    // Prioritize current tenant specialty over user profile
    if (tenantSpecialty) {
      localStorage.setItem('currentSpecialty', tenantSpecialty);
      return tenantSpecialty;
    }
    
    // Fall back to user profile specialty
    if (userSpecialty) {
      return userSpecialty;
    }
    
    // Default to chiropractic
    return 'chiropractic-care';
  };
  
  const effectiveSpecialty = detectSpecialty();
  const [currentSpecialty, setCurrentSpecialty] = useState(effectiveSpecialty);
  
  const theme = getSpecialtyTheme(effectiveSpecialty);

  const getBrandName = () => {
    console.log('getBrandName - effectiveSpecialty:', effectiveSpecialty);
    console.log('getBrandName - specialtyBrands mapping:', specialtyBrands[effectiveSpecialty]);
    console.log('getBrandName - all specialtyBrands:', specialtyBrands);
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
