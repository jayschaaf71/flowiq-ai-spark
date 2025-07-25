
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
  const [detectedSpecialty, setDetectedSpecialty] = useState<SpecialtyType>('chiropractic');

  const detectSpecialty = (): SpecialtyType => {
    const path = window.location.pathname;
    console.log('🎨 [THEME DIAGNOSTIC] detectSpecialty - checking path:', path, 'tenant:', currentTenant?.specialty);
    
    // Priority 1: URL-based detection (ABSOLUTE PRIORITY - overrides everything)
    if (path.includes('/dental-sleep')) {
      console.log('✅ [THEME DIAGNOSTIC] URL detected: dental-sleep (ABSOLUTE PRIORITY)');
      return 'dental-sleep';
    }
    if (path.includes('/chiropractic') || path.includes('chiropractic-care')) {
      console.log('✅ [THEME DIAGNOSTIC] URL detected: chiropractic (ABSOLUTE PRIORITY)');
      return 'chiropractic';
    }
    if (path.includes('/dental')) {
      console.log('✅ URL detected: dental');
      return 'dental';
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

    // Priority 2: Enhanced tenant config specialty (with exact mapping)
    if (currentTenant?.specialty) {
      const tenantSpecialty = currentTenant.specialty;
      console.log('🏢 [THEME DIAGNOSTIC] Tenant specialty from enhancedTenantConfig:', tenantSpecialty);
      console.log('⚠️ [THEME DIAGNOSTIC] WARNING: Tenant specialty may conflict with URL path!');
      console.log('🔍 [THEME DIAGNOSTIC] Path says:', path.includes('/chiropractic') ? 'chiropractic' : 'other');
      console.log('🏢 [THEME DIAGNOSTIC] Tenant says:', tenantSpecialty);
      
      // Map enhanced tenant config specialty names to theme names
      if (tenantSpecialty === 'dental-sleep-medicine') {
        console.log('🎨 [THEME DIAGNOSTIC] Mapped dental-sleep-medicine → dental-sleep');
        return 'dental-sleep';
      }
      if (tenantSpecialty === 'chiropractic-care') {
        console.log('🎨 [THEME DIAGNOSTIC] Mapped chiropractic-care → chiropractic');
        return 'chiropractic';
      }
      if (tenantSpecialty === 'dental-care') {
        console.log('🎨 [THEME DIAGNOSTIC] Mapped dental-care → dental');
        return 'dental';
      }
      if (tenantSpecialty === 'medical-spa') {
        console.log('🎨 [THEME DIAGNOSTIC] Mapped medical-spa → med-spa');
        return 'med-spa';
      }
      
      // Direct match for simple names
      console.log('🎨 [THEME DIAGNOSTIC] Using direct match for:', tenantSpecialty);
      return tenantSpecialty as SpecialtyType;
    }

    // Priority 3: localStorage
    const stored = localStorage.getItem('currentSpecialty') as SpecialtyType;
    if (stored) {
      console.log('💾 localStorage specialty:', stored);
      return stored;
    }

    // Priority 4: User profile specialty
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
    setDetectedSpecialty(specialty);
    
    console.log('🎨 Applied specialty theme:', specialty, 'Theme name:', theme.name);
    console.log('🎨 Theme variables applied:', theme.cssVariables);
  }, [currentTenant, userProfile]);

  const switchTheme = (specialty: SpecialtyType) => {
    const theme = getSpecialtyTheme(specialty);
    localStorage.setItem('currentSpecialty', specialty);
    applyThemeVariables(theme);
    setCurrentTheme(theme);
    setDetectedSpecialty(specialty);
  };

  return {
    currentTheme,
    specialty: detectedSpecialty,
    switchTheme,
    getBrandName: () => currentTheme.brandName
  };
};
