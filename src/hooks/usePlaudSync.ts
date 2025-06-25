
import { useState, useEffect } from 'react';
import { PlaudRecording, PlaudConfig } from '@/types/plaud';
import { processNewRecording } from '@/services/plaudRecordingService';

export const usePlaudSync = (config: PlaudConfig | null, isConnected: boolean) => {
  const [isPolling, setIsPolling] = useState(false);

  // Start polling for new recordings if auto-sync is enabled
  useEffect(() => {
    if (config?.autoSync && isConnected) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [config?.autoSync, isConnected]);

  const startPolling = () => {
    if (isPolling || !config) return;
    
    setIsPolling(true);
    const interval = setInterval(async () => {
      await checkForNewRecordings();
    }, 30000); // Poll every 30 seconds

    // Store interval ID for cleanup
    (window as any).plaudPollingInterval = interval;
  };

  const stopPolling = () => {
    if ((window as any).plaudPollingInterval) {
      clearInterval((window as any).plaudPollingInterval);
      (window as any).plaudPollingInterval = null;
    }
    setIsPolling(false);
  };

  const checkForNewRecordings = async (): Promise<PlaudRecording[]> => {
    if (!config?.apiKey) return [];

    try {
      // Call Plaud API to get new recordings
      const response = await fetch('/api/plaud/recordings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch recordings');

      const newRecordings = await response.json();
      const processedRecordings: PlaudRecording[] = [];
      
      // Process new recordings through our AI transcription
      for (const recording of newRecordings) {
        const processed = await processNewRecording(recording, config);
        processedRecordings.push(processed);
      }

      return processedRecordings;
    } catch (error) {
      console.error('Failed to check for new recordings:', error);
      return [];
    }
  };

  return {
    isPolling,
    startPolling,
    stopPolling,
    checkForNewRecordings
  };
};
