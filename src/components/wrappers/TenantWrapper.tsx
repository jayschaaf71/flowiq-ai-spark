
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSpecialtyTheme } from '@/hooks/useSpecialtyTheme';
import { parseTenantFromUrl } from '@/utils/tenantRouting';
import { SpecialtyType } from '@/utils/specialtyConfig';
import { ChiropracticWrapper } from './ChiropracticWrapper';
import { DentalWrapper } from './DentalWrapper';
import { DentalSleepWrapper } from './DentalSleepWrapper';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface TenantWrapperProps {
  children: React.ReactNode;
}

export const TenantWrapper: React.FC<TenantWrapperProps> = ({ children }) => {
  const location = useLocation();
  const { switchTheme, specialty: dbSpecialty } = useSpecialtyTheme();
  
  // Phase 3: Simplified specialty detection using centralized tenant routing
  const detectCurrentSpecialty = (): SpecialtyType => {
    const tenantRoute = parseTenantFromUrl();
    
    console.log('🎨 TenantWrapper - tenantRoute:', tenantRoute, 'path:', location.pathname);
    
    if (tenantRoute) {
      // Map tenant specialty to wrapper specialty
      const specialtyMap: Record<string, SpecialtyType> = {
        'dental-sleep-medicine': 'dental-sleep',
        'chiropractic-care': 'chiropractic',
        'general-dentistry': 'dental-sleep' // Map to dental-sleep as default dental
      };
      
      const mappedSpecialty = specialtyMap[tenantRoute.specialty] || 'chiropractic';
      console.log('🎨 TenantWrapper - mapped specialty:', mappedSpecialty, 'from tenant specialty:', tenantRoute.specialty);
      return mappedSpecialty;
    }
    
    // No tenant detected from URL - use database specialty if available
    if (dbSpecialty) {
      console.log('🎨 TenantWrapper - no tenant route, using database specialty:', dbSpecialty);
      // Map database specialty to SpecialtyType
      const dbSpecialtyMap: Record<string, SpecialtyType> = {
        'dental-sleep': 'dental-sleep',
        'dental-sleep-medicine': 'dental-sleep',
        'dental': 'dental-sleep',
        'chiropractic': 'chiropractic',
        'med-spa': 'chiropractic', // Fallback for now
        'concierge': 'chiropractic', // Fallback for now  
        'hrt': 'chiropractic' // Fallback for now
      };
      return dbSpecialtyMap[dbSpecialty] || 'chiropractic';
    }
    
    // Default to chiropractic
    console.log('🎨 TenantWrapper - no tenant, defaulting to chiropractic');
    return 'chiropractic';
  };

  const currentSpecialty = detectCurrentSpecialty();

  // Apply theme when specialty changes
  useEffect(() => {
    console.log('🎨 TenantWrapper switching theme to:', currentSpecialty);
    switchTheme(currentSpecialty);
  }, [currentSpecialty, switchTheme, location.pathname]);
  
  // Render appropriate wrapper based on specialty
  const renderSpecialtyWrapper = () => {
    console.log('🎨 TenantWrapper rendering wrapper for specialty:', currentSpecialty);
    
    switch (currentSpecialty) {
      case 'dental-sleep':
        return <DentalSleepWrapper>{children}</DentalSleepWrapper>;
      case 'chiropractic':
      default:
        return <ChiropracticWrapper>{children}</ChiropracticWrapper>;
    }
  };
  
  return (
    <ErrorBoundary>
      {renderSpecialtyWrapper()}
    </ErrorBoundary>
  );
};
