export interface BaseTheme {
    layout: {
        sidebarWidth: string;
        headerHeight: string;
        borderRadius: string;
        spacing: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
    };
    typography: {
        fontFamily: string;
        headings: {
            h1: string;
            h2: string;
            h3: string;
        };
    };
    components: {
        card: string;
        button: string;
        sidebar: string;
    };
}

export const baseTheme: BaseTheme = {
    layout: {
        sidebarWidth: '320px',
        headerHeight: '64px',
        borderRadius: '12px',
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px'
        }
    },
    typography: {
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        headings: {
            h1: 'text-3xl font-bold tracking-tight',
            h2: 'text-2xl font-semibold tracking-tight',
            h3: 'text-xl font-medium tracking-tight'
        }
    },
    components: {
        card: 'bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200',
        button: 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        sidebar: 'bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 shadow-sm'
    }
}; 