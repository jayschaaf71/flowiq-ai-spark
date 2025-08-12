import { baseTheme } from './base';
import { SpecialtyTheme } from './chiropractic';

export const communicationTheme: SpecialtyTheme = {
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
        tagline: 'Smart Business Communication & Scheduling',
        icon: 'communication-icon',
        specialty: 'communication',
        keywords: ['communication', 'scheduling', 'business', 'automation']
    }
}; 