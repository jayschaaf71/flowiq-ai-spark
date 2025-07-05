
import { supabase } from '@/integrations/supabase/client';
import { PlaudConfig } from '@/types/plaud';

// Get the correct webhook URL for the Supabase function
const getWebhookUrl = () => {
  const supabaseUrl = 'https://jzusvsbkprwkjhhozaup.supabase.co';
  return `${supabaseUrl}/functions/v1/plaud-webhook`;
};

export const loadPlaudConfig = async (): Promise<PlaudConfig | null> => {
  try {
    console.log('Mock loading Plaud configuration');
    
    // Return mock config since integration_settings table doesn't exist
    return {
      apiKey: 'mock-api-key',
      webhookUrl: getWebhookUrl(),
      isConnected: true,
      deviceId: 'mock-device'
    };
  } catch (error) {
    console.error('Failed to load Plaud configuration:', error);
    return null;
  }
};

export const savePlaudConfig = async (newConfig: PlaudConfig): Promise<boolean> => {
  try {
    console.log('Mock saving Plaud configuration:', newConfig);
    
    // Mock success since integration_settings table doesn't exist
    return true;
  } catch (error) {
    console.error('Failed to save Plaud configuration:', error);
    return false;
  }
};

    if (error) throw error;

    // Log the webhook URL for user reference
    console.log('Plaud webhook URL configured:', getWebhookUrl());
    
    return true;
  } catch (error) {
    console.error('Failed to save Plaud configuration:', error);
    return false;
  }
};
