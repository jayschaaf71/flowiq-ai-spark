
import { useState, useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface DashboardMetrics {
  totalPatients: number;
  todayAppointments: number;
  pendingTasks: number;
  revenue: number;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData({
          totalPatients: 1247,
          todayAppointments: 12,
          pendingTasks: 5,
          revenue: 15420
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        handleError(error as Error, 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [handleError]);

  return {
    data,
    loading,
    error: null
  };
};
