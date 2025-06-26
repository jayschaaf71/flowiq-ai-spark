
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ScheduledReminder {
  id: string;
  appointment_id?: string;
  patient_id?: string;
  template_id?: string;
  recipient_phone?: string;
  recipient_email?: string;
  message_content: string;
  scheduled_for: string;
  sent_at?: string;
  delivery_status: 'pending' | 'sent' | 'delivered' | 'failed' | 'cancelled';
  response_received: boolean;
  response_content?: string;
  response_classified_as?: string;
  retry_count: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export const useScheduledReminders = (status?: string) => {
  return useQuery({
    queryKey: ['scheduled_reminders', status],
    queryFn: async () => {
      let query = supabase
        .from('scheduled_reminders')
        .select('*')
        .order('scheduled_for', { ascending: true });
      
      if (status && status !== 'all') {
        query = query.eq('delivery_status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as ScheduledReminder[];
    },
  });
};

export const useCreateScheduledReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reminder: Omit<ScheduledReminder, 'id' | 'created_at' | 'updated_at' | 'retry_count' | 'response_received'>) => {
      const { data, error } = await supabase
        .from('scheduled_reminders')
        .insert({
          ...reminder,
          retry_count: 0,
          response_received: false
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled_reminders'] });
      toast({
        title: "Reminder Scheduled",
        description: "Message has been scheduled successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to schedule reminder",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateReminderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status, sent_at, error_message }: { 
      id: string; 
      status: ScheduledReminder['delivery_status']; 
      sent_at?: string; 
      error_message?: string; 
    }) => {
      const updates: any = { delivery_status: status };
      if (sent_at) updates.sent_at = sent_at;
      if (error_message) updates.error_message = error_message;
      
      const { data, error } = await supabase
        .from('scheduled_reminders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled_reminders'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update reminder status",
        variant: "destructive",
      });
    },
  });
};

export const useSendReminderNow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Call edge function to send the reminder
      const { data, error } = await supabase.functions.invoke('send-reminder', {
        body: { reminderId: id }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled_reminders'] });
      toast({
        title: "Reminder Sent",
        description: "Message has been sent successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      });
    },
  });
};

export const useCancelReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('scheduled_reminders')
        .update({ delivery_status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled_reminders'] });
      toast({
        title: "Reminder Cancelled",
        description: "Scheduled reminder has been cancelled",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to cancel reminder",
        variant: "destructive",
      });
    },
  });
};
