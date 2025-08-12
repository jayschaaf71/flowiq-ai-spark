import { useState, useEffect, useCallback } from 'react';
import { automatedInsuranceService } from '@/services/automatedInsuranceService';

interface AutomationStatus {
  isRunning: boolean;
  queueLength: number;
  providers: any[];
  lastUpdate: string;
}

interface AutomationMetrics {
  totalClaimsProcessed: number;
  totalRevenueRecovered: number;
  averageProcessingTime: number;
  denialRate: number;
  automationEfficiency: number;
}

export const useAutomatedInsurance = () => {
  const [status, setStatus] = useState<AutomationStatus>({
    isRunning: false,
    queueLength: 0,
    providers: [],
    lastUpdate: new Date().toISOString()
  });

  const [metrics, setMetrics] = useState<AutomationMetrics>({
    totalClaimsProcessed: 0,
    totalRevenueRecovered: 0,
    averageProcessingTime: 0,
    denialRate: 0,
    automationEfficiency: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get automation status
  const getStatus = useCallback(async () => {
    try {
      const automationStatus = await automatedInsuranceService.getAutomationStatus();
      setStatus({
        isRunning: automationStatus.isRunning,
        queueLength: automationStatus.queueLength,
        providers: automationStatus.providers,
        lastUpdate: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error getting automation status:', err);
      setError('Failed to get automation status');
    }
  }, []);

  // Start automation
  const startAutomation = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await automatedInsuranceService.startAutomation();
      await getStatus();
    } catch (err) {
      console.error('Error starting automation:', err);
      setError('Failed to start automation');
    } finally {
      setLoading(false);
    }
  }, [getStatus]);

  // Stop automation
  const stopAutomation = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await automatedInsuranceService.stopAutomation();
      await getStatus();
    } catch (err) {
      console.error('Error stopping automation:', err);
      setError('Failed to stop automation');
    } finally {
      setLoading(false);
    }
  }, [getStatus]);

  // Get provider status
  const getProviderStatus = useCallback(async (providerId: string) => {
    try {
      return await automatedInsuranceService.getProviderStatus(providerId);
    } catch (err) {
      console.error('Error getting provider status:', err);
      setError('Failed to get provider status');
      return null;
    }
  }, []);

  // Update metrics (mock data for now)
  const updateMetrics = useCallback(() => {
    setMetrics({
      totalClaimsProcessed: 1247,
      totalRevenueRecovered: 89234,
      averageProcessingTime: 2.3,
      denialRate: 15.2,
      automationEfficiency: 89.7
    });
  }, []);

  // Refresh all data
  const refresh = useCallback(async () => {
    await getStatus();
    updateMetrics();
  }, [getStatus, updateMetrics]);

  // Auto-refresh status every 30 seconds
  useEffect(() => {
    refresh();
    
    const interval = setInterval(() => {
      refresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [refresh]);

  return {
    status,
    metrics,
    loading,
    error,
    startAutomation,
    stopAutomation,
    getProviderStatus,
    refresh
  };
};
