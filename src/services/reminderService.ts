
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

      // Get message template
      const { data: template, error: templateError } = await supabase
        .from('message_templates')
        .select('*')
        .eq('id', options.templateId)
        .single();

      if (templateError) throw templateError;

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

      // Replace template variables
      const messageContent = this.replaceTemplateVariables(template.content, {
        patientName: appointment.patients?.first_name + ' ' + appointment.patients?.last_name,
        appointmentDate: appointment.date,
        appointmentTime: appointment.time,
        appointmentType: appointment.appointment_type,
        doctorName: 'Dr. Smith' // This could come from provider data
      });

      // Create scheduled reminder
      const { data, error } = await supabase
        .from('scheduled_reminders')
        .insert({
          appointment_id: options.appointmentId,
          patient_id: options.patientId,
          template_id: options.templateId,
          recipient_phone: options.recipientPhone,
          recipient_email: options.recipientEmail,
          message_content: messageContent,
          scheduled_for: scheduledFor.toISOString(),
          delivery_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      throw error;
    }
  }

  static async processPendingReminders() {
    try {
      const now = new Date();
      
      // Get reminders that are due to be sent
      const { data: pendingReminders, error } = await supabase
        .from('scheduled_reminders')
        .select('*')
        .eq('delivery_status', 'pending')
        .lte('scheduled_for', now.toISOString())
        .order('scheduled_for', { ascending: true });

      if (error) throw error;

      console.log(`Processing ${pendingReminders?.length || 0} pending reminders`);

      // Process each reminder
      for (const reminder of pendingReminders || []) {
        try {
          await this.sendReminder(reminder.id);
        } catch (err) {
          console.error(`Failed to send reminder ${reminder.id}:`, err);
        }
      }
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
      // Find the most recent reminder for this phone number
      const { data: reminder, error } = await supabase
        .from('scheduled_reminders')
        .select('*')
        .eq('recipient_phone', phoneNumber)
        .eq('delivery_status', 'sent')
        .order('sent_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !reminder) {
        console.log('No matching reminder found for response');
        return;
      }

      // Update reminder with response
      await supabase
        .from('scheduled_reminders')
        .update({
          response_received: true,
          response_content: message
        })
        .eq('id', reminder.id);

      // Classify the response using AI
      const classification = await this.classifyResponse(message);
      
      // Store AI classification
      await supabase
        .from('ai_response_classifications')
        .insert({
          reminder_id: reminder.id,
          original_message: message,
          classified_intent: classification.intent,
          confidence_score: classification.confidence,
          suggested_action: classification.suggestedAction,
          urgency_level: classification.urgency
        });

      return classification;
    } catch (error) {
      console.error('Error processing incoming response:', error);
      throw error;
    }
  }

  private static async classifyResponse(message: string) {
    // Simple rule-based classification (could be enhanced with AI)
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
      const { data: stats, error } = await supabase
        .from('scheduled_reminders')
        .select('delivery_status')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const total = stats.length;
      const sent = stats.filter(s => s.delivery_status === 'sent').length;
      const pending = stats.filter(s => s.delivery_status === 'pending').length;
      const failed = stats.filter(s => s.delivery_status === 'failed').length;

      return {
        total,
        sent,
        pending,
        failed,
        successRate: total > 0 ? Math.round((sent / total) * 100) : 0
      };
    } catch (error) {
      console.error('Error getting reminder stats:', error);
      return { total: 0, sent: 0, pending: 0, failed: 0, successRate: 0 };
    }
  }
}
