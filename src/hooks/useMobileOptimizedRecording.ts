import { useState, useEffect, useCallback } from 'react';
import { useAIVoiceTranscription } from './useAIVoiceTranscription';

interface MobileOptimizations {
  enableBatteryOptimization: boolean;
  enableOfflineMode: boolean;
  maxRecordingDuration: number; // in seconds
  enableHapticFeedback: boolean;
}

export const useMobileOptimizedRecording = (options: MobileOptimizations = {
  enableBatteryOptimization: true,
  enableOfflineMode: true,
  maxRecordingDuration: 300, // 5 minutes
  enableHapticFeedback: true
}) => {
  const baseRecording = useAIVoiceTranscription();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [offlineRecordings, setOfflineRecordings] = useState<Blob[]>([]);

  // Battery monitoring
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level);
        
        const updateBattery = () => setBatteryLevel(battery.level);
        battery.addEventListener('levelchange', updateBattery);
        
        return () => battery.removeEventListener('levelchange', updateBattery);
      });
    }
  }, []);

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Haptic feedback
  const vibrate = useCallback((pattern: number | number[]) => {
    if (options.enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, [options.enableHapticFeedback]);

  // Battery-optimized recording
  const startOptimizedRecording = useCallback(async () => {
    // Check battery level if battery optimization is enabled
    if (options.enableBatteryOptimization && batteryLevel !== null && batteryLevel < 0.2) {
      throw new Error('Battery level too low for extended recording. Please charge device.');
    }

    // Haptic feedback for start
    vibrate(50);

    await baseRecording.startRecording();
  }, [baseRecording, batteryLevel, options.enableBatteryOptimization, vibrate]);

  const stopOptimizedRecording = useCallback(() => {
    // Haptic feedback for stop
    vibrate([50, 50, 50]);

    baseRecording.stopRecording();
  }, [baseRecording, vibrate]);

  // Auto-stop recording at max duration
  useEffect(() => {
    if (baseRecording.isRecording && baseRecording.recordingDuration >= options.maxRecordingDuration) {
      stopOptimizedRecording();
    }
  }, [baseRecording.isRecording, baseRecording.recordingDuration, options.maxRecordingDuration, stopOptimizedRecording]);

  // Offline recording queue
  useEffect(() => {
    if (baseRecording.audioBlob && isOffline) {
      setOfflineRecordings(prev => [...prev, baseRecording.audioBlob!]);
    }
  }, [baseRecording.audioBlob, isOffline]);

  // Process offline recordings when back online
  useEffect(() => {
    if (!isOffline && offlineRecordings.length > 0) {
      // Process offline recordings
      offlineRecordings.forEach(async (blob, index) => {
        try {
          await baseRecording.processAudioWithAI(blob);
          setOfflineRecordings(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
          console.error('Failed to process offline recording:', error);
        }
      });
    }
  }, [isOffline, offlineRecordings, baseRecording]);

  return {
    ...baseRecording,
    startRecording: startOptimizedRecording,
    stopRecording: stopOptimizedRecording,
    isOffline,
    batteryLevel,
    offlineRecordings: offlineRecordings.length,
    maxDurationReached: baseRecording.recordingDuration >= options.maxRecordingDuration,
    canRecord: !options.enableBatteryOptimization || batteryLevel === null || batteryLevel > 0.2
  };
};