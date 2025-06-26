
import { supabase } from '@/integrations/supabase/client';
import { PlaudConfig } from '@/types/plaud';

// Get the correct webhook URL for the Supabase function
const getWebhookUrl = () => {
  const supabaseUrl = 'https://jzusvsbkprwkjhhozaup.supabase.co';
  return `${supabaseUrl}/functions/v1/plaud-webhook`;
};

export const loadPlaudConfig = async (): Promise<PlaudConfig | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('integration_settings')
      .select('settings')
      .eq('provider', 'plaud')
      .eq('user_id', user.id)
      .single();

    if (data && !error && data.settings) {
      // Type assertion with validation
      const plaudConfig = data.settings as unknown as PlaudConfig;
      if (plaudConfig && typeof plaudConfig === 'object' && 'apiKey' in plaudConfig) {
        // Ensure webhook URL is always current
        return {
          ...plaudConfig,
          webhookUrl: getWebhookUrl()
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to load Plaud configuration:', error);
    return null;
  }
};

export const savePlaudConfig = async (newConfig: PlaudConfig): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Ensure webhook URL is set correctly
    const configWithWebhook = {
      ...newConfig,
      webhookUrl: getWebhookUrl()
    };

    const { error } = await supabase
      .from('integration_settings')
      .upsert({
        user_id: user.id,
        provider: 'plaud',
        settings: configWithWebhook as any, // Convert to Json type
        is_active: true
      });

    if (error) throw error;

    // Log the webhook URL for user reference
    console.log('Plaud webhook URL configured:', getWebhookUrl());
    
    return true;
  } catch (error) {
    console.error('Failed to save Plaud configuration:', error);
    return false;
  }
};
