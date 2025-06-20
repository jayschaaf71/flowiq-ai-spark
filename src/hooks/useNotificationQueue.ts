
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotificationItem {
  id: string;
  appointment_id: string;
  type: 'confirmation' | 'reminder' | 'cancellation' | 'rescheduled';
  channel: 'email' | 'sms' | 'push';
  recipient: string;
  message: string;
  scheduled_for: string;
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  retry_count: number;
  created_at: string;
}

// Type for Supabase data (with string types)
interface SupabaseNotificationItem {
  id: string;
  appointment_id: string;
  type: string;
  channel: string;
  recipient: string;
  message: string;
  scheduled_for: string;
  sent_at?: string;
  status: string;
  retry_count: number;
  created_at: string;
}

// Helper function to convert Supabase data to NotificationItem
const convertToNotificationItem = (item: SupabaseNotificationItem): NotificationItem => ({
  ...item,
  type: item.type as NotificationItem['type'],
  channel: item.channel as NotificationItem['channel'],
  status: item.status as NotificationItem['status']
});

export const useNotificationQueue = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async (status?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('notification_queue')
        .select('*')
        .order('scheduled_for', { ascending: true });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const convertedData = (data || []).map(convertToNotificationItem);
      setNotifications(convertedData);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const scheduleNotification = async (notification: Omit<NotificationItem, 'id' | 'sent_at' | 'status' | 'retry_count' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('notification_queue')
        .insert({
          ...notification,
          status: 'pending',
          retry_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      const convertedData = convertToNotificationItem(data);
      setNotifications(prev => [...prev, convertedData]);

      toast({
        title: "Notification Scheduled",
        description: `${notification.type} notification scheduled for ${new Date(notification.scheduled_for).toLocaleString()}`,
      });

      return convertedData;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      toast({
        title: "Error",
        description: "Failed to schedule notification",
        variant: "destructive",
      });
    }
  };

  const scheduleAppointmentReminders = async (appointmentId: string, appointmentDate: Date, patientEmail: string, patientPhone?: string) => {
    const reminderTimes = [24, 2]; // hours before appointment
    const notifications: Omit<NotificationItem, 'id' | 'sent_at' | 'status' | 'retry_count' | 'created_at'>[] = [];

    reminderTimes.forEach(hours => {
      const scheduledFor = new Date(appointmentDate.getTime() - hours * 60 * 60 * 1000);

      // Email reminder
      notifications.push({
        appointment_id: appointmentId,
        type: 'reminder',
        channel: 'email',
        recipient: patientEmail,
        message: `Reminder: You have an appointment in ${hours} hours.`,
        scheduled_for: scheduledFor.toISOString()
      });

      // SMS reminder if phone number provided
      if (patientPhone) {
        notifications.push({
          appointment_id: appointmentId,
          type: 'reminder',
          channel: 'sms',
          recipient: patientPhone,
          message: `Reminder: You have an appointment in ${hours} hours. Reply CONFIRM to confirm or RESCHEDULE to reschedule.`,
          scheduled_for: scheduledFor.toISOString()
        });
      }
    });

    // Schedule all notifications
    const results = await Promise.all(
      notifications.map(notification => scheduleNotification(notification))
    );

    return results.filter(Boolean);
  };

  const sendNotification = async (notificationId: string) => {
    try {
      // In a real implementation, this would integrate with email/SMS services
      // For now, we'll just mark it as sent
      const { error } = await supabase
        .from('notification_queue')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: 'sent' as const, sent_at: new Date().toISOString() }
          : notif
      ));

      toast({
        title: "Notification Sent",
        description: "Notification has been delivered successfully",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };

  const cancelNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notification_queue')
        .update({ status: 'cancelled' })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: 'cancelled' as const }
          : notif
      ));

      toast({
        title: "Notification Cancelled",
        description: "Notification has been cancelled",
      });
    } catch (error) {
      console.error("Error cancelling notification:", error);
      toast({
        title: "Error",
        description: "Failed to cancel notification",
        variant: "destructive",
      });
    }
  };

  const processPendingNotifications = async () => {
    const now = new Date();
    const pendingNotifications = notifications.filter(
      notif => notif.status === 'pending' && new Date(notif.scheduled_for) <= now
    );

    for (const notification of pendingNotifications) {
      await sendNotification(notification.id);
    }
  };

  // Auto-process pending notifications every minute
  useEffect(() => {
    const interval = setInterval(processPendingNotifications, 60000);
    return () => clearInterval(interval);
  }, [notifications]);

  return {
    notifications,
    loading,
    loadNotifications,
    scheduleNotification,
    scheduleAppointmentReminders,
    sendNotification,
    cancelNotification,
    processPendingNotifications
  };
};
