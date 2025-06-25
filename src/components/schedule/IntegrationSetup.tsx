
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Mail, 
  MessageSquare, 
  CreditCard,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Plus
} from 'lucide-react';
import { integrationService, IntegrationConfig } from '@/services/integrationService';
import { useToast } from '@/hooks/use-toast';

export const IntegrationSetup: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await integrationService.getIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error('Error loading integrations:', error);
      toast({
        title: "Error",
        description: "Failed to load integrations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntegration = async (id: string, enabled: boolean) => {
    try {
      await integrationService.updateIntegration(id, { enabled });
      setIntegrations(prev => 
        prev.map(int => int.id === id ? { ...int, enabled } : int)
      );
      
      toast({
        title: enabled ? "Integration Enabled" : "Integration Disabled",
        description: `Integration has been ${enabled ? 'enabled' : 'disabled'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update integration",
        variant: "destructive"
      });
    }
  };

  const handleTestIntegration = async (id: string) => {
    try {
      setTestingIntegration(id);
      const result = await integrationService.testIntegration(id);
      
      toast({
        title: result.success ? "Test Successful" : "Test Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to test integration",
        variant: "destructive"
      });
    } finally {
      setTestingIntegration(null);
    }
  };

  const handleOAuthConnect = async (provider: string) => {
    try {
      const redirectUrl = `${window.location.origin}/integrations/callback`;
      const authUrl = await integrationService.initiateOAuthFlow(provider, redirectUrl);
      window.location.href = authUrl;
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to initiate OAuth flow",
        variant: "destructive"
      });
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'calendar': return <Calendar className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'sms': return <MessageSquare className="w-5 h-5" />;
      case 'payment': return <CreditCard className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'syncing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading integrations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integration Setup</h2>
          <p className="text-gray-600">Connect and configure external services</p>
        </div>
        <Button onClick={loadIntegrations} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Calendar Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.filter(int => int.type === 'calendar').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getIntegrationIcon(integration.type)}
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusIcon(integration.status)}
                          <span className="ml-1 capitalize">{integration.status}</span>
                        </Badge>
                        {integration.lastSync && (
                          <span className="text-xs text-gray-500">
                            Last sync: {new Date(integration.lastSync).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={(enabled) => handleToggleIntegration(integration.id, enabled)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestIntegration(integration.id)}
                      disabled={testingIntegration === integration.id}
                    >
                      {testingIntegration === integration.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                    {integration.status === 'disconnected' && (
                      <Button
                        size="sm"
                        onClick={() => handleOAuthConnect(integration.name.toLowerCase())}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  Calendar integration allows automatic synchronization of appointments with your external calendar providers.
                  This prevents double-booking and keeps all your appointments in sync.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.filter(int => int.type === 'email').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getIntegrationIcon(integration.type)}
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusIcon(integration.status)}
                          <span className="ml-1 capitalize">{integration.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={(enabled) => handleToggleIntegration(integration.id, enabled)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestIntegration(integration.id)}
                      disabled={testingIntegration === integration.id}
                    >
                      {testingIntegration === integration.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Email integration enables automated appointment confirmations, reminders, and follow-up communications.
                  Configure your SMTP settings or use a service like SendGrid or Mailgun.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                SMS Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.filter(int => int.type === 'sms').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getIntegrationIcon(integration.type)}
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusIcon(integration.status)}
                          <span className="ml-1 capitalize">{integration.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={(enabled) => handleToggleIntegration(integration.id, enabled)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestIntegration(integration.id)}
                      disabled={testingIntegration === integration.id}
                    >
                      {testingIntegration === integration.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              
              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertDescription>
                  SMS integration provides text message reminders and confirmations with higher open rates than email.
                  Connect with Twilio, TextMagic, or other SMS providers.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.filter(int => int.type === 'payment').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getIntegrationIcon(integration.type)}
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusIcon(integration.status)}
                          <span className="ml-1 capitalize">{integration.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={(enabled) => handleToggleIntegration(integration.id, enabled)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestIntegration(integration.id)}
                      disabled={testingIntegration === integration.id}
                    >
                      {testingIntegration === integration.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  Payment integration allows patients to pay for appointments online and set up payment plans.
                  Connect with Stripe, Square, or other payment processors.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
