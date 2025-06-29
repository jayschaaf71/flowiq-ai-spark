
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnalyticsFilters {
  timeRange: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  provider: string | null;
  location: string | null;
  specialty: string | null;
}

interface AnalyticsContextType {
  filters: AnalyticsFilters;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  refreshData: () => Promise<void>;
  isLoading: boolean;
  lastUpdated: Date | null;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [filters, setFiltersState] = useState<AnalyticsFilters>({
    timeRange: '30days',
    dateRange: {
      start: null,
      end: null
    },
    provider: null,
    location: null,
    specialty: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const setFilters = (newFilters: Partial<AnalyticsFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AnalyticsContextType = {
    filters,
    setFilters,
    refreshData,
    isLoading,
    lastUpdated
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
