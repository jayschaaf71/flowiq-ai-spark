
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
      // Log the communication attempt
      const { data: logEntry, error: logError } = await supabase
        .from('communication_logs')
        .insert({
          submission_id: request.submissionId,
          type: request.type,
          template_id: request.templateId,
          recipient: request.recipient,
          subject: request.type === 'email' ? `Message for ${request.patientName}` : null,
          message: request.customMessage || `Template: ${request.templateId}`,
          status: 'pending'
        })
        .select()
        .single();

      if (logError) throw logError;

      // Call the edge function to send the actual communication
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

      return { success: true, data };
    } catch (error) {
      console.error('Communication service error:', error);
      throw error;
    }
  }

  static async getCommunicationLogs(submissionId: string) {
    const { data, error } = await supabase
      .from('communication_logs')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateCommunicationStatus(logId: string, status: string, deliveredAt?: string) {
    const updateData: any = { status };
    if (deliveredAt) updateData.delivered_at = deliveredAt;

    const { error } = await supabase
      .from('communication_logs')
      .update(updateData)
      .eq('id', logId);

    if (error) throw error;
  }
}
