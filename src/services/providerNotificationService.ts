
import { supabase } from '@/integrations/supabase/client';
import { ProviderNotificationPreferencesService } from './providerNotificationPreferencesService';

export interface ProviderNotification {
  id: string;
  provider_id: string;
  appointment_id?: string;
  patient_id?: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
  read_at?: string;
}

export class ProviderNotificationService {
  // Create a notification for a provider (respecting preferences)
  static async createNotification(notification: Omit<ProviderNotification, 'id' | 'created_at' | 'is_read'>) {
    try {
      // Check if provider should receive in-app notifications for this type
      const shouldReceive = await ProviderNotificationPreferencesService.shouldSendNotification(
        notification.provider_id,
        notification.notification_type,
        'in_app',
        new Date()
      );

      if (!shouldReceive) {
        console.log(`Skipping in-app notification for ${notification.provider_id} - ${notification.notification_type}`);
        return null;
      }

      const { data, error } = await supabase
        .from('provider_notifications')
        .insert({
          ...notification,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating provider notification:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createNotification:', error);
      return null;
    }
  }

  // Send notification via multiple channels based on preferences
  static async sendNotificationWithPreferences(
    providerId: string,
    notificationType: string,
    title: string,
    message: string,
    options?: {
      appointmentId?: string;
      patientId?: string;
      actionUrl?: string;
      scheduledTime?: Date;
    }
  ) {
    const scheduledTime = options?.scheduledTime || new Date();
    
    // Check each channel and send accordingly
    const channels = ['email', 'sms', 'push', 'in_app'] as const;
    const results = [];

    for (const channel of channels) {
      const shouldSend = await ProviderNotificationPreferencesService.shouldSendNotification(
        providerId,
        notificationType,
        channel,
        scheduledTime
      );

      if (shouldSend) {
        try {
          switch (channel) {
            case 'in_app': {
              const notification = await this.createNotification({
                provider_id: providerId,
                appointment_id: options?.appointmentId,
                patient_id: options?.patientId,
                notification_type: notificationType,
                title,
                message,
                action_url: options?.actionUrl
              });
              results.push({ channel, success: !!notification, data: notification });
              break;
            }
              
            case 'email':
              // TODO: Integrate with email service
              console.log(`Would send email to provider ${providerId}: ${title}`);
              results.push({ channel, success: true, data: 'email queued' });
              break;
              
            case 'sms':
              // TODO: Integrate with SMS service
              console.log(`Would send SMS to provider ${providerId}: ${message}`);
              results.push({ channel, success: true, data: 'sms queued' });
              break;
              
            case 'push':
              // TODO: Integrate with push notification service
              console.log(`Would send push to provider ${providerId}: ${title}`);
              results.push({ channel, success: true, data: 'push queued' });
              break;
          }
        } catch (error) {
          console.error(`Error sending ${channel} notification:`, error);
          results.push({ channel, success: false, error: error.message });
        }
      } else {
        results.push({ channel, success: false, reason: 'disabled by preferences' });
      }
    }

    return results;
  }

  // Notify provider when patient completes intake (using preferences)
  static async notifyIntakeCompleted(appointmentId: string, patientId: string, providerId: string) {
    try {
      // Get patient and appointment details
      const [patientResult, appointmentResult] = await Promise.all([
        supabase.from('patients').select('first_name, last_name').eq('id', patientId).single(),
        supabase.from('appointments').select('appointment_type, date, time').eq('id', appointmentId).single()
      ]);

      const patient = patientResult.data;
      const appointment = appointmentResult.data;

      if (!patient || !appointment) return;

      const patientName = `${patient.first_name} ${patient.last_name}`;
      const title = 'Patient Intake Completed';
      const message = `${patientName} has completed their intake for ${appointment.appointment_type} on ${appointment.date}`;
      
      return await this.sendNotificationWithPreferences(
        providerId,
        'intake_completed',
        title,
        message,
        {
          appointmentId,
          patientId,
          actionUrl: `/provider/patient-prep/${appointmentId}`
        }
      );
    } catch (error) {
      console.error('Error notifying intake completed:', error);
    }
  }

  // Notify provider of upcoming appointments with prep info (using preferences)
  static async notifyUpcomingAppointment(appointmentId: string, providerId: string) {
    try {
      const { data: appointment, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .eq('id', appointmentId)
        .single();

      if (error || !appointment) return;

      const patient = Array.isArray(appointment.patients) ? appointment.patients[0] : appointment.patients;
      if (!patient) return;

      const patientName = `${patient.first_name} ${patient.last_name}`;
      const title = 'Upcoming Appointment - Prep Available';
      const message = `${patientName} - ${appointment.appointment_type} in 30 minutes. Review patient prep.`;
      
      return await this.sendNotificationWithPreferences(
        providerId,
        'upcoming_appointment',
        title,
        message,
        {
          appointmentId,
          patientId: appointment.patient_id,
          actionUrl: `/provider/patient-prep/${appointmentId}`
        }
      );
    } catch (error) {
      console.error('Error notifying upcoming appointment:', error);
    }
  }

  // Get notifications for a provider
  static async getProviderNotifications(providerId: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('provider_notifications')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching provider notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProviderNotifications:', error);
      return [];
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('provider_notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
      }
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  }

  // Get unread count for a provider
  static async getUnreadCount(providerId: string) {
    try {
      const { count, error } = await supabase
        .from('provider_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', providerId)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      return 0;
    }
  }
}
