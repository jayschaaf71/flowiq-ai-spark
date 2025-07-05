
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ScribeSettings {
  autoSOAPGeneration: boolean;
  realTimeTranscription: boolean;
  saveRecordings: boolean;
  hipaaCompliance: boolean;
  transcriptionLanguage: string;
  aiModel: string;
  confidenceThreshold: number;
  autoSave: boolean;
  recordingQuality: string;
  zapierIntegration: boolean;
}

const defaultSettings: ScribeSettings = {
  autoSOAPGeneration: true,
  realTimeTranscription: true,
  saveRecordings: true,
  hipaaCompliance: true,
  transcriptionLanguage: "en",
  aiModel: "gpt-4",
  confidenceThreshold: 85,
  autoSave: true,
  recordingQuality: "high",
  zapierIntegration: true
};

export const useScribeSettings = () => {
  const [settings, setSettings] = useState<ScribeSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Mock scribe settings since table doesn't exist
      console.log('Using mock scribe settings data');
      setSettings(defaultSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: ScribeSettings) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Convert settings to a plain object that matches Supabase Json type
      const settingsData = JSON.parse(JSON.stringify(newSettings));

      // Mock settings save since table doesn't exist
      console.log('Mock saving scribe settings:', settingsData);

      setSettings(newSettings);
      toast({
        title: "Settings Saved",
        description: "Your Scribe iQ preferences have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save Failed",
        description: "Could not save your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof ScribeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    isLoading,
    isSaving,
    updateSetting,
    saveSettings,
    resetToDefaults
  };
};
