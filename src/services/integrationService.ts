
import { supabase } from "@/integrations/supabase/client";

export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'calendar' | 'email' | 'sms' | 'payment' | 'clinical' | 'ehr';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  enabled: boolean;
  lastSync?: string;
  health: number;
  description: string;
  provider: string;
  config?: Record<string, any>;
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
  private integrations: IntegrationConfig[] = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      type: 'calendar',
      status: 'connected',
      enabled: true,
      lastSync: new Date().toISOString(),
      health: 95,
      description: 'Google Calendar integration for appointment sync',
      provider: 'Google',
      config: {
        calendarId: 'primary',
        syncInterval: 300
      }
    },
    {
      id: 'outlook-calendar',
      name: 'Microsoft Outlook',
      type: 'calendar',
      status: 'disconnected',
      enabled: false,
      health: 0,
      description: 'Microsoft Outlook calendar integration',
      provider: 'Microsoft'
    },
    {
      id: 'sendgrid-email',
      name: 'SendGrid Email',
      type: 'email',
      status: 'connected',
      enabled: true,
      lastSync: new Date().toISOString(),
      health: 98,
      description: 'SendGrid email service for patient communications',
      provider: 'SendGrid',
      config: {
        apiKey: 'configured',
        fromEmail: 'noreply@flow-iq.ai'
      }
    },
    {
      id: 'twilio-sms',
      name: 'Twilio SMS',
      type: 'sms',
      status: 'connected',
      enabled: true,
      lastSync: new Date().toISOString(),
      health: 92,
      description: 'Twilio SMS service for text messages',
      provider: 'Twilio',
      config: {
        accountSid: 'configured',
        phoneNumber: '+1234567890'
      }
    },
    {
      id: 'stripe-payments',
      name: 'Stripe Payments',
      type: 'payment',
      status: 'connected',
      enabled: true,
      lastSync: new Date().toISOString(),
      health: 96,
      description: 'Stripe payment processing',
      provider: 'Stripe',
      config: {
        publishableKey: 'configured',
        webhookSecret: 'configured'
      }
    },
    {
      id: 'sleep-impressions',
      name: 'Sleep Impressions',
      type: 'clinical',
      status: 'disconnected',
      enabled: false,
      health: 0,
      description: 'Sleep study and CPAP management system',
      provider: 'Sleep Impressions'
    },
    {
      id: 'ds3-clinical',
      name: 'DS3 (DeepSpeed 3)',
      type: 'clinical',
      status: 'disconnected',
      enabled: false,
      health: 0,
      description: 'Advanced sleep diagnostics and treatment',
      provider: 'DeepSpeed'
    },
    {
      id: 'epic-ehr',
      name: 'Epic EHR',
      type: 'ehr',
      status: 'connected',
      enabled: true,
      lastSync: new Date().toISOString(),
      health: 94,
      description: 'Epic Electronic Health Records integration',
      provider: 'Epic',
      config: {
        fhirEndpoint: 'configured',
        clientId: 'configured'
      }
    }
  ];

  async getIntegrations(): Promise<IntegrationConfig[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.integrations;
  }

  async updateIntegration(id: string, updates: Partial<IntegrationConfig>): Promise<IntegrationConfig> {
    const index = this.integrations.findIndex(integration => integration.id === id);
    if (index === -1) {
      throw new Error(`Integration with id ${id} not found`);
    }

    this.integrations[index] = { ...this.integrations[index], ...updates };
    return this.integrations[index];
  }

  async testIntegration(id: string): Promise<{ success: boolean; message: string }> {
    const integration = this.integrations.find(i => i.id === id);
    if (!integration) {
      throw new Error(`Integration with id ${id} not found`);
    }

    // Simulate test delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock test results based on integration type
    const testResults = {
      'google-calendar': { success: true, message: 'Calendar sync test successful' },
      'outlook-calendar': { success: false, message: 'Authentication failed' },
      'sendgrid-email': { success: true, message: 'Email service test successful' },
      'twilio-sms': { success: true, message: 'SMS service test successful' },
      'stripe-payments': { success: true, message: 'Payment processing test successful' },
      'sleep-impressions': { success: false, message: 'API endpoint not configured' },
      'ds3-clinical': { success: false, message: 'Service not available' },
      'epic-ehr': { success: true, message: 'EHR connection test successful' }
    };

    return testResults[id] || { success: false, message: 'Test failed' };
  }

  async syncIntegration(id: string): Promise<{ success: boolean; message: string }> {
    const integration = this.integrations.find(i => i.id === id);
    if (!integration) {
      throw new Error(`Integration with id ${id} not found`);
    }

    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Update last sync time
    this.integrations = this.integrations.map(i =>
      i.id === id
        ? { ...i, lastSync: new Date().toISOString(), status: 'connected' as const }
        : i
    );

    return { success: true, message: 'Sync completed successfully' };
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
      const { data, error } = await (supabase as any)
        .from('email_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        subject: item.subject,
        body: item.body,
        variables: item.variables || []
      }));
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
      const { data, error } = await (supabase as any)
        .from('sms_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        message: item.message,
        variables: item.variables || [],
        maxLength: item.max_length || 160
      }));
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
