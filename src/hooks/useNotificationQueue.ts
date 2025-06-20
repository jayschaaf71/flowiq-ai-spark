
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NotificationItem } from "@/types/notification";
import { convertToNotificationItem, createReminderNotifications } from "@/utils/notificationUtils";
import { useNotificationOperations } from "./useNotificationOperations";

export const useNotificationQueue = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { scheduleNotification, sendNotification, cancelNotification } = useNotificationOperations();

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

  const scheduleAppointmentReminders = async (
    appointmentId: string,
    appointmentDate: Date,
    patientEmail: string,
    patientPhone?: string
  ) => {
    const notifications = createReminderNotifications(
      appointmentId,
      appointmentDate,
      patientEmail,
      patientPhone
    );

    const results = await Promise.all(
      notifications.map(notification => scheduleNotification(notification))
    );

    return results.filter(Boolean);
  };

  const sendNotificationAndUpdate = async (notificationId: string) => {
    await sendNotification(notificationId);
    
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, status: 'sent' as const, sent_at: new Date().toISOString() }
        : notif
    ));
  };

  const cancelNotificationAndUpdate = async (notificationId: string) => {
    await cancelNotification(notificationId);
    
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, status: 'cancelled' as const }
        : notif
    ));
  };

  const processPendingNotifications = async () => {
    const now = new Date();
    const pendingNotifications = notifications.filter(
      notif => notif.status === 'pending' && new Date(notif.scheduled_for) <= now
    );

    for (const notification of pendingNotifications) {
      await sendNotificationAndUpdate(notification.id);
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
    sendNotification: sendNotificationAndUpdate,
    cancelNotification: cancelNotificationAndUpdate,
    processPendingNotifications
  };
};
