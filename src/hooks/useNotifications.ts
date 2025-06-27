
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject?: string;
  message_template: string;
  variables: string[];
  is_active: boolean;
}

interface ScheduledNotification {
  id: string;
  appointment_id: string;
  template_id: string;
  recipient_email?: string;
  recipient_phone?: string;
  scheduled_for: string;
  sent_at?: string;
  status: string;
}

export const useNotifications = () => {
  const { toast } = useToast();
  
  const scheduleNotification = async (
    appointmentId: string,
    templateId: string,
    recipientEmail?: string,
    recipientPhone?: string,
    scheduledFor?: Date
  ) => {
    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .insert({
          appointment_id: appointmentId,
          template_id: templateId,
          recipient_email: recipientEmail,
          recipient_phone: recipientPhone,
          scheduled_for: scheduledFor?.toISOString() || new Date().toISOString()
        });

      if (error) throw error;
      
      toast({
        title: "Notification Scheduled",
        description: "Notification has been scheduled successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      toast({
        title: "Error",
        description: "Failed to schedule notification",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    scheduleNotification
  };
};
