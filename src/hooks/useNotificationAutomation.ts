
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotificationRule {
  id: string;
  trigger: 'appointment_booked' | 'appointment_reminder' | 'appointment_cancelled';
  delay_hours: number;
  channel: 'email' | 'sms' | 'both';
  template: string;
  is_active: boolean;
}

export const useNotificationAutomation = () => {
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const scheduleNotification = async (
    appointmentId: string,
    type: 'confirmation' | 'reminder',
    delayHours: number = 0
  ) => {
    try {
      const scheduledFor = new Date();
      scheduledFor.setHours(scheduledFor.getHours() + delayHours);

      // Mock notification scheduling
      console.log('Scheduling notification for:', {
          appointment_id: appointmentId,
          type: type,
          channel: 'email',
          scheduled_for: scheduledFor.toISOString(),
          recipient: 'patient@example.com', // This would come from appointment data
          message: type === 'confirmation' 
            ? 'Your appointment has been confirmed.' 
            : 'Reminder: You have an upcoming appointment.',
          status: 'pending'
        });

      console.log(`${type} notification scheduled for ${scheduledFor}`);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const processAutomatedNotifications = async (appointmentId: string, trigger: string) => {
    try {
      // Schedule confirmation immediately
      if (trigger === 'appointment_booked') {
        await scheduleNotification(appointmentId, 'confirmation', 0);
        // Schedule reminder 24 hours before
        await scheduleNotification(appointmentId, 'reminder', -24);
      }

      toast({
        title: "Notifications Scheduled",
        description: "Automated notifications have been set up for this appointment.",
      });
    } catch (error) {
      console.error('Error processing automated notifications:', error);
    }
  };

  return {
    rules,
    loading,
    scheduleNotification,
    processAutomatedNotifications
  };
};
