import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { NotificationItem } from "@/types/notification";
import { useNotificationOperations } from "./useNotificationOperations";

export const useNotificationQueue = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { scheduleNotification, sendNotification, cancelNotification } = useNotificationOperations();

  const loadNotifications = async (status?: string) => {
    setLoading(true);
    // Mock notifications
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        appointment_id: 'apt-1',
        type: 'reminder',
        channel: 'email',
        recipient: 'patient@example.com',
        message: 'Appointment reminder',
        scheduled_for: new Date().toISOString(),
        status: 'pending',
        retry_count: 0,
        created_at: new Date().toISOString()
      }
    ];
    setNotifications(status ? mockNotifications.filter(n => n.status === status) : mockNotifications);
    setLoading(false);
  };

  const scheduleAppointmentReminders = async (
    appointmentId: string,
    appointmentDate: Date,
    patientEmail: string,
    patientPhone?: string
  ) => {
    console.log('Scheduling reminders for:', appointmentId);
    return [];
  };

  return {
    notifications,
    loading,
    loadNotifications,
    scheduleNotification,
    scheduleAppointmentReminders,
    sendNotification,
    cancelNotification,
    processPendingNotifications: async () => {}
  };
};