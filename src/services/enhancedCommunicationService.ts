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

export interface CommunicationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'voice' | 'in-app';
  status: 'active' | 'inactive' | 'error';
  enabled: boolean;
  lastUsed?: string;
  successRate: number;
  description: string;
  provider: string;
  config?: Record<string, any>;
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: 'appointment' | 'reminder' | 'follow-up' | 'marketing' | 'custom';
  subject?: string;
  content: string;
  variables: string[];
  channel: 'email' | 'sms' | 'both';
  enabled: boolean;
  usageCount: number;
  lastUsed?: string;
}

export interface MessageHistory {
  id: string;
  recipient: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
  templateId?: string;
}

class EnhancedCommunicationService {
  private channels: CommunicationChannel[] = [
    {
      id: 'sendgrid-email',
      name: 'SendGrid Email',
      type: 'email',
      status: 'active',
      enabled: true,
      lastUsed: new Date().toISOString(),
      successRate: 98.5,
      description: 'Primary email service for patient communications',
      provider: 'SendGrid',
      config: {
        apiKey: 'configured',
        fromEmail: 'noreply@flow-iq.ai',
        fromName: 'FlowIQ Healthcare'
      }
    },
    {
      id: 'twilio-sms',
      name: 'Twilio SMS',
      type: 'sms',
      status: 'active',
      enabled: true,
      lastUsed: new Date().toISOString(),
      successRate: 99.2,
      description: 'SMS service for text message communications',
      provider: 'Twilio',
      config: {
        accountSid: 'configured',
        authToken: 'configured',
        phoneNumber: '+1234567890'
      }
    },
    {
      id: 'vapi-voice',
      name: 'Vapi Voice',
      type: 'voice',
      status: 'active',
      enabled: true,
      lastUsed: new Date().toISOString(),
      successRate: 95.8,
      description: 'AI voice assistant for automated calls',
      provider: 'Vapi',
      config: {
        apiKey: 'configured',
        assistantId: 'configured'
      }
    },
    {
      id: 'in-app-notifications',
      name: 'In-App Notifications',
      type: 'in-app',
      status: 'active',
      enabled: true,
      lastUsed: new Date().toISOString(),
      successRate: 100,
      description: 'Internal notification system',
      provider: 'FlowIQ',
      config: {
        webhookUrl: 'configured'
      }
    }
  ];

  private templates: MessageTemplate[] = [
    {
      id: 'appointment-confirmation',
      name: 'Appointment Confirmation',
      type: 'appointment',
      subject: 'Appointment Confirmed - {{practiceName}}',
      content: 'Hi {{patientName}}, your appointment on {{appointmentDate}} at {{appointmentTime}} has been confirmed. Please arrive 15 minutes early. Call {{phoneNumber}} if you need to reschedule.',
      variables: ['patientName', 'appointmentDate', 'appointmentTime', 'practiceName', 'phoneNumber'],
      channel: 'both',
      enabled: true,
      usageCount: 1247,
      lastUsed: new Date().toISOString()
    },
    {
      id: 'appointment-reminder',
      name: 'Appointment Reminder',
      type: 'reminder',
      subject: 'Appointment Reminder - {{practiceName}}',
      content: 'Hi {{patientName}}, this is a reminder for your appointment tomorrow at {{appointmentTime}}. Please call {{phoneNumber}} if you need to reschedule.',
      variables: ['patientName', 'appointmentTime', 'practiceName', 'phoneNumber'],
      channel: 'both',
      enabled: true,
      usageCount: 892,
      lastUsed: new Date().toISOString()
    },
    {
      id: 'follow-up-survey',
      name: 'Follow-up Survey',
      type: 'follow-up',
      subject: 'How was your visit? - {{practiceName}}',
      content: 'Hi {{patientName}}, thank you for visiting us. We hope your experience was excellent. Please take a moment to share your feedback: {{surveyLink}}',
      variables: ['patientName', 'practiceName', 'surveyLink'],
      channel: 'email',
      enabled: true,
      usageCount: 456,
      lastUsed: new Date().toISOString()
    },
    {
      id: 'marketing-newsletter',
      name: 'Healthcare Newsletter',
      type: 'marketing',
      subject: '{{practiceName}} - Monthly Health Tips',
      content: 'Hi {{patientName}}, here are this month\'s health tips and updates from {{practiceName}}. Read more: {{newsletterLink}}',
      variables: ['patientName', 'practiceName', 'newsletterLink'],
      channel: 'email',
      enabled: true,
      usageCount: 234,
      lastUsed: new Date().toISOString()
    }
  ];

  private messageHistory: MessageHistory[] = [
    {
      id: 'msg-001',
      recipient: 'john.doe@email.com',
      type: 'email',
      subject: 'Appointment Confirmed - FlowIQ Healthcare',
      content: 'Hi John Doe, your appointment on 2024-01-20 at 09:00 AM has been confirmed...',
      status: 'delivered',
      sentAt: '2024-01-19T10:30:00Z',
      deliveredAt: '2024-01-19T10:30:05Z',
      templateId: 'appointment-confirmation'
    },
    {
      id: 'msg-002',
      recipient: '+1555012345',
      type: 'sms',
      content: 'Hi John Doe, this is a reminder for your appointment tomorrow at 09:00 AM...',
      status: 'delivered',
      sentAt: '2024-01-19T14:00:00Z',
      deliveredAt: '2024-01-19T14:00:02Z',
      templateId: 'appointment-reminder'
    },
    {
      id: 'msg-003',
      recipient: 'jane.smith@email.com',
      type: 'email',
      subject: 'How was your visit? - FlowIQ Healthcare',
      content: 'Hi Jane Smith, thank you for visiting us. We hope your experience was excellent...',
      status: 'sent',
      sentAt: '2024-01-18T16:00:00Z',
      templateId: 'follow-up-survey'
    }
  ];

  async getChannels(): Promise<CommunicationChannel[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.channels;
  }

  async updateChannel(id: string, updates: Partial<CommunicationChannel>): Promise<CommunicationChannel> {
    const index = this.channels.findIndex(channel => channel.id === id);
    if (index === -1) {
      throw new Error(`Channel with id ${id} not found`);
    }

    this.channels[index] = { ...this.channels[index], ...updates };
    return this.channels[index];
  }

  async getTemplates(): Promise<MessageTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.templates;
  }

  async createTemplate(template: Omit<MessageTemplate, 'id' | 'usageCount'>): Promise<MessageTemplate> {
    const newTemplate: MessageTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      usageCount: 0
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate> {
    const index = this.templates.findIndex(template => template.id === id);
    if (index === -1) {
      throw new Error(`Template with id ${id} not found`);
    }

    this.templates[index] = { ...this.templates[index], ...updates };
    return this.templates[index];
  }

  async getMessageHistory(limit: number = 50): Promise<MessageHistory[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.messageHistory.slice(0, limit);
  }

  async sendMessage(message: {
    recipient: string;
    type: 'email' | 'sms';
    subject?: string;
    content: string;
    templateId?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate message sending
    const success = Math.random() > 0.1; // 90% success rate
    const messageId = `msg-${Date.now()}`;

    if (success) {
      const historyEntry: MessageHistory = {
        id: messageId,
        recipient: message.recipient,
        type: message.type,
        subject: message.subject,
        content: message.content,
        status: 'sent',
        sentAt: new Date().toISOString(),
        templateId: message.templateId
      };

      this.messageHistory.unshift(historyEntry);

      // Update template usage count
      if (message.templateId) {
        const template = this.templates.find(t => t.id === message.templateId);
        if (template) {
          template.usageCount++;
          template.lastUsed = new Date().toISOString();
        }
      }

      return { success: true, messageId };
    } else {
      return {
        success: false,
        error: 'Message delivery failed - recipient not found'
      };
    }
  }

  async sendBulkMessages(messages: Array<{
    recipient: string;
    type: 'email' | 'sms';
    subject?: string;
    content: string;
    templateId?: string;
  }>): Promise<{
    success: boolean;
    sent: number;
    failed: number;
    errors: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const message of messages) {
      const result = await this.sendMessage(message);
      if (result.success) {
        sent++;
      } else {
        failed++;
        errors.push(`Failed to send to ${message.recipient}: ${result.error}`);
      }
    }

    return {
      success: failed === 0,
      sent,
      failed,
      errors
    };
  }

  async testChannel(channelId: string): Promise<{ success: boolean; message: string }> {
    const channel = this.channels.find(c => c.id === channelId);
    if (!channel) {
      throw new Error(`Channel with id ${channelId} not found`);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const testResults = {
      'sendgrid-email': { success: true, message: 'Email service test successful' },
      'twilio-sms': { success: true, message: 'SMS service test successful' },
      'vapi-voice': { success: true, message: 'Voice service test successful' },
      'in-app-notifications': { success: true, message: 'In-app notification test successful' }
    };

    return testResults[channelId] || { success: false, message: 'Channel test failed' };
  }

  async getChannelStats(channelId: string): Promise<{
    totalSent: number;
    successRate: number;
    averageDeliveryTime: number;
    lastUsed: string;
  }> {
    const channel = this.channels.find(c => c.id === channelId);
    if (!channel) {
      throw new Error(`Channel with id ${channelId} not found`);
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    const stats = {
      'sendgrid-email': {
        totalSent: 1247,
        successRate: 98.5,
        averageDeliveryTime: 2.3,
        lastUsed: channel.lastUsed || new Date().toISOString()
      },
      'twilio-sms': {
        totalSent: 892,
        successRate: 99.2,
        averageDeliveryTime: 1.8,
        lastUsed: channel.lastUsed || new Date().toISOString()
      },
      'vapi-voice': {
        totalSent: 456,
        successRate: 95.8,
        averageDeliveryTime: 15.2,
        lastUsed: channel.lastUsed || new Date().toISOString()
      },
      'in-app-notifications': {
        totalSent: 234,
        successRate: 100,
        averageDeliveryTime: 0.5,
        lastUsed: channel.lastUsed || new Date().toISOString()
      }
    };

    return stats[channelId] || {
      totalSent: 0,
      successRate: 0,
      averageDeliveryTime: 0,
      lastUsed: new Date().toISOString()
    };
  }
}

export const enhancedCommunicationService = new EnhancedCommunicationService();