
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
      // Create communication log entry first
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

      if (logError) {
        console.error('Failed to log communication:', logError);
        // Continue with sending even if logging fails
      }

      // Call the edge function to send the actual communication
      const { data, error } = await supabase.functions.invoke('send-communication', {
        body: {
          ...request,
          logId: logEntry?.id
        }
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
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
      const updateData: any = { status };
      if (deliveredAt) updateData.delivered_at = deliveredAt;

      const { error } = await supabase
        .from('communication_logs')
        .update(updateData)
        .eq('id', logId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update communication status:', error);
    }
  }
}
