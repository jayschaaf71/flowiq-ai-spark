import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useZapierIntegration } from '@/hooks/useZapierIntegration';
import { 
  Zap, 
  Copy, 
  Check, 
  Calendar, 
  MessageSquare, 
  Bell, 
  UserPlus,
  ExternalLink,
  TestTube,
  Plus,
  Trash2
} from 'lucide-react';

export const ZapierIntegration = () => {
  const { toast } = useToast();
  const { webhooks, isLoading, testWebhook, addWebhook, removeWebhook } = useZapierIntegration();
  const [apiKey, setApiKey] = useState('');
  const [copiedTrigger, setCopiedTrigger] = useState<string | null>(null);
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  const zapierTriggers = [
    {
      event: 'appointment.created',
      name: 'New Appointment Booked',
      description: 'Triggers when a new appointment is scheduled',
      icon: Calendar,
      samplePayload: {
        appointment_id: 'appt_123',
        patient_name: 'John Doe',
        provider_name: 'Dr. Smith',
        appointment_type: 'Cleaning',
        date: '2024-01-15',
        time: '09:00',
        status: 'confirmed'
      }
    },
    {
      event: 'appointment.completed',
      name: 'Appointment Completed',
      description: 'Triggers when an appointment is marked as completed',
      icon: Check,
      samplePayload: {
        appointment_id: 'appt_123',
        patient_name: 'John Doe',
        provider_name: 'Dr. Smith',
        completed_at: '2024-01-15T10:00:00Z',
        visit_duration: 60
      }
    },
    {
      event: 'followup.initiated',
      name: 'Follow-up Started',
      description: 'Triggers when a follow-up sequence begins',
      icon: MessageSquare,
      samplePayload: {
        followup_id: 'fu_456',
        patient_name: 'John Doe',
        followup_type: 'post_visit_care',
        scheduled_date: '2024-01-16'
      }
    }
  ];

  const zapierActions = [
    {
      action: 'create.appointment',
      name: 'Create Appointment',
      description: 'Books a new appointment in Appointment IQ',
      icon: Calendar,
      requiredFields: ['patient_name', 'provider_id', 'date', 'time', 'appointment_type']
    },
    {
      action: 'send.intake',
      name: 'Send Intake Form',
      description: 'Sends intake form to a patient',
      icon: UserPlus,
      requiredFields: ['patient_email', 'form_id', 'appointment_id']
    },
    {
      action: 'trigger.followup',
      name: 'Trigger Follow-up',
      description: 'Initiates a follow-up sequence',
      icon: Bell,
      requiredFields: ['patient_id', 'followup_type', 'delay_hours']
    }
  ];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTrigger(type);
    setTimeout(() => setCopiedTrigger(null), 2000);
    toast({
      title: "Copied!",
      description: "Sample payload copied to clipboard",
    });
  };

  const handleTestWebhook = async (trigger: any) => {
    if (!newWebhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL first",
        variant: "destructive",
      });
      return;
    }
    await testWebhook(newWebhookUrl, trigger.event);
  };

  const handleAddWebhook = () => {
    if (!newWebhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }
    
    addWebhook(newWebhookUrl, ['appointment.created', 'appointment.completed']);
    setNewWebhookUrl('');
    setShowAddWebhook(false);
  };

  const getAPIKey = () => {
    window.open('https://zapier.com/app/developer', '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <CardTitle>Zapier Integration</CardTitle>
              <CardDescription>
                Connect Appointment IQ with 6,000+ apps using Zapier automation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your FlowIQ API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button variant="outline" onClick={getAPIKey}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Get API Key
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate an API key in your FlowIQ settings to authenticate with Zapier
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="triggers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="triggers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Triggers</CardTitle>
              <CardDescription>
                Events that can start your Zaps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {zapierTriggers.map((trigger) => (
                <div key={trigger.event} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <trigger.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{trigger.name}</h4>
                        <p className="text-sm text-muted-foreground">{trigger.description}</p>
                        <Badge variant="secondary" className="mt-2">
                          {trigger.event}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(trigger.samplePayload, null, 2), trigger.event)}
                    >
                      {copiedTrigger === trigger.event ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <details className="mt-3">
                    <summary className="text-sm font-medium cursor-pointer">Sample Payload</summary>
                    <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                      {JSON.stringify(trigger.samplePayload, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Actions</CardTitle>
              <CardDescription>
                What your Zaps can do in Appointment IQ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {zapierActions.map((action) => (
                <div key={action.action} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <action.icon className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{action.name}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      <Badge variant="secondary" className="mt-2">
                        {action.action}
                      </Badge>
                      
                      <div className="mt-3">
                        <h5 className="text-sm font-medium">Required Fields:</h5>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {action.requiredFields.map((field) => (
                            <Badge key={field} variant="outline" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Popular Zap Templates</CardTitle>
          <CardDescription>
            Get started quickly with these common automation workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <h4 className="font-medium">Calendar Sync</h4>
              <p className="text-sm text-muted-foreground">
                New appointment → Add to Google Calendar
              </p>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="font-medium">Team Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Appointment completed → Send Slack message
              </p>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="font-medium">Follow-up Email</h4>
              <p className="text-sm text-muted-foreground">
                Follow-up triggered → Send Mailchimp email
              </p>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="font-medium">CRM Integration</h4>
              <p className="text-sm text-muted-foreground">
                New appointment → Create Salesforce contact
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Webhook Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Zapier Integration
          </CardTitle>
          <CardDescription>
            Test your Zapier webhooks to ensure they're working correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Zapier Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
              />
              <Button variant="outline" onClick={() => setShowAddWebhook(!showAddWebhook)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Copy your Zapier webhook URL here to test the integration
            </p>
          </div>

          {showAddWebhook && (
            <div className="flex gap-2">
              <Button onClick={handleAddWebhook}>
                Add Webhook
              </Button>
              <Button variant="outline" onClick={() => setShowAddWebhook(false)}>
                Cancel
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zapierTriggers.slice(0, 3).map((trigger) => (
              <div key={trigger.event} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <trigger.icon className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">{trigger.name}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleTestWebhook(trigger)}
                  disabled={isLoading || !newWebhookUrl}
                >
                  {isLoading ? 'Testing...' : 'Test Trigger'}
                </Button>
              </div>
            ))}
          </div>

          {webhooks.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Active Webhooks</h4>
              <div className="space-y-2">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {webhook.url.substring(0, 50)}...
                      </code>
                      <div className="flex gap-1 mt-1">
                        {webhook.events.map(event => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeWebhook(webhook.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};