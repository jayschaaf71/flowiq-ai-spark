
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AppointmentReminder {
  id: string;
  appointment_id: string;
  reminder_type: 'email' | 'sms';
  sent_at: string | null;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
}

export const useAppointmentReminders = (appointmentId?: string) => {
  return useQuery({
    queryKey: ['appointment_reminders', appointmentId],
    queryFn: async () => {
      let query = supabase
        .from('appointment_reminders')
        .select('*')
        .order('created_at', { ascending: false });

      if (appointmentId) {
        query = query.eq('appointment_id', appointmentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AppointmentReminder[];
    },
  });
};

export const useSendReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ appointmentId, type }: { appointmentId: string; type: 'email' | 'sms' }) => {
      // Create reminder record
      const { data, error } = await supabase
        .from('appointment_reminders')
        .insert({
          appointment_id: appointmentId,
          reminder_type: type,
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointment_reminders'] });
      toast({
        title: "Reminder Sent",
        description: `${data.reminder_type.toUpperCase()} reminder sent successfully`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      });
    },
  });
};
