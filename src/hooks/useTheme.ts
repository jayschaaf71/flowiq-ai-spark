import { useMemo } from 'react';
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { chiropracticTheme } from '@/themes/chiropractic';
import { dentalSleepTheme } from '@/themes/dental-sleep';
import { communicationTheme } from '@/themes/communication';
import { generalDentistryTheme } from '@/themes/general-dentistry';
import { SpecialtyTheme } from '@/themes/chiropractic';

export const useTheme = () => {
    const { specialty } = useSpecialty();

    const theme = useMemo((): SpecialtyTheme => {
        switch (specialty) {
            case 'chiropractic-care':
            case 'chiropractic':
                return chiropracticTheme;
            case 'dental-sleep-medicine':
            case 'dental-sleep':
                return dentalSleepTheme;
            case 'communication':
                return communicationTheme;
            case 'general-dentistry':
                return generalDentistryTheme;
            default:
                return chiropracticTheme; // Default fallback
        }
    }, [specialty]);

    return {
        theme,
        colors: theme.colors,
        branding: theme.branding,
        layout: theme.layout,
        typography: theme.typography,
        components: theme.components
    };
}; 