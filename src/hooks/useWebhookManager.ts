import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type WebhookPlatform = 'zapier' | 'n8n' | 'custom';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  platform: WebhookPlatform;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered?: string;
  createdAt: string;
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

export const useWebhookManager = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demo - in production this would come from database
  useEffect(() => {
    const mockWebhooks: WebhookEndpoint[] = [
      {
        id: '1',
        name: 'EZBIS Integration',
        url: 'https://api.ezbis.com/webhooks/appointments',
        platform: 'custom',
        events: ['appointment.created', 'appointment.updated'],
        status: 'active',
        lastTriggered: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        headers: {
          'Authorization': 'Bearer ***',
          'X-API-Key': '***'
        },
        retryConfig: { maxRetries: 3, retryDelay: 5000 }
      },
      {
        id: '2',
        name: 'Zapier - Patient Notifications',
        url: 'https://hooks.zapier.com/hooks/catch/12345/abcdef/',
        platform: 'zapier',
        events: ['appointment.no_show', 'appointment.completed'],
        status: 'active',
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        retryConfig: { maxRetries: 5, retryDelay: 2000 }
      },
      {
        id: '3',
        name: 'N8N - DentalRem Sync',
        url: 'https://n8n.example.com/webhook/dental-rem-sync',
        platform: 'n8n',
        events: ['intake.completed', 'appointment.created'],
        status: 'active',
        lastTriggered: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        headers: {
          'X-API-Key': '***'
        },
        retryConfig: { maxRetries: 3, retryDelay: 3000 }
      },
      {
        id: '4',
        name: 'N8N - DS3 Sleep Studies',
        url: 'https://n8n.example.com/webhook/ds3-integration',
        platform: 'n8n',
        events: ['sleep_study.completed', 'appliance.delivered'],
        status: 'error',
        lastTriggered: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        destinationConfig: {
          dataMapping: {
            'patient_id': 'ds3_patient_id',
            'study_results': 'ahi_score'
          }
        }
      }
    ];
    setWebhooks(mockWebhooks);
  }, []);

  const testWebhook = async (webhook: WebhookEndpoint) => {
    setIsLoading(true);
    
    try {
      const testPayload = {
        event: webhook.events[0] || 'test.event',
        timestamp: new Date().toISOString(),
        test: true,
        data: generateSampleData(webhook.events[0] || 'test.event')
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'AppointmentIQ-Webhook/1.0',
        'X-Webhook-ID': webhook.id,
        ...webhook.headers
      };

      // Add signature if secret key exists
      if (webhook.secretKey) {
        const signature = await generateSignature(JSON.stringify(testPayload), webhook.secretKey);
        headers['X-Webhook-Signature'] = signature;
      }

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        // Update webhook status
        setWebhooks(prev => prev.map(w => 
          w.id === webhook.id 
            ? { ...w, status: 'active', lastTriggered: new Date().toISOString() }
            : w
        ));
        
        toast({
          title: "Webhook Test Successful",
          description: `Test payload sent to ${webhook.name}`,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Webhook test error:', error);
      
      // Update webhook status to error
      setWebhooks(prev => prev.map(w => 
        w.id === webhook.id 
          ? { ...w, status: 'error' }
          : w
      ));
      
      toast({
        title: "Webhook Test Failed",
        description: error.message || "Failed to send webhook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addWebhook = (webhookData: Omit<WebhookEndpoint, 'id' | 'createdAt' | 'status'>) => {
    const newWebhook: WebhookEndpoint = {
      ...webhookData,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      retryConfig: webhookData.retryConfig || { maxRetries: 3, retryDelay: 5000 }
    };

    setWebhooks(prev => [...prev, newWebhook]);
    
    toast({
      title: "Webhook Added",
      description: "Your webhook endpoint has been registered successfully",
    });

    return newWebhook;
  };

  const updateWebhook = (id: string, updates: Partial<WebhookEndpoint>) => {
    setWebhooks(prev => prev.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
    
    toast({
      title: "Webhook Updated",
      description: "Your webhook settings have been saved",
    });
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    
    toast({
      title: "Webhook Deleted",
      description: "The webhook endpoint has been removed",
    });
  };

  const retryFailedWebhook = async (id: string) => {
    const webhook = webhooks.find(w => w.id === id);
    if (webhook) {
      await testWebhook(webhook);
    }
  };

  return {
    webhooks,
    isLoading,
    testWebhook,
    addWebhook,
    updateWebhook,
    deleteWebhook,
    retryFailedWebhook
  };
};

// Helper functions
const generateSampleData = (eventType: string) => {
  const baseData = {
    appointment_id: 'apt_' + Math.random().toString(36).substr(2, 9),
    patient_name: 'John Doe',
    provider_name: 'Dr. Sarah Johnson',
    timestamp: new Date().toISOString()
  };

  switch (eventType) {
    case 'appointment.created':
      return {
        ...baseData,
        appointment_type: 'Initial Consultation',
        date: new Date().toISOString().split('T')[0],
        time: '14:30',
        status: 'confirmed'
      };
    case 'appointment.completed':
      return {
        ...baseData,
        completed_at: new Date().toISOString(),
        duration: 45,
        notes: 'Patient responded well to treatment'
      };
    case 'appointment.no_show':
      return {
        ...baseData,
        scheduled_time: new Date().toISOString(),
        no_show_time: new Date().toISOString()
      };
    case 'intake.completed':
      return {
        ...baseData,
        form_id: 'form_' + Math.random().toString(36).substr(2, 9),
        submission_data: {
          chief_complaint: 'Lower back pain',
          duration: '2 weeks',
          severity: '7/10'
        }
      };
    default:
      return baseData;
  }
};

const generateSignature = async (payload: string, secret: string): Promise<string> => {
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
};