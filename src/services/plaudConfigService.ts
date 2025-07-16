
import { supabase } from '@/integrations/supabase/client';
import { PlaudConfig } from '@/types/plaud';

// Get the correct webhook URL for the Supabase function
const getWebhookUrl = () => {
  const supabaseUrl = 'https://jzusvsbkprwkjhhozaup.supabase.co';
  return `${supabaseUrl}/functions/v1/plaud-webhook`;
};

export const loadPlaudConfig = async (): Promise<PlaudConfig | null> => {
  try {
    console.log('Loading Plaud configuration from database');
    
    // Get current user's tenant ID from their profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_tenant_id')
      .single();
    
    if (!profile?.current_tenant_id) {
      console.log('No tenant found for user');
      return null;
    }
    
    // Load configuration from database
    const { data: config, error } = await supabase
      .from('plaud_configurations')
      .select('*')
      .eq('tenant_id', profile.current_tenant_id)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error || !config) {
      console.log('No Plaud configuration found in database');
      return null;
    }
    
    return {
      apiKey: config.api_key || '',
      webhookUrl: config.webhook_url || getWebhookUrl(),
      autoSync: config.auto_sync
    };
  } catch (error) {
    console.error('Failed to load Plaud configuration:', error);
    return null;
  }
};

export const savePlaudConfig = async (newConfig: PlaudConfig): Promise<boolean> => {
  try {
    console.log('Saving Plaud webhook configuration to database:', newConfig);
    
    // Get current user's tenant ID and user ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_tenant_id, id')
      .single();
    
    if (!profile?.current_tenant_id) {
      console.error('No tenant found for user');
      return false;
    }
    
    // Save or update configuration in database
    const { error } = await supabase
      .from('plaud_configurations')
      .upsert({
        tenant_id: profile.current_tenant_id,
        user_id: profile.id,
        api_key: newConfig.apiKey,
        webhook_url: newConfig.webhookUrl,
        auto_sync: newConfig.autoSync,
        is_active: true,
        transcription_settings: {},
        metadata: {
          configured_at: new Date().toISOString(),
          integration_type: 'zapier'
        }
      }, {
        onConflict: 'tenant_id'
      });
    
    if (error) {
      console.error('Failed to save Plaud configuration:', error);
      return false;
    }
    
    console.log('Plaud configuration saved successfully');
    return true;
  } catch (error) {
    console.error('Failed to save Plaud configuration:', error);
    return false;
  }
};
