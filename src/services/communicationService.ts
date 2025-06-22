
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
      // Call the edge function directly for now, which will handle logging
      const { data, error } = await supabase.functions.invoke('send-communication', {
        body: request
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
      // Return empty array for now until database types are available
      console.log('Getting communication logs for submission:', submissionId);
      return [];
    } catch (error) {
      console.error('Failed to get communication logs:', error);
      return [];
    }
  }

  static async updateCommunicationStatus(logId: string, status: string, deliveredAt?: string) {
    try {
      console.log('Updating communication status:', logId, status, deliveredAt);
      // This will be implemented once database types are available
    } catch (error) {
      console.error('Failed to update communication status:', error);
    }
  }
}
