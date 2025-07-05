
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScheduleTemplate } from "@/types/availability";
import { convertToScheduleTemplate } from "@/utils/availabilityUtils";

export const useScheduleTemplates = () => {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const loadScheduleTemplates = async (providerId?: string) => {
    setLoading(true);
    try {
      // Mock schedule templates data since table doesn't exist
      const mockData = [
        {
          id: '1',
          provider_id: providerId || 'provider-1',
          day_of_week: 1,
          start_time: '09:00',
          end_time: '17:00',
          slot_duration: 60,
          buffer_time: 15,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      console.log('Using mock schedule templates data');
      const convertedData = mockData.map(convertToScheduleTemplate);
      setTemplates(convertedData);
    } catch (error) {
      console.error("Error loading schedule templates:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    templates,
    loading,
    loadScheduleTemplates
  };
};
