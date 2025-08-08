
import { useState, useEffect } from 'react';
import { SpecialtyTheme } from '@/types/specialty-themes';
import { SpecialtyType } from '@/utils/specialtyConfig';
import { getSpecialtyTheme, applyThemeVariables } from '@/config/specialty-themes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { detectSpecialty, getBrandName, persistSpecialtyDetection } from '@/utils/unifiedSpecialtyDetection';

export const useSpecialtyTheme = () => {
  const { currentTenant } = useCurrentTenant();
  const { data: userProfile } = useUserProfile();
  const [currentTheme, setCurrentTheme] = useState<SpecialtyTheme>(() =>
    getSpecialtyTheme('chiropractic')
  );
  const [detectedSpecialty, setDetectedSpecialty] = useState<SpecialtyType>('chiropractic');

  /**
   * Phase 2: Use unified specialty detection system
   */
  const detectSpecialtyUnified = (): SpecialtyType => {
    console.log('🎯 Theme Detection - currentTenant:', currentTenant, 'userProfile:', userProfile);

    const detectionResult = detectSpecialty(userProfile, window.location.pathname);

    console.log('🎯 Unified detection result:', detectionResult);

    // Persist the detection result for consistency
    persistSpecialtyDetection(detectionResult);

    return detectionResult.specialty;
  };

  useEffect(() => {
    const specialty = detectSpecialtyUnified();
    const theme = getSpecialtyTheme(specialty);

    console.log('🎨 useSpecialtyTheme - detected specialty:', specialty);
    console.log('🎨 useSpecialtyTheme - theme name:', theme.name);
    console.log('🎨 useSpecialtyTheme - theme cssVariables:', theme.cssVariables);
    console.log('🎨 useSpecialtyTheme - hostname:', window.location.hostname);
    console.log('🎨 useSpecialtyTheme - pathname:', window.location.pathname);

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

    // Persist the manual selection
    persistSpecialtyDetection({
      specialty,
      source: 'manual',
      confidence: 'high',
      isProduction: false
    });

    applyThemeVariables(theme);
    setCurrentTheme(theme);
    setDetectedSpecialty(specialty);
  };

  const getBrandNameThemed = (): string => {
    const detectionResult = detectSpecialty(userProfile, window.location.pathname);
    return getBrandName(detectionResult);
  };

  return {
    currentTheme,
    specialty: detectedSpecialty,
    switchTheme,
    getBrandName: getBrandNameThemed
  };
};
