import { supabase } from '@/integrations/supabase/client';

export interface CommunicationTemplate {
  id: string;
  name: string;
  subject?: string;
  body?: string;
  message?: string;
  type: 'email' | 'sms';
  variables?: string[];
}

export interface SendCommunicationRequest {
  submissionId: string;
  templateId: string;
  recipient: string;
  patientName: string;
  customMessage?: string;
  type: 'email' | 'sms';
  variables?: Record<string, string>;
}

export interface ScheduledCommunicationRequest {
  templateId: string;
  recipient: string;
  variables: Record<string, string>;
  scheduledFor?: string;
  type: 'email' | 'sms';
}

export class EnhancedCommunicationService {
  
  // Send immediate communication
  static async sendCommunication(request: SendCommunicationRequest) {
    try {
      // Check if this is a test submission
      const { data: existingSubmission } = await supabase
        .from('intake_submissions')
        .select('id')
        .eq('id', request.submissionId)
        .single();

      let logEntry;
      
      if (existingSubmission) {
        // Real submission - create log with foreign key
        const { data: logData, error: logError } = await supabase
          .from('communication_logs')
          .insert({
            submission_id: request.submissionId,
            type: request.type,
            recipient: request.recipient,
            subject: request.type === 'email' ? `Message for ${request.patientName}` : null,
            message: request.customMessage || `Hello ${request.patientName}, this is an automated message from our system.`,
            template_id: request.templateId,
            status: 'pending'
          })
          .select()
          .single();
        
        if (logError) throw logError;
        logEntry = logData;
      } else {
        // Test submission - create a test submission first
        const { data: testSubmission, error: testSubmissionError } = await supabase
          .from('intake_submissions')
          .insert({
            id: request.submissionId,
            patient_name: request.patientName,
            patient_email: request.recipient,
            form_data: { test: true },
            status: 'test',
            form_id: (await supabase.from('intake_forms').select('id').limit(1).single()).data?.id || '00000000-0000-0000-0000-000000000000'
          })
          .select()
          .single();

        if (testSubmissionError) {
          console.error('Failed to create test submission:', testSubmissionError);
          throw new Error('Failed to create test submission for communication logging');
        }

        // Create the log entry
        const { data: logData, error: logError } = await supabase
          .from('communication_logs')
          .insert({
            submission_id: request.submissionId,
            type: request.type,
            recipient: request.recipient,
            subject: request.type === 'email' ? `Message for ${request.patientName}` : null,
            message: request.customMessage || `Hello ${request.patientName}, this is an automated message from our system.`,
            template_id: request.templateId,
            status: 'pending'
          })
          .select()
          .single();

        if (logError) throw logError;
        logEntry = logData;
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('send-communication', {
        body: {
          ...request,
          logId: logEntry.id
        }
      });

      if (error) {
        // Update log entry with error
        await supabase
          .from('communication_logs')
          .update({ 
            status: 'failed',
            error_message: error.message 
          })
          .eq('id', logEntry.id);
        throw error;
      }

      return { success: true, data, logId: logEntry.id };
    } catch (error) {
      console.error('Enhanced communication service error:', error);
      throw error;
    }
  }

  // Send scheduled email
  static async sendScheduledEmail(request: ScheduledCommunicationRequest) {
    try {
      const { data, error } = await supabase.functions.invoke('send-scheduled-email', {
        body: request
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Scheduled email service error:', error);
      throw error;
    }
  }

  // Send scheduled SMS
  static async sendScheduledSMS(request: ScheduledCommunicationRequest) {
    try {
      const { data, error } = await supabase.functions.invoke('send-scheduled-sms', {
        body: request
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Scheduled SMS service error:', error);
      throw error;
    }
  }

  // Get communication logs
  static async getCommunicationLogs(submissionId?: string) {
    try {
      let query = supabase
        .from('communication_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (submissionId) {
        query = query.eq('submission_id', submissionId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get communication logs:', error);
      return [];
    }
  }

  // Get email templates
  static async getEmailTemplates() {
    try {
      // Use any to bypass TypeScript restrictions until types are regenerated
      const { data, error } = await (supabase as any)
        .from('email_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get email templates:', error);
      return [];
    }
  }

  // Get SMS templates
  static async getSMSTemplates() {
    try {
      // Use any to bypass TypeScript restrictions until types are regenerated
      const { data, error } = await (supabase as any)
        .from('sms_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get SMS templates:', error);
      return [];
    }
  }

  // Create email template
  static async createEmailTemplate(template: Omit<CommunicationTemplate, 'id'>) {
    try {
      // Use any to bypass TypeScript restrictions until types are regenerated
      const { data, error } = await (supabase as any)
        .from('email_templates')
        .insert({
          name: template.name,
          subject: template.subject || '',
          body: template.body || '',
          variables: template.variables || []
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create email template:', error);
      throw error;
    }
  }

  // Create SMS template
  static async createSMSTemplate(template: Omit<CommunicationTemplate, 'id'>) {
    try {
      // Use any to bypass TypeScript restrictions until types are regenerated
      const { data, error } = await (supabase as any)
        .from('sms_templates')
        .insert({
          name: template.name,
          message: template.message || '',
          variables: template.variables || []
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create SMS template:', error);
      throw error;
    }
  }

  // Update communication status
  static async updateCommunicationStatus(logId: string, status: string, deliveredAt?: string) {
    try {
      const updates: any = { status };
      if (deliveredAt) {
        updates.delivered_at = deliveredAt;
      }
      if (status === 'sent') {
        updates.sent_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('communication_logs')
        .update(updates)
        .eq('id', logId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Failed to update communication status:', error);
      throw error;
    }
  }

  // Bulk send communications
  static async bulkSendCommunications(requests: SendCommunicationRequest[]) {
    const results = [];
    
    for (const request of requests) {
      try {
        const result = await this.sendCommunication(request);
        results.push({ ...result, request });
      } catch (error) {
        console.error(`Failed to send communication to ${request.recipient}:`, error);
        results.push({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          request 
        });
      }
    }

    return results;
  }

  // Send appointment reminders
  static async sendAppointmentReminders(appointmentId: string, patientEmail: string, patientPhone?: string) {
    const results = [];

    // Send email reminder
    try {
      const emailResult = await this.sendScheduledEmail({
        templateId: 'appointment-reminder',
        recipient: patientEmail,
        type: 'email',
        variables: {
          patientName: 'Patient', // This should come from appointment data
          appointmentDate: new Date().toLocaleDateString(),
          appointmentTime: '2:00 PM' // This should come from appointment data
        }
      });
      results.push({ type: 'email', ...emailResult });
    } catch (error) {
      console.error('Failed to send email reminder:', error);
      results.push({ type: 'email', success: false, error });
    }

    // Send SMS reminder if phone provided
    if (patientPhone) {
      try {
        const smsResult = await this.sendScheduledSMS({
          templateId: 'appointment-reminder-sms',
          recipient: patientPhone,
          type: 'sms',
          variables: {
            patientName: 'Patient', // This should come from appointment data
            appointmentDate: new Date().toLocaleDateString(),
            appointmentTime: '2:00 PM' // This should come from appointment data
          }
        });
        results.push({ type: 'sms', ...smsResult });
      } catch (error) {
        console.error('Failed to send SMS reminder:', error);
        results.push({ type: 'sms', success: false, error });
      }
    }

    return results;
  }
}