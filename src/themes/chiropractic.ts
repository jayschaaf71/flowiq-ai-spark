import { baseTheme, BaseTheme } from './base';

export interface SpecialtyTheme extends BaseTheme {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        success: string;
        warning: string;
        error: string;
    };
    branding: {
        tagline: string;
        icon: string;
        specialty: string;
        keywords: string[];
    };
}

export const chiropracticTheme: SpecialtyTheme = {
    ...baseTheme,
    colors: {
        primary: '#16a34a',
        secondary: '#22c55e',
        accent: '#4ade80',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    },
    branding: {
        tagline: 'Expert Chiropractic Care for Optimal Spinal Health',
        icon: 'spine-icon',
        specialty: 'chiropractic-care',
        keywords: ['spine', 'wellness', 'alignment', 'health', 'chiropractic']
    }
}; 