
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PlaudRecording, PlaudConfig } from '@/types/plaud';
import { loadPlaudConfig, savePlaudConfig } from '@/services/plaudConfigService';
import { uploadRecording, loadRecordings } from '@/services/plaudRecordingService';
import { usePlaudSync } from '@/hooks/usePlaudSync';

export const usePlaudIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [config, setConfig] = useState<PlaudConfig | null>(null);
  const [recordings, setRecordings] = useState<PlaudRecording[]>([]);
  const { toast } = useToast();

  // Use the sync hook
  const { isPolling, startPolling, stopPolling, checkForNewRecordings } = usePlaudSync(config, isConnected);

  // Load configuration from database
  useEffect(() => {
    loadConfig();
  }, []);

  // Load recordings on mount
  useEffect(() => {
    loadUserRecordings();
  }, []);

  const loadConfig = async () => {
    const plaudConfig = await loadPlaudConfig();
    if (plaudConfig) {
      setConfig(plaudConfig);
      // Test the connection instead of just checking if API key exists
      await testConnection(plaudConfig);
    }
  };

  const testConnection = async (configToTest: PlaudConfig) => {
    if (!configToTest.apiKey || configToTest.apiKey === 'mock-api-key') {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      return;
    }

    setConnectionStatus('checking');
    try {
      const response = await fetch('https://api.plaud.ai/v1/recordings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${configToTest.apiKey}`,
          'Content-Type': 'application/json',
          'X-API-Version': '2024-01'
        }
      });

      if (response.ok) {
        setIsConnected(true);
        setConnectionStatus('connected');
      } else if (response.status === 401) {
        setIsConnected(false);
        setConnectionStatus('error');
        toast({
          title: "Invalid API Key",
          description: "Please check your Plaud Cloud credentials",
          variant: "destructive",
        });
      } else {
        setIsConnected(false);
        setConnectionStatus('error');
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionStatus('error');
      console.error('Connection test failed:', error);
    }
  };

  const loadUserRecordings = async () => {
    const userRecordings = await loadRecordings();
    setRecordings(userRecordings);
  };

  const savePlaudConfigAndUpdate = async (newConfig: PlaudConfig) => {
    const success = await savePlaudConfig(newConfig);
    
    if (success) {
      setConfig(newConfig);
      // Test the new configuration
      await testConnection(newConfig);

      toast({
        title: "Configuration Saved",
        description: "Plaud integration settings have been updated",
      });
    } else {
      toast({
        title: "Save Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    }
  };

  const manualSync = async () => {
    if (!isConnected) return;
    
    const newRecordings = await checkForNewRecordings();
    setRecordings(prev => [...prev, ...newRecordings]);
    
    toast({
      title: "Sync Complete",
      description: "Checked for new recordings from Plaud device",
    });
  };

  const uploadRecordingFile = async (file: File) => {
    try {
      const newRecording = await uploadRecording(file);
      setRecordings(prev => [...prev, newRecording]);

      toast({
        title: "Upload Successful",
        description: `Successfully processed ${file.name}`,
      });

      return newRecording;
    } catch (error) {
      console.error('Failed to upload recording:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to process the recording",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    isConnected,
    connectionStatus,
    config,
    recordings,
    isPolling,
    savePlaudConfig: savePlaudConfigAndUpdate,
    manualSync,
    uploadRecording: uploadRecordingFile,
    startPolling,
    stopPolling,
    testConnection
  };
};
