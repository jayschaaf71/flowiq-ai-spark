
import { supabase } from '@/integrations/supabase/client';
import { PlaudConfig } from '@/types/plaud';

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
        return plaudConfig;
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

    const { error } = await supabase
      .from('integration_settings')
      .upsert({
        user_id: user.id,
        provider: 'plaud',
        settings: newConfig as any, // Convert to Json type
        is_active: true
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to save Plaud configuration:', error);
    return false;
  }
};
