
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { SpecialtyType, SpecialtyConfig, getSpecialtyConfig } from '@/utils/specialtyConfig';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface SpecialtyContextType {
  currentSpecialty: SpecialtyType;
  config: SpecialtyConfig;
  isLoading: boolean;
}

const SpecialtyContext = createContext<SpecialtyContextType | undefined>(undefined);

interface SpecialtyProviderProps {
  children: ReactNode;
}

export const SpecialtyProvider = ({ children }: SpecialtyProviderProps) => {
  const { primaryTenant, rolesLoading } = useEnhancedAuth();
  const [currentSpecialty, setCurrentSpecialty] = useState<SpecialtyType>('chiropractic');
  const [config, setConfig] = useState<SpecialtyConfig>(() => getSpecialtyConfig('chiropractic'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rolesLoading && primaryTenant?.tenant) {
      // Set specialty based on tenant's specialty
      const tenantSpecialty = primaryTenant.tenant.specialty as SpecialtyType;
      if (tenantSpecialty && tenantSpecialty !== currentSpecialty) {
        setCurrentSpecialty(tenantSpecialty);
        setConfig(getSpecialtyConfig(tenantSpecialty));
        
        // Update CSS custom properties for theming
        const root = document.documentElement;
        const newConfig = getSpecialtyConfig(tenantSpecialty);
        root.style.setProperty('--specialty-primary', newConfig.primaryColor);
        root.style.setProperty('--specialty-secondary', newConfig.secondaryColor);
        root.style.setProperty('--specialty-accent', newConfig.accentColor);
      }
      setIsLoading(false);
    } else if (!rolesLoading && !primaryTenant) {
      // No tenant found - use default
      setIsLoading(false);
    }
  }, [primaryTenant, rolesLoading, currentSpecialty]);

  // Initialize CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--specialty-primary', config.primaryColor);
    root.style.setProperty('--specialty-secondary', config.secondaryColor);
    root.style.setProperty('--specialty-accent', config.accentColor);
  }, [config]);

  return (
    <SpecialtyContext.Provider value={{
      currentSpecialty,
      config,
      isLoading: isLoading || rolesLoading
    }}>
      {children}
    </SpecialtyContext.Provider>
  );
};

export const useSpecialty = () => {
  const context = useContext(SpecialtyContext);
  if (context === undefined) {
    throw new Error('useSpecialty must be used within a SpecialtyProvider');
  }
  return context;
};
