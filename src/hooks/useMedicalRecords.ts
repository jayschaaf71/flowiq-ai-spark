import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type MedicalRecord = Tables<"medical_records">;
type NewMedicalRecord = TablesInsert<"medical_records">;

export const useMedicalRecords = (patientId?: string) => {
  const query = useQuery({
    queryKey: ['medical_records', patientId],
    queryFn: async () => {
      let supabaseQuery = supabase
        .from('medical_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (patientId) {
        supabaseQuery = supabaseQuery.eq('patient_id', patientId);
      }

      const { data, error } = await supabaseQuery;
      if (error) throw error;
      return data || [];
    },
  });

  return {
    records: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: () => query.refetch()
  };
};

export const useMedicalRecord = (id: string) => {
  return useQuery({
    queryKey: ['medical_record', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (record: NewMedicalRecord) => {
      const { data, error } = await supabase
        .from('medical_records')
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical_records'] });
      toast({
        title: "Medical Record Created",
        description: "New medical record has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create medical record",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MedicalRecord> }) => {
      const { data, error } = await supabase
        .from('medical_records')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['medical_records'] });
      queryClient.invalidateQueries({ queryKey: ['medical_record', data.id] });
      toast({
        title: "Medical Record Updated",
        description: "Medical record has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update medical record",
        variant: "destructive",
      });
    },
  });
};