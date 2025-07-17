import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { webhookService } from '@/services/webhookService';
import { 
  Workflow, 
  Zap, 
  Network,
  Plus,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  TestTube,
  Database
} from 'lucide-react';

type WebhookPlatform = 'zapier' | 'n8n' | 'custom';

export const DualPlatformWebhooks = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [testMode, setTestMode] = useState(false);

  // Sample webhook configurations for different platforms
  const platformConfigs = {
    zapier: {
      name: 'Zapier Integration',
      description: 'Quick setup for popular business apps',
      icon: <Zap className="h-6 w-6 text-orange-600" />,
      benefits: [
        'No coding required',
        '5000+ app integrations',
        'Visual workflow builder',
        'HIPAA compliance on Business plans'
      ],
      sampleWebhooks: [
        { event: 'appointment.created', action: 'Create Google Calendar event' },
        { event: 'appointment.no_show', action: 'Send Slack notification' },
        { event: 'intake.completed', action: 'Add to CRM system' }
      ]
    },
    n8n: {
      name: 'N8N Automation',
      description: 'Self-hosted workflow automation with data control',
      icon: <Workflow className="h-6 w-6 text-blue-600" />,
      benefits: [
        'Complete data control',
        'Advanced data processing',
        'Cost-effective for high volume',
        'Custom integrations possible'
      ],
      sampleWebhooks: [
        { event: 'sleep_study.completed', action: 'Process DS3 integration' },
        { event: 'appliance.delivered', action: 'Update DentalRem records' },
        { event: 'billing.submitted', action: 'Sync with EZBIS' }
      ]
    }
  };

  const handleTestWebhook = async (platform: WebhookPlatform, eventType: string) => {
    setTestMode(true);
    
    try {
      const testData = generateTestData(eventType);
      
      // For demo purposes, we'll simulate the webhook call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: `${platform.toUpperCase()} Webhook Test Successful`,
        description: `Test ${eventType} event sent successfully`,
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not send test webhook",
        variant: "destructive",
      });
    } finally {
      setTestMode(false);
    }
  };

  const generateTestData = (eventType: string) => {
    const baseData = {
      patient_id: 'pat_test_12345',
      patient_name: 'Test Patient',
      timestamp: new Date().toISOString()
    };

    switch (eventType) {
      case 'sleep_study.completed':
        return {
          ...baseData,
          study_id: 'study_test_789',
          ahi_score: 15.2,
          study_type: 'home_sleep_test',
          results: {
            severity: 'mild',
            recommendation: 'oral_appliance'
          }
        };
      case 'appliance.delivered':
        return {
          ...baseData,
          appliance_id: 'app_test_456',
          appliance_type: 'mandibular_advancement',
          delivery_date: new Date().toISOString(),
          serial_number: 'SN123456789'
        };
      default:
        return baseData;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-100 to-blue-100 rounded-lg">
              <Network className="h-6 w-6 text-gray-700" />
            </div>
            Dual Platform Webhook Support
          </CardTitle>
          <CardDescription>
            Connect your practice to both Zapier and N8N for comprehensive automation
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="dental-sleep">Dental Sleep Events</TabsTrigger>
          <TabsTrigger value="testing">Webhook Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(platformConfigs).map(([platform, config]) => (
              <Card key={platform} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    {config.icon}
                    <div>
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      <CardDescription>{config.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Benefits:</h4>
                    <ul className="space-y-1">
                      {config.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sample Automations:</h4>
                    <div className="space-y-1">
                      {config.sampleWebhooks.map((webhook, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                          <Badge variant="outline">{webhook.event}</Badge>
                          <span className="text-gray-600">{webhook.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dental-sleep" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dental Sleep Medicine Events</CardTitle>
              <CardDescription>
                Specialized webhook events for sleep study and oral appliance workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {[
                  {
                    event: 'sleep_study.completed',
                    title: 'Sleep Study Completed',
                    description: 'Triggers when a sleep study is completed and results are available',
                    platforms: ['n8n', 'zapier'],
                    integrations: ['DS3 Software', 'DentalRem', 'Insurance Pre-auth']
                  },
                  {
                    event: 'appliance.delivered',
                    title: 'Oral Appliance Delivered',
                    description: 'Triggers when an oral appliance is delivered to the patient',
                    platforms: ['n8n', 'zapier'],
                    integrations: ['Billing Systems', 'Patient Portal', 'Follow-up Scheduling']
                  },
                  {
                    event: 'patient.referral',
                    title: 'Patient Referral',
                    description: 'Triggers when a patient is referred between general and sleep dentistry',
                    platforms: ['n8n', 'custom'],
                    integrations: ['EZBIS', 'DentalRem', 'Provider Communication']
                  },
                  {
                    event: 'billing.sleep_study',
                    title: 'Sleep Study Billing',
                    description: 'Triggers billing events specific to sleep study procedures',
                    platforms: ['n8n', 'custom'],
                    integrations: ['Insurance Verification', 'Claims Processing', 'Payment Tracking']
                  }
                ].map((eventConfig) => (
                  <div key={eventConfig.event} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{eventConfig.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{eventConfig.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <div className="text-xs text-gray-500">Platforms:</div>
                          {eventConfig.platforms.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="text-xs text-gray-500">Integrates with:</div>
                          {eventConfig.integrations.map((integration) => (
                            <Badge key={integration} variant="secondary" className="text-xs">
                              {integration}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Webhook Testing Suite
              </CardTitle>
              <CardDescription>
                Test your webhook integrations with sample data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {['zapier', 'n8n'].map((platform) => (
                  <div key={platform} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      {platform === 'zapier' ? 
                        <Zap className="h-5 w-5 text-orange-600" /> : 
                        <Workflow className="h-5 w-5 text-blue-600" />
                      }
                      <h4 className="font-medium">{platform.toUpperCase()} Platform Test</h4>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      {['sleep_study.completed', 'appliance.delivered', 'patient.referral'].map((eventType) => (
                        <Button
                          key={eventType}
                          variant="outline"
                          className="justify-start h-auto p-3"
                          onClick={() => handleTestWebhook(platform as WebhookPlatform, eventType)}
                          disabled={testMode}
                        >
                          <div className="text-left">
                            <div className="text-sm font-medium">Test {eventType}</div>
                            <div className="text-xs text-gray-500">Send sample webhook</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};