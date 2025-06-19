
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type ProviderAssignment = Tables<'provider_assignments'>;
type NewProviderAssignment = TablesInsert<'provider_assignments'>;

export const useProviderAssignments = (patientId?: string) => {
  return useQuery({
    queryKey: ['provider_assignments', patientId],
    queryFn: async () => {
      let query = supabase
        .from('provider_assignments')
        .select(`
          *,
          providers (
            id,
            first_name,
            last_name,
            specialty,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (patientId) {
        query = query.eq('patient_id', patientId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId,
  });
};

export const useAssignProvider = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (assignment: NewProviderAssignment) => {
      const { data, error } = await supabase
        .from('provider_assignments')
        .insert({
          ...assignment,
          assigned_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['provider_assignments', data.patient_id] });
      toast({
        title: "Provider assigned",
        description: "The provider has been successfully assigned to this patient.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign provider",
        variant: "destructive",
      });
    },
  });
};
