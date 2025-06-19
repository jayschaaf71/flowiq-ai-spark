
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type MedicalHistory = Tables<"medical_history">;
type NewMedicalHistory = TablesInsert<"medical_history">;

export const useMedicalHistory = (patientId: string) => {
  return useQuery({
    queryKey: ['medical_history', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_history')
        .select('*')
        .eq('patient_id', patientId)
        .order('diagnosis_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId,
  });
};

export const useCreateMedicalHistory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (history: NewMedicalHistory) => {
      const { data, error } = await supabase
        .from('medical_history')
        .insert({
          ...history,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['medical_history', data.patient_id] });
      toast({
        title: "Medical condition added",
        description: "The medical condition has been successfully recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add medical condition",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMedicalHistory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MedicalHistory> }) => {
      const { data, error } = await supabase
        .from('medical_history')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['medical_history', data.patient_id] });
      toast({
        title: "Medical condition updated",
        description: "The medical condition has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update medical condition",
        variant: "destructive",
      });
    },
  });
};
