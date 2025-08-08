import { useSpecialtyTheme } from '@/hooks/useSpecialtyTheme';

// Convert HSL to hex for theme colors
export const hslToHex = (hsl: string): string => {
    if (!hsl) return '#8b5cf6'; // fallback purple

    try {
        // Parse HSL values, handling percentage symbols
        const parts = hsl.split(' ');
        const h = parseInt(parts[0]);
        const s = parseInt(parts[1].replace('%', ''));
        const l = parseInt(parts[2].replace('%', ''));

        // Validate inputs
        if (isNaN(h) || isNaN(s) || isNaN(l)) {
            console.warn('Invalid HSL values:', hsl);
            return '#8b5cf6'; // fallback purple
        }

        const hue = h / 360;
        const saturation = s / 100;
        const lightness = l / 100;

        const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const x = c * (1 - Math.abs((hue * 6) % 2 - 1));
        const m = lightness - c / 2;

        let r = 0, g = 0, b = 0;

        if (hue < 1 / 6) {
            r = c; g = x; b = 0;
        } else if (hue < 2 / 6) {
            r = x; g = c; b = 0;
        } else if (hue < 3 / 6) {
            r = 0; g = c; b = x;
        } else if (hue < 4 / 6) {
            r = 0; g = x; b = c;
        } else if (hue < 5 / 6) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        const toHex = (n: number) => {
            const value = Math.round((n + m) * 255);
            const hex = value.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } catch (error) {
        console.error('Error converting HSL to hex:', error, 'HSL:', hsl);
        return '#8b5cf6'; // fallback purple
    }
};

// Hook to get theme colors
export const useThemeColors = () => {
    const { currentTheme } = useSpecialtyTheme();

    const primaryColor = currentTheme?.cssVariables?.primary ?
        hslToHex(currentTheme.cssVariables.primary) : '#8b5cf6';
    const secondaryColor = currentTheme?.cssVariables?.secondary ?
        hslToHex(currentTheme.cssVariables.secondary) : '#a78bfa';

    return {
        primary: primaryColor,
        secondary: secondaryColor,
        primaryHex: primaryColor.replace('#', ''),
        secondaryHex: secondaryColor.replace('#', '')
    };
};

// Function to get gradient classes from theme colors
export const getThemeGradient = () => {
    const { primary, secondary } = useThemeColors();
    return `from-[${primary}] to-[${secondary}] hover:from-[${primary}] hover:to-[${secondary}]`;
};

// Function to get background color classes from theme
export const getThemeBackground = () => {
    const { primary } = useThemeColors();
    return `bg-[${primary}]`;
};

// Function to get text color classes from theme
export const getThemeTextColor = () => {
    const { primary } = useThemeColors();
    return `text-[${primary}]`;
};

// Function to get border color classes from theme
export const getThemeBorderColor = () => {
    const { primary } = useThemeColors();
    return `border-[${primary}]`;
};

// Function to get theme-based color classes that work with Tailwind
export const getThemeColorClasses = () => {
    const { currentTheme } = useSpecialtyTheme();

    // Map theme to Tailwind color classes
    const themeName = currentTheme?.name || 'default';

    switch (themeName) {
        case 'chiropractic':
            return {
                primary: 'text-green-600',
                primaryBg: 'bg-green-600',
                primaryBorder: 'border-green-600',
                primaryGradient: 'from-green-500 to-emerald-600',
                secondary: 'text-emerald-600',
                secondaryBg: 'bg-emerald-600',
                secondaryBorder: 'border-emerald-600',
                lightBg: 'bg-green-50',
                lightBorder: 'border-green-200',
                hoverBg: 'hover:bg-green-50',
                hoverBorder: 'hover:border-green-200'
            };
        case 'dental-sleep':
            return {
                primary: 'text-purple-600',
                primaryBg: 'bg-purple-600',
                primaryBorder: 'border-purple-600',
                primaryGradient: 'from-purple-500 to-violet-600',
                secondary: 'text-violet-600',
                secondaryBg: 'bg-violet-600',
                secondaryBorder: 'border-violet-600',
                lightBg: 'bg-purple-50',
                lightBorder: 'border-purple-200',
                hoverBg: 'hover:bg-purple-50',
                hoverBorder: 'hover:border-purple-200'
            };
        case 'general-dentistry':
        case 'communication':
            return {
                primary: 'text-blue-600',
                primaryBg: 'bg-blue-600',
                primaryBorder: 'border-blue-600',
                primaryGradient: 'from-blue-500 to-cyan-600',
                secondary: 'text-cyan-600',
                secondaryBg: 'bg-cyan-600',
                secondaryBorder: 'border-cyan-600',
                lightBg: 'bg-blue-50',
                lightBorder: 'border-blue-200',
                hoverBg: 'hover:bg-blue-50',
                hoverBorder: 'hover:border-blue-200'
            };
        default:
            return {
                primary: 'text-purple-600',
                primaryBg: 'bg-purple-600',
                primaryBorder: 'border-purple-600',
                primaryGradient: 'from-purple-500 to-violet-600',
                secondary: 'text-violet-600',
                secondaryBg: 'bg-violet-600',
                secondaryBorder: 'border-violet-600',
                lightBg: 'bg-purple-50',
                lightBorder: 'border-purple-200',
                hoverBg: 'hover:bg-purple-50',
                hoverBorder: 'hover:border-purple-200'
            };
    }
}; 