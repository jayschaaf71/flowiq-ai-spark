
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

      // Try to load settings from database
      const { data: settingsRecord, error } = await supabase
        .from('scribe_settings')
        .select('settings')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        setSettings(defaultSettings);
      } else if (settingsRecord?.settings) {
        // Merge saved settings with defaults to ensure all properties exist
        const savedSettings = { ...defaultSettings, ...(settingsRecord.settings as Partial<ScribeSettings>) };
        setSettings(savedSettings);
      } else {
        // No saved settings found, use defaults
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(defaultSettings);
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

      // Insert or update settings in database
      const { error } = await supabase
        .from('scribe_settings')
        .upsert({
          user_id: user.id,
          settings: settingsData
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

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
