
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PlaudRecording {
  id: string;
  filename: string;
  duration: number;
  timestamp: string;
  processed: boolean;
  transcription?: string;
  patientId?: string;
}

interface PlaudConfig {
  apiKey: string;
  webhookUrl: string;
  autoSync: boolean;
}

export const usePlaudIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [config, setConfig] = useState<PlaudConfig | null>(null);
  const [recordings, setRecordings] = useState<PlaudRecording[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const { toast } = useToast();

  // Load configuration from database
  useEffect(() => {
    loadPlaudConfig();
  }, []);

  // Start polling for new recordings if auto-sync is enabled
  useEffect(() => {
    if (config?.autoSync && isConnected) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [config?.autoSync, isConnected]);

  const loadPlaudConfig = async () => {
    try {
      // Load user's Plaud configuration from database
      const { data, error } = await supabase
        .from('integration_settings')
        .select('settings')
        .eq('provider', 'plaud')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (data && !error) {
        const plaudConfig = data.settings as PlaudConfig;
        setConfig(plaudConfig);
        setIsConnected(!!plaudConfig.apiKey);
      }
    } catch (error) {
      console.error('Failed to load Plaud configuration:', error);
    }
  };

  const savePlaudConfig = async (newConfig: PlaudConfig) => {
    try {
      const { error } = await supabase
        .from('integration_settings')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          provider: 'plaud',
          settings: newConfig,
          is_active: true
        });

      if (error) throw error;

      setConfig(newConfig);
      setIsConnected(!!newConfig.apiKey);

      toast({
        title: "Configuration Saved",
        description: "Plaud integration settings have been updated",
      });
    } catch (error) {
      console.error('Failed to save Plaud configuration:', error);
      toast({
        title: "Save Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    }
  };

  const startPolling = () => {
    if (isPolling) return;
    
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

  const checkForNewRecordings = async () => {
    if (!config?.apiKey) return;

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
      
      // Process new recordings through our AI transcription
      for (const recording of newRecordings) {
        if (!recordings.find(r => r.id === recording.id)) {
          await processNewRecording(recording);
        }
      }

    } catch (error) {
      console.error('Failed to check for new recordings:', error);
    }
  };

  const processNewRecording = async (recording: any) => {
    try {
      // Download audio file from Plaud
      const audioResponse = await fetch(recording.downloadUrl, {
        headers: { 'Authorization': `Bearer ${config?.apiKey}` }
      });

      if (!audioResponse.ok) throw new Error('Failed to download recording');

      const audioBlob = await audioResponse.blob();
      
      // Convert to base64 for our transcription service
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(audioBlob);
      const base64Audio = await base64Promise;

      // Send to our AI transcription service
      const { data, error } = await supabase.functions.invoke('ai-voice-transcription', {
        body: {
          audio: base64Audio,
          userId: (await supabase.auth.getUser()).data.user?.id,
          source: 'plaud',
          recordingId: recording.id
        }
      });

      if (error) throw error;

      // Add to recordings list
      const processedRecording: PlaudRecording = {
        id: recording.id,
        filename: recording.filename,
        duration: recording.duration,
        timestamp: recording.timestamp,
        processed: true,
        transcription: data.transcription
      };

      setRecordings(prev => [...prev, processedRecording]);

      toast({
        title: "New Recording Processed",
        description: `Successfully transcribed ${recording.filename}`,
      });

    } catch (error) {
      console.error('Failed to process recording:', error);
      
      // Add as unprocessed recording
      const failedRecording: PlaudRecording = {
        id: recording.id,
        filename: recording.filename,
        duration: recording.duration,
        timestamp: recording.timestamp,
        processed: false
      };

      setRecordings(prev => [...prev, failedRecording]);
    }
  };

  const manualSync = async () => {
    if (!isConnected) return;
    
    await checkForNewRecordings();
    toast({
      title: "Sync Complete",
      description: "Checked for new recordings from Plaud device",
    });
  };

  const uploadRecording = async (file: File) => {
    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(file);
      const base64Audio = await base64Promise;

      // Send to AI transcription service
      const { data, error } = await supabase.functions.invoke('ai-voice-transcription', {
        body: {
          audio: base64Audio,
          userId: (await supabase.auth.getUser()).data.user?.id,
          source: 'manual_upload'
        }
      });

      if (error) throw error;

      const newRecording: PlaudRecording = {
        id: `upload_${Date.now()}`,
        filename: file.name,
        duration: 0,
        timestamp: new Date().toISOString(),
        processed: true,
        transcription: data.transcription
      };

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
    config,
    recordings,
    isPolling,
    savePlaudConfig,
    manualSync,
    uploadRecording,
    startPolling,
    stopPolling
  };
};
