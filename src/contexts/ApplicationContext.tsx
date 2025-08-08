import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';

// Types
export type ApplicationType = 'connect' | 'healthcare' | 'admin';

export interface ApplicationContextType {
    applicationType: ApplicationType;
    currentPage: string;
    userRole: string;
    availableActions: string[];
    setCurrentPage: (page: string) => void;
    setUserRole: (role: string) => void;
    setAvailableActions: (actions: string[]) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const useApplicationContext = () => {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
        throw new Error('useApplicationContext must be used within an ApplicationProvider');
    }
    return context;
};

interface ApplicationProviderProps {
    children: ReactNode;
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(window.location.pathname);
    const [userRole, setUserRole] = useState('user');
    const [availableActions, setAvailableActions] = useState<string[]>([]);

    // Determine application type based on hostname
    const applicationType = useMemo((): ApplicationType => {
        const hostname = window.location.hostname;
        if (hostname === 'connect.flow-iq.ai') return 'connect';
        if (hostname === 'app.flow-iq.ai') return 'admin';
        return 'healthcare';
    }, []);

    // Update current page when route changes
    React.useEffect(() => {
        const handleRouteChange = () => {
            setCurrentPage(window.location.pathname);
        };

        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    const value: ApplicationContextType = {
        applicationType,
        currentPage,
        userRole,
        availableActions,
        setCurrentPage,
        setUserRole,
        setAvailableActions
    };

    return (
        <ApplicationContext.Provider value={value}>
            {children}
        </ApplicationContext.Provider>
    );
}; 