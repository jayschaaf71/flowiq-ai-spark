
import { SpecialtyTheme, SpecialtyType } from '@/types/specialty-themes';

export const SPECIALTY_THEMES: Record<SpecialtyType, SpecialtyTheme> = {
  chiropractic: {
    name: 'chiropractic',
    displayName: 'ChiroIQ',
    brandName: 'ChiroIQ',
    features: ['spinal-adjustments', 'physical-therapy', 'pain-management'],
    cssVariables: {
      primary: '142 60% 42%',
      primaryForeground: '0 0% 98%',
      secondary: '142 52% 54%',
      secondaryForeground: '142 10% 10%',
      accent: '142 76% 91%',
      accentForeground: '142 10% 10%',
      muted: '142 30% 95%',
      mutedForeground: '142 5% 45%',
      border: '142 30% 82%',
      card: '0 0% 100%',
      cardForeground: '142 10% 10%',
    }
  },
  dental: {
    name: 'dental',
    displayName: 'DentalIQ',
    brandName: 'DentalIQ',
    features: ['cleanings', 'fillings', 'crowns', 'oral-surgery'],
    cssVariables: {
      primary: '198 89% 48%',
      primaryForeground: '0 0% 98%',
      secondary: '198 93% 60%',
      secondaryForeground: '198 10% 10%',
      accent: '198 100% 91%',
      accentForeground: '198 10% 10%',
      muted: '198 30% 95%',
      mutedForeground: '198 5% 45%',
      border: '198 30% 82%',
      card: '0 0% 100%',
      cardForeground: '198 10% 10%',
    }
  },
  'dental-sleep': {
    name: 'dental-sleep',
    displayName: 'DentalSleepIQ',
    brandName: 'DentalSleepIQ',
    features: ['sleep-studies', 'oral-appliances', 'titration', 'follow-up'],
    cssVariables: {
      primary: '258 92% 66%',
      primaryForeground: '0 0% 98%',
      secondary: '258 90% 76%',
      secondaryForeground: '258 10% 10%',
      accent: '258 100% 94%',
      accentForeground: '258 10% 10%',
      muted: '258 30% 95%',
      mutedForeground: '258 5% 45%',
      border: '258 30% 82%',
      card: '0 0% 100%',
      cardForeground: '258 10% 10%',
    }
  },
  'med-spa': {
    name: 'med-spa',
    displayName: 'AestheticIQ',
    brandName: 'AestheticIQ',
    features: ['cosmetic-procedures', 'wellness', 'aesthetic-treatments'],
    cssVariables: {
      primary: '320 85% 60%',
      primaryForeground: '0 0% 98%',
      secondary: '320 70% 75%',
      secondaryForeground: '320 10% 10%',
      accent: '320 100% 96%',
      accentForeground: '320 10% 10%',
      muted: '320 30% 95%',
      mutedForeground: '320 5% 45%',
      border: '320 30% 82%',
      card: '0 0% 100%',
      cardForeground: '320 10% 10%',
    }
  },
  concierge: {
    name: 'concierge',
    displayName: 'ConciergeIQ',
    brandName: 'ConciergeIQ',
    features: ['concierge-services', 'premium-care', 'personalized-medicine'],
    cssVariables: {
      primary: '280 85% 60%',
      primaryForeground: '0 0% 98%',
      secondary: '280 70% 75%',
      secondaryForeground: '280 10% 10%',
      accent: '280 100% 96%',
      accentForeground: '280 10% 10%',
      muted: '280 30% 95%',
      mutedForeground: '280 5% 45%',
      border: '280 30% 82%',
      card: '0 0% 100%',
      cardForeground: '280 10% 10%',
    }
  },
  hrt: {
    name: 'hrt',
    displayName: 'HormoneIQ',
    brandName: 'HormoneIQ',
    features: ['hormone-therapy', 'wellness-optimization', 'lab-monitoring'],
    cssVariables: {
      primary: '15 85% 60%',
      primaryForeground: '0 0% 98%',
      secondary: '15 70% 75%',
      secondaryForeground: '15 10% 10%',
      accent: '15 100% 96%',
      accentForeground: '15 10% 10%',
      muted: '15 30% 95%',
      mutedForeground: '15 5% 45%',
      border: '15 30% 82%',
      card: '0 0% 100%',
      cardForeground: '15 10% 10%',
    }
  }
};

export const getSpecialtyTheme = (specialty: string): SpecialtyTheme => {
  const normalizedSpecialty = specialty?.toLowerCase().replace(/[_\s]/g, '-') as SpecialtyType;
  return SPECIALTY_THEMES[normalizedSpecialty] || SPECIALTY_THEMES.chiropractic;
};

export const applyThemeVariables = (theme: SpecialtyTheme) => {
  const root = document.documentElement;
  Object.entries(theme.cssVariables).forEach(([key, value]) => {
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });
};
