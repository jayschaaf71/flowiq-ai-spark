
import { supabase } from '@/integrations/supabase/client';

export const useIntakeAnalytics = () => {
  // Track form events for analytics
  const trackFormEvent = async (formId: string, eventType: string, metadata?: any) => {
    try {
      await supabase
        .from('intake_analytics')
        .insert([{
          form_id: formId,
          event_type: eventType,
          tenant_type: 'healthcare',
          metadata: metadata || {}
        }]);
    } catch (error) {
      console.error('Error tracking form event:', error);
    }
  };

  return {
    trackFormEvent,
  };
};
