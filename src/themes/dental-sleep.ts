import { baseTheme } from './base';
import { SpecialtyTheme } from './chiropractic';

export const dentalSleepTheme: SpecialtyTheme = {
    ...baseTheme,
    colors: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#c084fc',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    },
    branding: {
        tagline: 'Advanced Sleep Medicine Solutions',
        icon: 'sleep-icon',
        specialty: 'dental-sleep-medicine',
        keywords: ['sleep', 'breathing', 'comfort', 'rest', 'cpap']
    }
}; 