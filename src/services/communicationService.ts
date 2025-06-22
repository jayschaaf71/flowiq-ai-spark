
import { supabase } from '@/integrations/supabase/client';

export interface CommunicationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'sms';
}

export interface SendCommunicationRequest {
  submissionId: string;
  templateId: string;
  recipient: string;
  patientName: string;
  customMessage?: string;
  type: 'email' | 'sms';
}

export class CommunicationService {
  static async sendCommunication(request: SendCommunicationRequest) {
    try {
      // Check if this is a test submission (UUID that doesn't exist in database)
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
            message: request.customMessage || `Hello ${request.patientName}, this is an automated message from our intake system.`,
            template_id: request.templateId,
            status: 'pending'
          })
          .select()
          .single();
        
        if (logError) throw logError;
        logEntry = logData;
      } else {
        // Test submission - create a test submission first, then the log
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

        // Now create the log entry
        const { data: logData, error: logError } = await supabase
          .from('communication_logs')
          .insert({
            submission_id: request.submissionId,
            type: request.type,
            recipient: request.recipient,
            subject: request.type === 'email' ? `Message for ${request.patientName}` : null,
            message: request.customMessage || `Hello ${request.patientName}, this is an automated message from our intake system.`,
            template_id: request.templateId,
            status: 'pending'
          })
          .select()
          .single();

        if (logError) throw logError;
        logEntry = logData;
      }

      // Call the edge function with the log ID
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
      console.error('Communication service error:', error);
      throw error;
    }
  }

  static async getCommunicationLogs(submissionId: string) {
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .select('*')
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get communication logs:', error);
      return [];
    }
  }

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
}
