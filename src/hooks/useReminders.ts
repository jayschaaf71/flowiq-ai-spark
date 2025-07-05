import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
      // Mock appointment reminders data
      const mockReminders: AppointmentReminder[] = [
        {
          id: '1',
          appointment_id: appointmentId || 'appointment-1',
          reminder_type: 'email',
          sent_at: new Date().toISOString(),
          status: 'sent',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          appointment_id: appointmentId || 'appointment-1',
          reminder_type: 'sms',
          sent_at: new Date().toISOString(),
          status: 'sent',
          created_at: new Date().toISOString()
        }
      ];

      return appointmentId 
        ? mockReminders.filter(r => r.appointment_id === appointmentId)
        : mockReminders;
    },
  });
};

export const useSendReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ appointmentId, type }: { appointmentId: string; type: 'email' | 'sms' }) => {
      // Mock reminder sending
      console.log('Sending reminder:', { appointmentId, type });
      
      const mockReminder: AppointmentReminder = {
        id: Date.now().toString(),
        appointment_id: appointmentId,
        reminder_type: type,
        status: 'sent',
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      return mockReminder;
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