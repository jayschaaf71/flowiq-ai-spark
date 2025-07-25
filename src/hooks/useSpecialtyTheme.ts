
import { useState, useEffect } from 'react';
import { SpecialtyTheme, SpecialtyType } from '@/types/specialty-themes';
import { getSpecialtyTheme, applyThemeVariables } from '@/config/specialty-themes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';

export const useSpecialtyTheme = () => {
  const { currentTenant } = useCurrentTenant();
  const { data: userProfile } = useUserProfile();
  const [currentTheme, setCurrentTheme] = useState<SpecialtyTheme>(() => 
    getSpecialtyTheme('chiropractic')
  );

  const detectSpecialty = (): SpecialtyType => {
    console.log('detectSpecialty - checking path:', window.location.pathname, 'tenant:', currentTenant?.specialty);
    
    // Priority 1: For production tenants, use tenant specialty first
    if (currentTenant?.specialty && window.location.hostname !== 'localhost') {
      const tenantSpecialty = currentTenant.specialty;
      if (tenantSpecialty === 'dental-sleep-medicine') return 'dental-sleep';
      if (tenantSpecialty === 'chiropractic-care') return 'chiropractic';
      if (tenantSpecialty === 'general-dentistry') return 'dental';
      return tenantSpecialty as SpecialtyType;
    }
    
    // Priority 2: URL-based detection (for development)
    const path = window.location.pathname;
    if (path.includes('/dental-sleep')) return 'dental-sleep';
    if (path.includes('/dental')) return 'dental';
    if (path.includes('/med-spa') || path.includes('/medspa')) return 'med-spa';
    if (path.includes('/concierge')) return 'concierge';
    if (path.includes('/hrt')) return 'hrt';
    if (path.includes('/chiropractic')) return 'chiropractic';

    // Priority 3: localStorage
    const stored = localStorage.getItem('currentSpecialty') as SpecialtyType;
    if (stored && stored in getSpecialtyTheme) return stored;

    // Priority 4: Tenant specialty (fallback)
    if (currentTenant?.specialty) {
      const tenantSpecialty = currentTenant.specialty;
      if (tenantSpecialty === 'dental-sleep-medicine') return 'dental-sleep';
      if (tenantSpecialty === 'chiropractic-care') return 'chiropractic';
      if (tenantSpecialty === 'general-dentistry') return 'dental';
      return tenantSpecialty as SpecialtyType;
    }

    // Priority 5: User profile specialty
    if (userProfile?.specialty) {
      return userProfile.specialty.toLowerCase().replace(/\s+/g, '-') as SpecialtyType;
    }

    // Default
    return 'chiropractic';
  };

  useEffect(() => {
    const specialty = detectSpecialty();
    const theme = getSpecialtyTheme(specialty);
    
    // Store the current specialty
    localStorage.setItem('currentSpecialty', specialty);
    
    // Apply theme variables to CSS
    applyThemeVariables(theme);
    
    // Update state
    setCurrentTheme(theme);
    
    console.log('Applied specialty theme:', specialty, theme);
  }, [currentTenant, userProfile]);

  const switchTheme = (specialty: SpecialtyType) => {
    const theme = getSpecialtyTheme(specialty);
    localStorage.setItem('currentSpecialty', specialty);
    applyThemeVariables(theme);
    setCurrentTheme(theme);
  };

  return {
    currentTheme,
    specialty: currentTheme.name as SpecialtyType,
    switchTheme,
    getBrandName: () => currentTheme.brandName
  };
};
