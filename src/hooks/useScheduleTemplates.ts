
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
      let query = supabase.from('schedule_templates').select('*');
      if (providerId) query = query.eq('provider_id', providerId);

      const { data, error } = await query.eq('is_active', true);

      if (error) throw error;
      
      const convertedData = (data || []).map(convertToScheduleTemplate);
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
