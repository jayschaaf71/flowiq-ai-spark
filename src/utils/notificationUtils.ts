
import { NotificationItem, SupabaseNotificationItem } from "@/types/notification";

export const convertToNotificationItem = (item: SupabaseNotificationItem): NotificationItem => ({
  ...item,
  type: item.type as NotificationItem['type'],
  channel: item.channel as NotificationItem['channel'],
  status: item.status as NotificationItem['status']
});

export const createReminderNotifications = (
  appointmentId: string,
  appointmentDate: Date,
  patientEmail: string,
  patientPhone?: string
): Omit<NotificationItem, 'id' | 'sent_at' | 'status' | 'retry_count' | 'created_at'>[] => {
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

  return notifications;
};
