import { supabase } from '@/integrations/supabase/client';
import { addHours, addMinutes } from 'date-fns';

export interface ReminderScheduleOptions {
  appointmentId: string;
  patientId: string;
  templateId: string;
  recipientPhone?: string;
  recipientEmail?: string;
  messageType: 'sms' | 'email';
  reminderTime: 'immediate' | '1hour' | '24hours' | '72hours' | 'custom';
  customTime?: string;
}

export class ReminderService {
  static async scheduleAppointmentReminder(options: ReminderScheduleOptions) {
    try {
      // Get appointment details
      const { data: appointment, error: aptError } = await supabase
        .from('appointments')
        .select('*, patients(*)')
        .eq('id', options.appointmentId)
        .single();

      if (aptError) throw aptError;

      // For now, use mock template data since we don't have the template table yet
      const mockTemplate = {
        id: options.templateId,
        content: 'Hi {{patientName}}, this is a reminder of your appointment on {{appointmentDate}} at {{appointmentTime}}.'
      };

      // Calculate scheduled time
      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      let scheduledFor: Date;

      switch (options.reminderTime) {
        case 'immediate':
          scheduledFor = new Date();
          break;
        case '1hour':
          scheduledFor = addHours(appointmentDateTime, -1);
          break;
        case '24hours':
          scheduledFor = addHours(appointmentDateTime, -24);
          break;
        case '72hours':
          scheduledFor = addHours(appointmentDateTime, -72);
          break;
        case 'custom':
          scheduledFor = new Date(options.customTime!);
          break;
        default:
          scheduledFor = addHours(appointmentDateTime, -24);
      }

      // Fix patient data access - appointment.patients is the actual patient object
      const patientName = appointment.patients ? 
        `${appointment.patients.first_name || ''} ${appointment.patients.last_name || ''}`.trim() : 
        'Patient';
      
      const messageContent = this.replaceTemplateVariables(mockTemplate.content, {
        patientName,
        appointmentDate: appointment.date,
        appointmentTime: appointment.time,
        appointmentType: appointment.appointment_type,
        doctorName: 'Dr. Smith' // This could come from provider data
      });

      // For now, just log the reminder creation since we don't have the table
      const reminderData = {
        appointment_id: options.appointmentId,
        patient_id: options.patientId,
        template_id: options.templateId,
        recipient_phone: options.recipientPhone,
        recipient_email: options.recipientEmail,
        message_content: messageContent,
        scheduled_for: scheduledFor.toISOString(),
        delivery_status: 'pending'
      };

      console.log('Mock reminder scheduled:', reminderData);
      return { id: Math.random().toString(36).substr(2, 9), ...reminderData };
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      throw error;
    }
  }

  static async processPendingReminders() {
    try {
      // Mock processing for now
      console.log('Processing pending reminders...');
      // In a real implementation, this would query the scheduled_reminders table
      // and process reminders that are due to be sent
    } catch (error) {
      console.error('Error processing pending reminders:', error);
    }
  }

  static async sendReminder(reminderId: string) {
    try {
      // Call the send-reminder edge function
      const { data, error } = await supabase.functions.invoke('send-reminder', {
        body: { reminderId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  }

  static async processIncomingResponse(phoneNumber: string, message: string) {
    try {
      // Mock response processing for now
      console.log('Processing incoming response:', { phoneNumber, message });
      
      // Classify the response using simple rules
      const classification = await this.classifyResponse(message);
      
      console.log('Response classified as:', classification);
      return classification;
    } catch (error) {
      console.error('Error processing incoming response:', error);
      throw error;
    }
  }

  private static async classifyResponse(message: string) {
    // Simple rule-based classification
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('yes') || lowerMessage.includes('confirm') || lowerMessage.includes('ok')) {
      return {
        intent: 'confirmation' as const,
        confidence: 85,
        suggestedAction: 'Mark appointment as confirmed',
        urgency: 'low' as const
      };
    }
    
    if (lowerMessage.includes('reschedule') || lowerMessage.includes('change') || lowerMessage.includes('move')) {
      return {
        intent: 'reschedule' as const,
        confidence: 90,
        suggestedAction: 'Offer available time slots',
        urgency: 'medium' as const
      };
    }
    
    if (lowerMessage.includes('cancel') || lowerMessage.includes('no') || lowerMessage.includes('cant')) {
      return {
        intent: 'cancellation' as const,
        confidence: 88,
        suggestedAction: 'Cancel appointment and offer rescheduling',
        urgency: 'medium' as const
      };
    }
    
    return {
      intent: 'unknown' as const,
      confidence: 50,
      suggestedAction: 'Review message manually',
      urgency: 'medium' as const
    };
  }

  private static replaceTemplateVariables(content: string, variables: Record<string, string>): string {
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });
    return result;
  }

  static async getReminderStats() {
    try {
      // Mock stats for now
      return {
        total: 156,
        sent: 134,
        pending: 22,
        failed: 5,
        successRate: 86
      };
    } catch (error) {
      console.error('Error getting reminder stats:', error);
      return { total: 0, sent: 0, pending: 0, failed: 0, successRate: 0 };
    }
  }
}
