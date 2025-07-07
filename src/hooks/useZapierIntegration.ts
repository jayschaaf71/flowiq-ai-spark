import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ZapierWebhook {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
}

export const useZapierIntegration = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<ZapierWebhook[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testWebhook = async (webhookUrl: string, eventType: string) => {
    setIsLoading(true);
    try {
      const testPayload = {
        event: eventType,
        timestamp: new Date().toISOString(),
        test: true,
        data: {
          appointment_id: 'test_123',
          patient_name: 'Test Patient',
          provider_name: 'Dr. Test',
          appointment_type: 'Test Appointment',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          status: 'confirmed'
        }
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(testPayload),
      });

      toast({
        title: "Test Webhook Sent",
        description: "Check your Zapier dashboard to verify the webhook was received",
      });
    } catch (error) {
      console.error('Webhook test error:', error);
      toast({
        title: "Test Failed",
        description: "Unable to send test webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addWebhook = (url: string, events: string[]) => {
    const newWebhook: ZapierWebhook = {
      id: Date.now().toString(),
      url,
      events,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setWebhooks(prev => [...prev, newWebhook]);
    
    toast({
      title: "Webhook Added",
      description: "Your Zapier webhook has been registered successfully",
    });
  };

  const removeWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    toast({
      title: "Webhook Removed",
      description: "The webhook has been deleted successfully",
    });
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(w => 
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ));
  };

  return {
    webhooks,
    isLoading,
    testWebhook,
    addWebhook,
    removeWebhook,
    toggleWebhook
  };
};