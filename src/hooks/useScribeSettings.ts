
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

      const { data, error } = await supabase
        .from('scribe_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setSettings({ ...defaultSettings, ...data.settings });
      } else if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned", which is fine for first-time users
        console.error('Error loading settings:', error);
        toast({
          title: "Settings Load Error",
          description: "Could not load your settings. Using defaults.",
          variant: "destructive",
        });
      }
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

      const { error } = await supabase.rpc('upsert_scribe_settings', {
        user_uuid: user.id,
        settings_data: newSettings
      });

      if (error) throw error;

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
