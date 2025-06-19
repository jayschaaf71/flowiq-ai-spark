
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SOAPTemplate {
  id: string;
  name: string;
  specialty: string;
  template_data: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export const useSOAPTemplates = (specialty?: string) => {
  return useQuery({
    queryKey: ['soap_templates', specialty],
    queryFn: async () => {
      let query = supabase
        .from('soap_note_templates')
        .select('*')
        .eq('is_active', true)
        .order('specialty', { ascending: true })
        .order('name', { ascending: true });

      if (specialty) {
        query = query.eq('specialty', specialty);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SOAPTemplate[];
    },
  });
};

export const useCreateSOAPTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: Omit<SOAPTemplate, 'id' | 'created_at' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('soap_note_templates')
        .insert({
          ...template,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soap_templates'] });
    },
  });
};
