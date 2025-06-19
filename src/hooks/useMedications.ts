
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type Medication = Tables<"medications">;
type NewMedication = TablesInsert<"medications">;

export const useMedications = (patientId: string) => {
  return useQuery({
    queryKey: ['medications', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId,
  });
};

export const useCreateMedication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (medication: NewMedication) => {
      const { data, error } = await supabase
        .from('medications')
        .insert({
          ...medication,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['medications', data.patient_id] });
      toast({
        title: "Medication added",
        description: "The medication has been successfully recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add medication",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMedication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Medication> }) => {
      const { data, error } = await supabase
        .from('medications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['medications', data.patient_id] });
      toast({
        title: "Medication updated",
        description: "The medication has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update medication",
        variant: "destructive",
      });
    },
  });
};
