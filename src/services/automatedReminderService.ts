
import { supabase } from '@/integrations/supabase/client';
import { addHours, addMinutes, format } from 'date-fns';

export interface ReminderScheduleOptions {
  appointmentId: string;
  patientId: string;
  recipientPhone?: string;
  recipientEmail?: string;
  reminderType: 'symptom_assessment' | 'appointment_confirmation' | 'appointment_reminder' | 'instructions';
  hoursBeforeAppointment?: number;
  customMessage?: string;
}

export class AutomatedReminderService {
  // Schedule automated reminders for an appointment
  static async scheduleAppointmentReminders(appointmentId: string) {
    try {
      // Get appointment details with patient info
      const { data: appointment, error: aptError } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('id', appointmentId)
        .single();

      if (aptError || !appointment) {
        console.error('Error fetching appointment:', aptError);
        return;
      }

      const patient = Array.isArray(appointment.patients) ? appointment.patients[0] : appointment.patients;
      if (!patient) return;

      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      
      // Schedule symptom assessment reminder (24 hours before)
      await this.scheduleReminder({
        appointmentId,
        patientId: appointment.patient_id,
        recipientEmail: patient.email,
        recipientPhone: patient.phone,
        reminderType: 'symptom_assessment',
        hoursBeforeAppointment: 24
      });

      // Schedule appointment reminder (2 hours before)
      await this.scheduleReminder({
        appointmentId,
        patientId: appointment.patient_id,
        recipientEmail: patient.email,
        recipientPhone: patient.phone,
        reminderType: 'appointment_reminder',
        hoursBeforeAppointment: 2
      });

      console.log(`Scheduled reminders for appointment ${appointmentId}`);
    } catch (error) {
      console.error('Error scheduling appointment reminders:', error);
    }
  }

  // Schedule a specific reminder
  static async scheduleReminder(options: ReminderScheduleOptions) {
    try {
      // Get appointment details for scheduling
      const { data: appointment } = await supabase
        .from('appointments')
        .select('date, time, title, appointment_type')
        .eq('id', options.appointmentId)
        .single();

      if (!appointment) return;

      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const scheduledFor = addHours(appointmentDateTime, -(options.hoursBeforeAppointment || 24));

      // Create message content based on reminder type
      const messageContent = this.generateMessageContent(options.reminderType, {
        appointmentDate: format(appointmentDateTime, 'MMMM dd, yyyy'),
        appointmentTime: format(appointmentDateTime, 'h:mm a'),
        appointmentType: appointment.appointment_type,
        title: appointment.title
      });

      // Insert reminder into database
      const { error } = await supabase
        .from('scheduled_reminders')
        .insert({
          appointment_id: options.appointmentId,
          patient_id: options.patientId,
          recipient_phone: options.recipientPhone,
          recipient_email: options.recipientEmail,
          message_content: options.customMessage || messageContent,
          scheduled_for: scheduledFor.toISOString(),
          delivery_status: 'pending'
        });

      if (error) {
        console.error('Error scheduling reminder:', error);
      }
    } catch (error) {
      console.error('Error in scheduleReminder:', error);
    }
  }

  // Generate message content based on reminder type
  private static generateMessageContent(type: string, context: any): string {
    switch (type) {
      case 'symptom_assessment':
        return `Hi! You have an appointment for ${context.appointmentType} tomorrow at ${context.appointmentTime}. Please complete your symptom assessment to help us prepare for your visit: [LINK]`;
      
      case 'appointment_reminder':
        return `Reminder: You have an appointment for ${context.appointmentType} today at ${context.appointmentTime}. Please arrive 15 minutes early.`;
      
      case 'appointment_confirmation':
        return `Your appointment for ${context.appointmentType} on ${context.appointmentDate} at ${context.appointmentTime} has been confirmed. We look forward to seeing you!`;
      
      case 'instructions':
        return `Pre-visit instructions for your ${context.appointmentType} appointment on ${context.appointmentDate}: Please bring a valid ID and insurance card. Arrive 15 minutes early to complete check-in.`;
      
      default:
        return `You have an appointment on ${context.appointmentDate} at ${context.appointmentTime}.`;
    }
  }

  // Process pending reminders (called by cron job)
  static async processPendingReminders() {
    try {
      const now = new Date();
      
      // Get reminders that are due to be sent
      const { data: reminders, error } = await supabase
        .from('scheduled_reminders')
        .select('*')
        .eq('delivery_status', 'pending')
        .lte('scheduled_for', now.toISOString())
        .order('scheduled_for', { ascending: true });

      if (error) {
        console.error('Error fetching pending reminders:', error);
        return;
      }

      for (const reminder of reminders || []) {
        await this.sendReminder(reminder.id);
        
        // Add small delay between sends
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error processing pending reminders:', error);
    }
  }

  // Send a specific reminder
  static async sendReminder(reminderId: string) {
    try {
      // For now, simulate sending - in production this would call email/SMS services
      console.log(`Sending reminder ${reminderId}`);
      
      // Update reminder status
      const { error } = await supabase
        .from('scheduled_reminders')
        .update({
          delivery_status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', reminderId);

      if (error) {
        console.error('Error updating reminder status:', error);
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  }

  // Get reminder statistics
  static async getReminderStats() {
    try {
      const { data, error } = await supabase
        .from('scheduled_reminders')
        .select('delivery_status');

      if (error) return { total: 0, sent: 0, pending: 0, failed: 0 };

      const stats = (data || []).reduce((acc: any, reminder: any) => {
        acc.total++;
        if (reminder.delivery_status === 'sent') acc.sent++;
        else if (reminder.delivery_status === 'pending') acc.pending++;
        else if (reminder.delivery_status === 'failed') acc.failed++;
        return acc;
      }, { total: 0, sent: 0, pending: 0, failed: 0 });

      return stats;
    } catch (error) {
      console.error('Error getting reminder stats:', error);
      return { total: 0, sent: 0, pending: 0, failed: 0 };
    }
  }
}
