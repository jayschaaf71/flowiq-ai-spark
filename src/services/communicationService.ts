
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
      // Log the communication attempt using raw query to work around type issues
      const { data: logEntry, error: logError } = await supabase
        .rpc('execute_raw_sql', {
          query: `
            INSERT INTO communication_logs (
              submission_id, type, template_id, recipient, subject, message, status
            ) VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            RETURNING *
          `,
          params: [
            request.submissionId,
            request.type,
            request.templateId,
            request.recipient,
            request.type === 'email' ? `Message for ${request.patientName}` : null,
            request.customMessage || `Template: ${request.templateId}`
          ]
        });

      if (logError) {
        console.error('Failed to log communication:', logError);
        // Continue with sending even if logging fails
      }

      // Call the edge function to send the actual communication
      const { data, error } = await supabase.functions.invoke('send-communication', {
        body: {
          ...request,
          logId: logEntry?.[0]?.id
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
        .rpc('execute_raw_sql', {
          query: `
            SELECT * FROM communication_logs 
            WHERE submission_id = $1 
            ORDER BY created_at DESC
          `,
          params: [submissionId]
        });

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

      await supabase
        .rpc('execute_raw_sql', {
          query: deliveredAt 
            ? `UPDATE communication_logs SET status = $1, delivered_at = $2 WHERE id = $3`
            : `UPDATE communication_logs SET status = $1 WHERE id = $2`,
          params: deliveredAt 
            ? [status, deliveredAt, logId]
            : [status, logId]
        });
    } catch (error) {
      console.error('Failed to update communication status:', error);
    }
  }
}
