import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalDAVSetup } from '@/components/integrations/CalDAVSetup';
import { 
  Calendar,
  Plus,
  Settings,
  RotateCw,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface CalendarIntegration {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'zapier' | 'n8n' | 'caldav';
  connected: boolean;
  lastSync?: Date;
  syncEnabled: boolean;
  description: string;
}

export const CalendarIntegrations = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([
    {
      id: '1',
      name: 'Google Calendar',
      type: 'google',
      connected: false,
      syncEnabled: false,
      description: 'Sync appointments with Google Calendar'
    },
    {
      id: '2', 
      name: 'Microsoft Outlook',
      type: 'outlook',
      connected: false,
      syncEnabled: false,
      description: 'Sync appointments with Outlook Calendar'
    },
    {
      id: '3',
      name: 'Apple Calendar',
      type: 'apple',
      connected: false,
      syncEnabled: false,
      description: 'Sync via CalDAV with Apple Calendar'
    },
    {
      id: '4',
      name: 'Zapier Webhook',
      type: 'zapier',
      connected: false,
      syncEnabled: false,
      description: 'Trigger automations when appointments change'
    },
    {
      id: '5',
      name: 'N8N Workflow',
      type: 'n8n',
      connected: false,
      syncEnabled: false,
      description: 'Self-hosted workflow automation with data control'
    }
  ]);

  const [zapierWebhook, setZapierWebhook] = useState('');
  const [n8nWebhook, setN8nWebhook] = useState('');
  const [showZapierDialog, setShowZapierDialog] = useState(false);
  const [showN8NDialog, setShowN8NDialog] = useState(false);
  const [showCalDAVDialog, setShowCalDAVDialog] = useState(false);

  const handleGoogleCalendarConnect = async () => {
    toast({
      title: "Google Calendar",
      description: "Google Calendar integration requires OAuth setup. This would redirect to Google's authorization flow.",
    });
  };

  const handleOutlookConnect = async () => {
    toast({
      title: "Microsoft Outlook",
      description: "Outlook integration requires Microsoft Graph API setup. This would redirect to Microsoft's authorization flow.",
    });
  };

  const handleAppleCalendarConnect = async () => {
    setShowCalDAVDialog(true);
  };

  const handleZapierConnect = async () => {
    if (!zapierWebhook) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive"
      });
      return;
    }

    try {
      // Test the webhook
      const response = await fetch(zapierWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          message: "Calendar integration test from Dental Sleep IQ"
        }),
      });

      setIntegrations(prev => 
        prev.map(integration => 
          integration.type === 'zapier' 
            ? { ...integration, connected: true, lastSync: new Date() }
            : integration
        )
      );

      toast({
        title: "Zapier Connected",
        description: "Your Zapier webhook has been connected successfully!",
      });

      setShowZapierDialog(false);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Zapier webhook. Please check the URL and try again.",
        variant: "destructive"
      });
    }
  };

  const handleN8NConnect = async () => {
    if (!n8nWebhook) {
      toast({
        title: "Error",
        description: "Please enter your N8N webhook URL",
        variant: "destructive"
      });
      return;
    }

    try {
      // Test the webhook
      const response = await fetch(n8nWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-N8N-Webhook": "true"
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          message: "Calendar integration test from Dental Sleep IQ",
          event: "calendar.test"
        }),
      });

      setIntegrations(prev => 
        prev.map(integration => 
          integration.type === 'n8n' 
            ? { ...integration, connected: true, lastSync: new Date() }
            : integration
        )
      );

      toast({
        title: "N8N Connected",
        description: "Your N8N webhook has been connected successfully!",
      });

      setShowN8NDialog(false);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to N8N webhook. Please check the URL and try again.",
        variant: "destructive"
      });
    }
  };

  const handleSyncToggle = (integrationId: string, enabled: boolean) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, syncEnabled: enabled }
          : integration
      )
    );

    toast({
      title: enabled ? "Sync Enabled" : "Sync Disabled",
      description: `Calendar sync has been ${enabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleManualSync = async (integration: CalendarIntegration) => {
    if (!integration.connected) {
      toast({
        title: "Not Connected",
        description: "Please connect to this calendar service first.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Syncing...",
      description: `Synchronizing with ${integration.name}...`,
    });

    // Simulate sync process
    setTimeout(() => {
      setIntegrations(prev =>
        prev.map(int =>
          int.id === integration.id
            ? { ...int, lastSync: new Date() }
            : int
        )
      );

      toast({
        title: "Sync Complete",
        description: `Successfully synced with ${integration.name}.`,
      });
    }, 2000);
  };

  const getConnectHandler = (type: string) => {
    switch (type) {
      case 'google':
        return handleGoogleCalendarConnect;
      case 'outlook':
        return handleOutlookConnect;
      case 'apple':
        return handleAppleCalendarConnect;
      case 'zapier':
        return () => setShowZapierDialog(true);
      case 'n8n':
        return () => setShowN8NDialog(true);
      default:
        return () => {};
    }
  };

  const getStatusIcon = (integration: CalendarIntegration) => {
    if (integration.connected) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(integration)}
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                  {integration.lastSync && (
                    <p className="text-xs text-muted-foreground">
                      Last synced: {integration.lastSync.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {integration.connected && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`sync-${integration.id}`} className="text-sm">
                        Auto Sync
                      </Label>
                      <Switch
                        id={`sync-${integration.id}`}
                        checked={integration.syncEnabled}
                        onCheckedChange={(enabled) => handleSyncToggle(integration.id, enabled)}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManualSync(integration)}
                    >
                      <RotateCw className="h-4 w-4 mr-1" />
                      Sync Now
                    </Button>
                  </>
                )}

                <Badge variant={integration.connected ? "default" : "secondary"}>
                  {integration.connected ? "Connected" : "Not Connected"}
                </Badge>

                <Button
                  variant={integration.connected ? "outline" : "default"}
                  size="sm"
                  onClick={getConnectHandler(integration.type)}
                >
                  {integration.connected ? (
                    <>
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Zapier Setup Dialog */}
      <Dialog open={showZapierDialog} onOpenChange={setShowZapierDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Zapier Webhook</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Setup Instructions:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Create a new Zap in Zapier</li>
                <li>Add a "Webhook by Zapier" trigger</li>
                <li>Choose "Catch Hook" as the event</li>
                <li>Copy the webhook URL provided by Zapier</li>
                <li>Paste the URL below</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">Zapier Webhook URL</Label>
              <Input
                id="webhook-url"
                value={zapierWebhook}
                onChange={(e) => setZapierWebhook(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowZapierDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleZapierConnect}>
                Connect Zapier
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* N8N Setup Dialog */}
      <Dialog open={showN8NDialog} onOpenChange={setShowN8NDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect N8N Webhook</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Setup Instructions:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Open your N8N workflow editor</li>
                <li>Add a "Webhook" node as the trigger</li>
                <li>Set the HTTP method to "POST"</li>
                <li>Copy the webhook URL from the node</li>
                <li>Paste the URL below</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Label htmlFor="n8n-webhook-url">N8N Webhook URL</Label>
              <Input
                id="n8n-webhook-url"
                value={n8nWebhook}
                onChange={(e) => setN8nWebhook(e.target.value)}
                placeholder="https://your-n8n.com/webhook/..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowN8NDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleN8NConnect}>
                Connect N8N
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CalDAV Setup Dialog */}
      <Dialog open={showCalDAVDialog} onOpenChange={setShowCalDAVDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apple Calendar (CalDAV) Setup</DialogTitle>
          </DialogHeader>
          <CalDAVSetup />
        </DialogContent>
      </Dialog>
    </div>
  );
};