
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Appointment = Tables<"appointments">;
type NewAppointment = TablesInsert<"appointments">;

export const useAppointments = () => {
  const query = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const updateMutation = useUpdateAppointment();
  const { toast } = useToast();

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      await updateMutation.mutateAsync({ 
        id: appointmentId, 
        updates: { status: newStatus } 
      });
      return query.data?.find(apt => apt.id === appointmentId);
    } catch (error) {
      return null;
    }
  };

  const sendReminder = async (appointment: Appointment) => {
    try {
      // TODO: Implement actual reminder sending via edge function
      toast({
        title: "Reminder Sent",
        description: `Reminder sent for appointment with ${appointment.patient_name || 'patient'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      });
    }
  };

  return {
    appointments: query.data || [],
    loading: query.isLoading,
    error: query.error,
    updateAppointmentStatus,
    sendReminder,
    refetch: query.refetch
  };
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (appointment: NewAppointment) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Appointment Created",
        description: "New appointment has been scheduled successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Appointment> }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] });
      toast({
        title: "Appointment Updated",
        description: "Appointment has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    },
  });
};

export const useAppointmentsByDate = (date: string) => {
  return useQuery({
    queryKey: ['appointments', 'by-date', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', date)
        .order('time', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!date,
  });
};

export const useAppointmentsByPatient = (patientId: string) => {
  return useQuery({
    queryKey: ['appointments', 'by-patient', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!patientId,
  });
};
