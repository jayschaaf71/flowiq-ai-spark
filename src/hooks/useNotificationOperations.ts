
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NotificationItem } from "@/types/notification";
import { convertToNotificationItem } from "@/utils/notificationUtils";

export const useNotificationOperations = () => {
  const { toast } = useToast();

  const scheduleNotification = async (
    notification: Omit<NotificationItem, 'id' | 'sent_at' | 'status' | 'retry_count' | 'created_at'>
  ) => {
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

  const sendNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notification_queue')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) throw error;

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

  return {
    scheduleNotification,
    sendNotification,
    cancelNotification
  };
};
