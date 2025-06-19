
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type SOAPNote = Tables<"soap_notes">;
type NewSOAPNote = TablesInsert<"soap_notes">;

export const useSOAPNotes = (patientId?: string) => {
  return useQuery({
    queryKey: ['soap_notes', patientId],
    queryFn: async () => {
      let query = supabase
        .from('soap_notes')
        .select(`
          *,
          patients(first_name, last_name),
          providers(first_name, last_name, specialty)
        `)
        .order('created_at', { ascending: false });

      if (patientId) {
        query = query.eq('patient_id', patientId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
};

export const useSOAPNote = (id: string) => {
  return useQuery({
    queryKey: ['soap_note', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('soap_notes')
        .select(`
          *,
          patients(first_name, last_name, patient_number),
          providers(first_name, last_name, specialty)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateSOAPNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: NewSOAPNote) => {
      const { data, error } = await supabase
        .from('soap_notes')
        .insert(note)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soap_notes'] });
    },
  });
};

export const useUpdateSOAPNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SOAPNote> }) => {
      const { data, error } = await supabase
        .from('soap_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['soap_notes'] });
      queryClient.invalidateQueries({ queryKey: ['soap_note', data.id] });
    },
  });
};
