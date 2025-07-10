
import { supabase } from '@/integrations/supabase/client';
import { PlaudConfig } from '@/types/plaud';

// Get the correct webhook URL for the Supabase function
const getWebhookUrl = () => {
  const supabaseUrl = 'https://jzusvsbkprwkjhhozaup.supabase.co';
  return `${supabaseUrl}/functions/v1/plaud-webhook`;
};

export const loadPlaudConfig = async (): Promise<PlaudConfig | null> => {
  try {
    console.log('Loading Plaud configuration');
    
    // Plaud works via webhook integration, no API key needed
    return {
      apiKey: '', // Not used for webhook integration
      webhookUrl: getWebhookUrl(),
      autoSync: true
    };
  } catch (error) {
    console.error('Failed to load Plaud configuration:', error);
    return null;
  }
};

export const savePlaudConfig = async (newConfig: PlaudConfig): Promise<boolean> => {
  try {
    console.log('Saving Plaud webhook configuration:', newConfig);
    
    // Log the webhook URL for user reference
    console.log('Plaud webhook URL configured:', getWebhookUrl());
    
    // Webhook integration is now active
    return true;
  } catch (error) {
    console.error('Failed to save Plaud configuration:', error);
    return false;
  }
};
