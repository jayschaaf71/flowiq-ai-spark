
import { supabase } from '@/integrations/supabase/client';

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
  // Create a notification for a provider
  static async createNotification(notification: Omit<ProviderNotification, 'id' | 'created_at' | 'is_read'>) {
    try {
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

  // Notify provider when patient completes intake
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
      
      await this.createNotification({
        provider_id: providerId,
        appointment_id: appointmentId,
        patient_id: patientId,
        notification_type: 'intake_completed',
        title: 'Patient Intake Completed',
        message: `${patientName} has completed their intake for ${appointment.appointment_type} on ${appointment.date}`,
        action_url: `/provider/patient-prep/${appointmentId}`
      });
    } catch (error) {
      console.error('Error notifying intake completed:', error);
    }
  }

  // Notify provider of upcoming appointments with prep info
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
      
      await this.createNotification({
        provider_id: providerId,
        appointment_id: appointmentId,
        patient_id: appointment.patient_id,
        notification_type: 'upcoming_appointment',
        title: 'Upcoming Appointment - Prep Available',
        message: `${patientName} - ${appointment.appointment_type} in 30 minutes. Review patient prep.`,
        action_url: `/provider/patient-prep/${appointmentId}`
      });
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
