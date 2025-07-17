import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type AppointmentPreparationStatus = Tables<"appointment_preparation_status">;
export type NewAppointmentPreparationStatus = TablesInsert<"appointment_preparation_status">;

export const useAppointmentPreparation = () => {
  const queryClient = useQueryClient();

  const { data: preparationStatuses = [], isLoading, error } = useQuery({
    queryKey: ['appointment-preparation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointment_preparation_status')
        .select(`
          *,
          appointments(
            id,
            date,
            time,
            patient_name,
            appointment_type,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createPreparationStatus = useMutation({
    mutationFn: async (statusData: NewAppointmentPreparationStatus) => {
      const { data, error } = await supabase
        .from('appointment_preparation_status')
        .insert(statusData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment-preparation'] });
      toast.success('Preparation status created');
    },
    onError: (error) => {
      toast.error('Failed to create preparation status');
      console.error('Error creating preparation status:', error);
    },
  });

  const updatePreparationStatus = useMutation({
    mutationFn: async ({ 
      appointmentId, 
      updates 
    }: { 
      appointmentId: string; 
      updates: Partial<AppointmentPreparationStatus> 
    }) => {
      const { data, error } = await supabase
        .from('appointment_preparation_status')
        .update(updates)
        .eq('appointment_id', appointmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment-preparation'] });
      toast.success('Preparation status updated');
    },
    onError: (error) => {
      toast.error('Failed to update preparation status');
      console.error('Error updating preparation status:', error);
    },
  });

  const calculatePreparationScore = (status: AppointmentPreparationStatus): number => {
    const factors = [
      status.intake_completed,
      status.insurance_verified,
      status.contact_confirmed,
      status.medical_history_complete,
      status.forms_signed
    ];
    
    const completedCount = factors.filter(Boolean).length;
    return Math.round((completedCount / factors.length) * 100);
  };

  const getIncompleteAppointments = () => {
    return preparationStatuses.filter(status => 
      calculatePreparationScore(status) < 100
    );
  };

  const getUnconfirmedAppointments = () => {
    return preparationStatuses.filter(status => 
      !status.contact_confirmed
    );
  };

  return {
    preparationStatuses,
    isLoading,
    error,
    createPreparationStatus: createPreparationStatus.mutate,
    updatePreparationStatus: updatePreparationStatus.mutate,
    calculatePreparationScore,
    getIncompleteAppointments,
    getUnconfirmedAppointments,
    isCreating: createPreparationStatus.isPending,
    isUpdating: updatePreparationStatus.isPending,
  };
};