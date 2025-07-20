
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { useAuth } from '@/hooks/useAuth';

interface OfflineData {
  appointments: any[];
  patients: any[];
  lastSync: string;
}

export const useOfflineStorage = () => {
  const [offlineData, setOfflineData] = useState<OfflineData>({
    appointments: [],
    patients: [],
    lastSync: ''
  });
  const [isOffline, setIsOffline] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Check network status
    const checkNetworkStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    // Load offline data on mount
    loadOfflineData();

    // Listen for network changes
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    checkNetworkStatus();

    return () => {
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
    };
  }, [user]);

  const loadOfflineData = async () => {
    if (!user) return;

    try {
      const { value } = await Preferences.get({ key: `offline_data_${user.id}` });
      if (value) {
        const data = JSON.parse(value);
        setOfflineData(data);
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  const saveOfflineData = async (data: Partial<OfflineData>) => {
    if (!user) return;

    try {
      const updatedData = {
        ...offlineData,
        ...data,
        lastSync: new Date().toISOString()
      };

      await Preferences.set({
        key: `offline_data_${user.id}`,
        value: JSON.stringify(updatedData)
      });

      setOfflineData(updatedData);
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const syncWithServer = async () => {
    if (isOffline) return;

    try {
      // TODO: Implement actual sync with Supabase
      console.log('Syncing offline data with server...');
      
      // Update last sync time
      await saveOfflineData({ lastSync: new Date().toISOString() });
      
      return true;
    } catch (error) {
      console.error('Error syncing with server:', error);
      return false;
    }
  };

  const cacheAppointments = async (appointments: any[]) => {
    await saveOfflineData({ appointments });
  };

  const cachePatients = async (patients: any[]) => {
    await saveOfflineData({ patients });
  };

  const clearOfflineData = async () => {
    if (!user) return;

    try {
      await Preferences.remove({ key: `offline_data_${user.id}` });
      setOfflineData({
        appointments: [],
        patients: [],
        lastSync: ''
      });
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  };

  return {
    offlineData,
    isOffline,
    saveOfflineData,
    syncWithServer,
    cacheAppointments,
    cachePatients,
    clearOfflineData
  };
};
