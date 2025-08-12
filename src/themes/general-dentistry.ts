import { baseTheme } from './base';
import { SpecialtyTheme } from './chiropractic';

export const generalDentistryTheme: SpecialtyTheme = {
    ...baseTheme,
    colors: {
        primary: '#0ea5e9',
        secondary: '#38bdf8',
        accent: '#7dd3fc',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    },
    branding: {
        tagline: 'Comprehensive Dental Care Excellence',
        icon: 'dental-icon',
        specialty: 'general-dentistry',
        keywords: ['dental', 'oral-health', 'hygiene', 'preventive-care']
    }
}; 