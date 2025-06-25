
import { supabase } from "@/integrations/supabase/client";

export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'calendar' | 'email' | 'sms' | 'payment';
  enabled: boolean;
  credentials: Record<string, any>;
  settings: Record<string, any>;
  lastSync?: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  attendees?: string[];
  location?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  variables: string[];
  maxLength: number;
}

class IntegrationService {
  async getIntegrations(): Promise<IntegrationConfig[]> {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('name');

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching integrations:', error);
      return [];
    }
  }

  async updateIntegration(id: string, config: Partial<IntegrationConfig>): Promise<void> {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({
          ...config,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating integration:', error);
      throw error;
    }
  }

  async testIntegration(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data: integration } = await supabase
        .from('integrations')
        .select('*')
        .eq('id', id)
        .single();

      if (!integration) {
        return { success: false, message: 'Integration not found' };
      }

      switch (integration.type) {
        case 'calendar':
          return await this.testCalendarIntegration(integration);
        case 'email':
          return await this.testEmailIntegration(integration);
        case 'sms':
          return await this.testSMSIntegration(integration);
        default:
          return { success: false, message: 'Unknown integration type' };
      }
    } catch (error) {
      console.error('Error testing integration:', error);
      return { success: false, message: error.message };
    }
  }

  private async testCalendarIntegration(integration: IntegrationConfig): Promise<{ success: boolean; message: string }> {
    // Test calendar connection
    try {
      // Simulate calendar API call
      const response = await fetch('/api/calendar/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          provider: integration.name,
          credentials: integration.credentials 
        })
      });

      if (response.ok) {
        return { success: true, message: 'Calendar connection successful' };
      } else {
        return { success: false, message: 'Calendar connection failed' };
      }
    } catch (error) {
      return { success: false, message: `Calendar test failed: ${error.message}` };
    }
  }

  private async testEmailIntegration(integration: IntegrationConfig): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('test-email-integration', {
        body: { 
          provider: integration.name,
          credentials: integration.credentials 
        }
      });

      if (error) throw error;
      
      return { success: true, message: 'Email integration test successful' };
    } catch (error) {
      return { success: false, message: `Email test failed: ${error.message}` };
    }
  }

  private async testSMSIntegration(integration: IntegrationConfig): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('test-sms-integration', {
        body: { 
          provider: integration.name,
          credentials: integration.credentials 
        }
      });

      if (error) throw error;
      
      return { success: true, message: 'SMS integration test successful' };
    } catch (error) {
      return { success: false, message: `SMS test failed: ${error.message}` };
    }
  }

  // Calendar Integration Methods
  async syncCalendarEvents(integrationId: string): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase.functions.invoke('sync-calendar-events', {
        body: { integrationId }
      });

      if (error) throw error;
      return data.events || [];
    } catch (error) {
      console.error('Error syncing calendar events:', error);
      return [];
    }
  }

  async createCalendarEvent(integrationId: string, event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> {
    try {
      const { data, error } = await supabase.functions.invoke('create-calendar-event', {
        body: { integrationId, event }
      });

      if (error) throw error;
      return data.event;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return null;
    }
  }

  // Email Integration Methods
  async sendEmail(templateId: string, recipient: string, variables: Record<string, string>): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('send-scheduled-email', {
        body: { templateId, recipient, variables }
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }
  }

  // SMS Integration Methods
  async sendSMS(templateId: string, recipient: string, variables: Record<string, string>): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('send-scheduled-sms', {
        body: { templateId, recipient, variables }
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  async getSMSTemplates(): Promise<SMSTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('sms_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching SMS templates:', error);
      return [];
    }
  }

  // OAuth Integration Setup
  async initiateOAuthFlow(provider: string, redirectUrl: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('initiate-oauth', {
        body: { provider, redirectUrl }
      });

      if (error) throw error;
      return data.authUrl;
    } catch (error) {
      console.error('Error initiating OAuth flow:', error);
      throw error;
    }
  }

  async completeOAuthFlow(provider: string, code: string, state: string): Promise<IntegrationConfig> {
    try {
      const { data, error } = await supabase.functions.invoke('complete-oauth', {
        body: { provider, code, state }
      });

      if (error) throw error;
      return data.integration;
    } catch (error) {
      console.error('Error completing OAuth flow:', error);
      throw error;
    }
  }
}

export const integrationService = new IntegrationService();
