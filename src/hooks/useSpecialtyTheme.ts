
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
    const path = window.location.pathname;
    console.log('🔍 detectSpecialty - checking path:', path, 'tenant:', currentTenant?.specialty);
    
    // Priority 1: URL-based detection (matches TenantWrapper logic)
    if (path.includes('/dental-sleep-medicine') || path.includes('/dental-sleep')) {
      console.log('✅ URL detected: dental-sleep');
      return 'dental-sleep';
    }
    if (path.includes('/chiropractic-care') || path.includes('/chiropractic')) {
      console.log('✅ URL detected: chiropractic');
      return 'chiropractic';
    }
    if (path.includes('/dental')) {
      console.log('✅ URL detected: dental (mapped to dental-sleep)');
      return 'dental-sleep';
    }
    if (path.includes('/med-spa') || path.includes('/medspa')) {
      console.log('✅ URL detected: med-spa');
      return 'med-spa';
    }
    if (path.includes('/concierge')) {
      console.log('✅ URL detected: concierge');
      return 'concierge';
    }
    if (path.includes('/hrt')) {
      console.log('✅ URL detected: hrt');
      return 'hrt';
    }

    // Priority 2: For production tenants, use tenant specialty
    if (currentTenant?.specialty && window.location.hostname !== 'localhost') {
      const tenantSpecialty = currentTenant.specialty;
      console.log('🏢 Production tenant specialty:', tenantSpecialty);
      if (tenantSpecialty === 'dental-sleep-medicine') return 'dental-sleep';
      if (tenantSpecialty === 'chiropractic-care') return 'chiropractic';
      if (tenantSpecialty === 'general-dentistry') return 'dental-sleep';
      return tenantSpecialty as SpecialtyType;
    }

    // Priority 3: localStorage
    const stored = localStorage.getItem('currentSpecialty') as SpecialtyType;
    if (stored) {
      console.log('💾 localStorage specialty:', stored);
      return stored;
    }

    // Priority 4: Tenant specialty (fallback)
    if (currentTenant?.specialty) {
      const tenantSpecialty = currentTenant.specialty;
      console.log('🏢 Fallback tenant specialty:', tenantSpecialty);
      if (tenantSpecialty === 'dental-sleep-medicine') return 'dental-sleep';
      if (tenantSpecialty === 'chiropractic-care') return 'chiropractic';
      if (tenantSpecialty === 'general-dentistry') return 'dental-sleep';
      return tenantSpecialty as SpecialtyType;
    }

    // Priority 5: User profile specialty
    if (userProfile?.specialty) {
      const profileSpecialty = userProfile.specialty.toLowerCase().replace(/\s+/g, '-') as SpecialtyType;
      console.log('👤 User profile specialty:', profileSpecialty);
      return profileSpecialty;
    }

    // Default
    console.log('⚠️ Using default specialty: chiropractic');
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
    
    console.log('🎨 Applied specialty theme:', specialty, 'Theme name:', theme.name);
    console.log('🎨 Theme variables applied:', theme.cssVariables);
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
