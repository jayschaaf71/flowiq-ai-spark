
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
      // Mock template stats data since tables don't exist
      console.log('Using mock template stats data');
      
      const mockStats: TemplateStats = {
        totalTemplates: 12,
        emailTemplates: 8,
        smsTemplates: 4,
        customVariables: 15,
        totalUsage: 245,
        mostUsedTemplate: 'Appointment Reminder'
      };
      
      return mockStats;
    },
    refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
  });
};
