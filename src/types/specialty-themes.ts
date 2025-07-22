
export interface SpecialtyTheme {
  name: string;
  displayName: string;
  cssVariables: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    card: string;
    cardForeground: string;
  };
  features: string[];
  brandName: string;
}

export type SpecialtyType = 'chiropractic' | 'dental' | 'dental-sleep' | 'med-spa' | 'concierge' | 'hrt';
