
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TemplateStats {
  totalTemplates: number;
  emailTemplates: number;
  smsTemplates: number;
  customVariables: number;
  totalUsage: number;
  mostUsedTemplate: string;
}

export const useTemplateStats = () => {
  return useQuery({
    queryKey: ['template-stats'],
    queryFn: async (): Promise<TemplateStats> => {
      // Get template counts
      const { data: templates, error: templatesError } = await supabase
        .from('message_templates')
        .select('type')
        .eq('is_active', true);

      if (templatesError) throw templatesError;

      // Get custom variables count
      const { data: variables, error: variablesError } = await supabase
        .from('custom_variables')
        .select('id');

      if (variablesError) throw variablesError;

      // Get usage statistics
      const { data: usage, error: usageError } = await supabase
        .from('template_usage')
        .select('template_id')
        .gte('used_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

      if (usageError) throw usageError;

      // Get most used template
      const { data: mostUsed, error: mostUsedError } = await supabase
        .from('template_usage')
        .select('template_id, message_templates(name)')
        .gte('used_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      if (mostUsedError) throw mostUsedError;

      const emailCount = templates.filter(t => t.type === 'email').length;
      const smsCount = templates.filter(t => t.type === 'sms').length;

      return {
        totalTemplates: templates.length,
        emailTemplates: emailCount,
        smsTemplates: smsCount,
        customVariables: variables.length,
        totalUsage: usage.length,
        mostUsedTemplate: mostUsed?.[0]?.message_templates?.name || 'No usage data'
      };
    },
    refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
  });
};
