
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

// Mock data for development until tables are created
const mockReminders: ScheduledReminder[] = [
  {
    id: '1',
    appointment_id: 'apt-1',
    patient_id: 'pat-1',
    template_id: 'tpl-1',
    recipient_phone: '+1234567890',
    recipient_email: 'patient@example.com',
    message_content: 'Hi John, this is a reminder of your appointment tomorrow at 2:00 PM.',
    scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    delivery_status: 'pending',
    response_received: false,
    retry_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    appointment_id: 'apt-2',
    patient_id: 'pat-2',
    template_id: 'tpl-1',
    recipient_email: 'jane@example.com',
    message_content: 'Hi Jane, this is a reminder of your appointment on Friday at 10:00 AM.',
    scheduled_for: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    sent_at: new Date().toISOString(),
    delivery_status: 'sent',
    response_received: true,
    response_content: 'Yes, I will be there',
    response_classified_as: 'confirmation',
    retry_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const useScheduledReminders = (status?: string) => {
  return useQuery({
    queryKey: ['scheduled_reminders', status],
    queryFn: async () => {
      // For now, return mock data filtered by status
      let filteredReminders = mockReminders;
      
      if (status && status !== 'all') {
        filteredReminders = mockReminders.filter(r => r.delivery_status === status);
      }
      
      return filteredReminders;
    },
  });
};

export const useCreateScheduledReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reminder: Omit<ScheduledReminder, 'id' | 'created_at' | 'updated_at' | 'retry_count' | 'response_received'>) => {
      // Mock creation for now
      const newReminder = {
        ...reminder,
        id: Math.random().toString(36).substr(2, 9),
        retry_count: 0,
        response_received: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('Mock reminder created:', newReminder);
      return newReminder;
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
      // Mock update for now
      console.log('Mock reminder status updated:', { id, status, sent_at, error_message });
      return { id, status, sent_at, error_message };
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
      // Mock cancellation for now
      console.log('Mock reminder cancelled:', id);
      return { id, delivery_status: 'cancelled' };
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
