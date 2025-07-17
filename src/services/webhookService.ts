import { supabase } from "@/integrations/supabase/client";

type WebhookPlatform = 'zapier' | 'n8n' | 'custom';

interface WebhookPayload {
  event: string;
  timestamp: string;
  data: any;
  platform?: WebhookPlatform;
  tenant_id?: string;
  source: string;
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  platform: WebhookPlatform;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  headers?: Record<string, string>;
  secretKey?: string;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
  };
  destinationConfig?: {
    dataMapping?: Record<string, string>;
    authMethod?: 'header' | 'query' | 'body';
  };
}

class WebhookService {
  // Format payload based on platform requirements
  private formatPayloadForPlatform(payload: WebhookPayload, platform: WebhookPlatform): any {
    const basePayload = {
      event: payload.event,
      timestamp: payload.timestamp,
      source: payload.source || 'AppointmentIQ',
      ...payload.data
    };

    switch (platform) {
      case 'zapier':
        // Zapier prefers flat structure with clear field names
        return {
          event_type: payload.event,
          occurred_at: payload.timestamp,
          source_system: 'AppointmentIQ',
          ...this.flattenObject(payload.data, 'data')
        };

      case 'n8n':
        // N8N can handle nested structures well
        return {
          webhook: {
            event: payload.event,
            timestamp: payload.timestamp,
            source: 'AppointmentIQ'
          },
          payload: payload.data,
          metadata: {
            tenant_id: payload.tenant_id,
            processed_at: new Date().toISOString()
          }
        };

      default:
        // Custom/standard webhook format
        return basePayload;
    }
  }

  // Flatten nested objects for Zapier compatibility
  private flattenObject(obj: any, prefix: string = ''): Record<string, any> {
    const flattened: Record<string, any> = {};
    
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(flattened, this.flattenObject(value, newKey));
      } else {
        flattened[newKey] = value;
      }
    });
    
    return flattened;
  }

  // Apply data mapping if configured
  private applyDataMapping(data: any, mapping?: Record<string, string>): any {
    if (!mapping) return data;
    
    const mappedData: any = {};
    
    Object.keys(data).forEach(key => {
      const mappedKey = mapping[key] || key;
      mappedData[mappedKey] = data[key];
    });
    
    return mappedData;
  }

  // Generate HMAC signature for webhook security
  private async generateSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return 'sha256=' + Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Send webhook with retry logic
  async sendWebhook(
    endpoint: WebhookEndpoint, 
    originalPayload: WebhookPayload,
    attempt: number = 1
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Apply data mapping if configured
      const mappedData = this.applyDataMapping(
        originalPayload.data, 
        endpoint.destinationConfig?.dataMapping
      );

      // Format payload for specific platform
      const payload = this.formatPayloadForPlatform(
        { ...originalPayload, data: mappedData }, 
        endpoint.platform
      );

      const payloadString = JSON.stringify(payload);

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'AppointmentIQ-Webhook/2.0',
        'X-Webhook-Platform': endpoint.platform,
        'X-Webhook-ID': endpoint.id,
        ...endpoint.headers
      };

      // Add signature if secret key exists
      if (endpoint.secretKey) {
        const signature = await this.generateSignature(payloadString, endpoint.secretKey);
        headers['X-Webhook-Signature'] = signature;
      }

      // Platform-specific headers
      if (endpoint.platform === 'zapier') {
        headers['X-Zapier-Webhook'] = 'true';
      } else if (endpoint.platform === 'n8n') {
        headers['X-N8N-Webhook'] = 'true';
      }

      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers,
        body: payloadString,
      });

      if (response.ok) {
        await this.logWebhookAttempt(endpoint.id, originalPayload, 'success', attempt);
        return { success: true };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';
      await this.logWebhookAttempt(endpoint.id, originalPayload, 'error', attempt, errorMessage);

      // Retry logic
      const maxRetries = endpoint.retryConfig?.maxRetries || 3;
      const retryDelay = endpoint.retryConfig?.retryDelay || 5000;

      if (attempt < maxRetries) {
        console.log(`Webhook failed, retrying in ${retryDelay}ms (attempt ${attempt + 1}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.sendWebhook(endpoint, originalPayload, attempt + 1);
      }

      return { success: false, error: errorMessage };
    }
  }

  // Send event to all matching webhooks
  async triggerWebhooks(eventType: string, eventData: any, tenantId?: string): Promise<void> {
    try {
      // In production, this would fetch from database
      const webhooks = await this.getActiveWebhooks(eventType, tenantId);
      
      const payload: WebhookPayload = {
        event: eventType,
        timestamp: new Date().toISOString(),
        data: eventData,
        tenant_id: tenantId,
        source: 'AppointmentIQ'
      };

      // Send to all matching webhooks in parallel
      const webhookPromises = webhooks.map(webhook => 
        this.sendWebhook(webhook, payload)
      );

      await Promise.allSettled(webhookPromises);
    } catch (error) {
      console.error('Error triggering webhooks:', error);
    }
  }

  // Get active webhooks for specific event type
  private async getActiveWebhooks(eventType: string, tenantId?: string): Promise<WebhookEndpoint[]> {
    // This would typically fetch from database
    // For now, return mock data filtered by event type
    const mockWebhooks: WebhookEndpoint[] = [
      {
        id: '1',
        name: 'EZBIS Integration',
        url: 'https://api.ezbis.com/webhooks/appointments',
        platform: 'custom',
        events: ['appointment.created', 'appointment.updated'],
        status: 'active',
        retryConfig: { maxRetries: 3, retryDelay: 5000 }
      },
      {
        id: '2',
        name: 'Zapier - Patient Notifications',
        url: 'https://hooks.zapier.com/hooks/catch/12345/abcdef/',
        platform: 'zapier',
        events: ['appointment.no_show', 'appointment.completed'],
        status: 'active',
        retryConfig: { maxRetries: 5, retryDelay: 2000 }
      }
    ];

    return mockWebhooks.filter(webhook => 
      webhook.status === 'active' && 
      webhook.events.includes(eventType)
    );
  }

  // Log webhook attempts for monitoring
  private async logWebhookAttempt(
    webhookId: string, 
    payload: WebhookPayload, 
    status: 'success' | 'error',
    attempt: number,
    error?: string
  ): Promise<void> {
    try {
      // Log to database or monitoring service
      console.log('Webhook attempt logged:', {
        webhookId,
        event: payload.event,
        status,
        attempt,
        error,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log webhook attempt:', error);
    }
  }

  // Helper methods for specific dental sleep integrations
  async triggerDentalSleepEvent(eventType: string, patientData: any, studyData?: any): Promise<void> {
    const eventData = {
      patient: patientData,
      study: studyData,
      practice_type: 'dental_sleep',
      integration_context: {
        supports_ds3: true,
        supports_dentalrem: true,
        requires_sleep_study_mapping: true
      }
    };

    await this.triggerWebhooks(eventType, eventData);
  }

  async triggerEZBISEvent(eventType: string, appointmentData: any): Promise<void> {
    const eventData = {
      appointment: appointmentData,
      practice_type: 'spine_joint',
      integration_context: {
        supports_billing: true,
        requires_insurance_mapping: true,
        ezbis_compatible: true
      }
    };

    await this.triggerWebhooks(eventType, eventData);
  }
}

export const webhookService = new WebhookService();