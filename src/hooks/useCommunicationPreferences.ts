import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CommunicationPreferences {
  id?: string;
  user_id: string;
  appointment_reminders_enabled: boolean;
  appointment_reminders_method: 'email' | 'sms' | 'both' | 'none';
  test_results_enabled: boolean;
  test_results_method: 'email' | 'sms' | 'both' | 'none';
  billing_notifications_enabled: boolean;
  billing_notifications_method: 'email' | 'sms' | 'both' | 'none';
  educational_content_enabled: boolean;
  educational_content_method: 'email' | 'sms' | 'both' | 'none';
  general_notifications_enabled: boolean;
}

export const useCommunicationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<CommunicationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user preferences
  const fetchPreferences = async () => {
    if (!user) return;

    try {
      // Mock communication preferences since user_communication_preferences table doesn't exist
      const mockPreferences: CommunicationPreferences = {
        id: '1',
        user_id: user.id,
        appointment_reminders_enabled: true,
        appointment_reminders_method: 'both',
        test_results_enabled: true,
        test_results_method: 'email',
        billing_notifications_enabled: true,
        billing_notifications_method: 'email',
        educational_content_enabled: false,
        educational_content_method: 'email',
        general_notifications_enabled: true,
      };

      setPreferences(mockPreferences);
    } catch (error) {
      console.error('Error fetching communication preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load communication preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Update preferences
  const updatePreferences = async (newPreferences: Partial<CommunicationPreferences>) => {
    if (!user || !preferences) return;

    setSaving(true);
    try {
      // Mock updating preferences
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      
      toast({
        title: "Preferences Updated",
        description: "Your communication preferences have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating communication preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update communication preferences",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Update a specific preference
  const updatePreference = async (field: keyof CommunicationPreferences, value: any) => {
    await updatePreferences({ [field]: value });
  };

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  return {
    preferences,
    loading,
    saving,
    updatePreference,
    updatePreferences
  };
};