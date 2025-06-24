
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { SpecialtyType, SpecialtyConfig, getSpecialtyConfig, detectSpecialty } from '@/utils/specialtyConfig';

interface SpecialtyContextType {
  currentSpecialty: SpecialtyType;
  config: SpecialtyConfig;
  switchSpecialty: (specialty: SpecialtyType) => void;
}

const SpecialtyContext = createContext<SpecialtyContextType | undefined>(undefined);

interface SpecialtyProviderProps {
  children: ReactNode;
}

export const SpecialtyProvider = ({ children }: SpecialtyProviderProps) => {
  const [currentSpecialty, setCurrentSpecialty] = useState<SpecialtyType>(() => detectSpecialty());
  const [config, setConfig] = useState<SpecialtyConfig>(() => getSpecialtyConfig(detectSpecialty()));

  const switchSpecialty = (specialty: SpecialtyType) => {
    setCurrentSpecialty(specialty);
    setConfig(getSpecialtyConfig(specialty));
    
    // Update CSS custom properties for theming
    const root = document.documentElement;
    const newConfig = getSpecialtyConfig(specialty);
    root.style.setProperty('--specialty-primary', newConfig.primaryColor);
    root.style.setProperty('--specialty-secondary', newConfig.secondaryColor);
    root.style.setProperty('--specialty-accent', newConfig.accentColor);
  };

  useEffect(() => {
    // Initialize CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--specialty-primary', config.primaryColor);
    root.style.setProperty('--specialty-secondary', config.secondaryColor);
    root.style.setProperty('--specialty-accent', config.accentColor);
  }, [config]);

  return (
    <SpecialtyContext.Provider value={{
      currentSpecialty,
      config,
      switchSpecialty
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
