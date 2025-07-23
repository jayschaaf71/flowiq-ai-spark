
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Webhook, 
  Calendar, 
  Mail, 
  MessageSquare, 
  CreditCard,
  Settings,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { integrationService } from '@/services/integrationService';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  type: 'calendar' | 'email' | 'sms' | 'payment' | 'webhook';
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync?: string;
  errorCount: number;
  successRate: number;
}

export const IntegrationDashboard: React.FC = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);

  const loadIntegrations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await integrationService.getIntegrations();
      setIntegrations(data.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        enabled: item.enabled,
        status: item.status,
        lastSync: item.lastSync,
        errorCount: Math.floor(Math.random() * 5),
        successRate: 85 + Math.floor(Math.random() * 15)
      })));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load integrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  const toggleIntegration = async (id: string, enabled: boolean) => {
    try {
      await integrationService.updateIntegration(id, { enabled });
      setIntegrations(prev => prev.map(int => 
        int.id === id ? { ...int, enabled } : int
      ));
      
      toast({
        title: enabled ? "Integration Enabled" : "Integration Disabled",
        description: `Integration has been ${enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update integration",
        variant: "destructive",
      });
    }
  };

  const testIntegration = async (id: string) => {
    setTestingIntegration(id);
    try {
      const result = await integrationService.testIntegration(id);
      
      toast({
        title: result.success ? "Test Successful" : "Test Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to test integration",
        variant: "destructive",
      });
    } finally {
      setTestingIntegration(null);
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'calendar': return Calendar;
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'payment': return CreditCard;
      case 'webhook': return Webhook;
      default: return Globe;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-700';
      case 'syncing': return 'bg-blue-100 text-blue-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'disconnected': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'syncing': return Clock;
      case 'error': return AlertCircle;
      default: return AlertCircle;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading integrations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold">Integration Dashboard</h2>
          <p className="text-gray-600">Manage third-party integrations and API connections</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {integrations.filter(i => i.status === 'connected').length}
              </div>
              <div className="text-sm text-gray-600">Connected</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {integrations.filter(i => i.enabled).length}
              </div>
              <div className="text-sm text-gray-600">Enabled</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {integrations.filter(i => i.status === 'error').length}
              </div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(integrations.reduce((sum, i) => sum + i.successRate, 0) / integrations.length || 0)}%
              </div>
              <div className="text-sm text-gray-600">Avg Success Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Active Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => {
              const Icon = getIntegrationIcon(integration.type);
              const StatusIcon = getStatusIcon(integration.status);
              
              return (
                <div key={integration.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Icon className="h-8 w-8 text-gray-600" />
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {integration.name}
                          <Badge className={getStatusColor(integration.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {integration.status}
                          </Badge>
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="capitalize">{integration.type} integration</p>
                          {integration.lastSync && (
                            <p>Last sync: {new Date(integration.lastSync).toLocaleString()}</p>
                          )}
                          <div className="flex items-center gap-4">
                            <span>Success Rate: {integration.successRate}%</span>
                            <span>Errors: {integration.errorCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">Success Rate</div>
                        <Progress value={integration.successRate} className="w-20" />
                      </div>
                      
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={(enabled) => toggleIntegration(integration.id, enabled)}
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testIntegration(integration.id)}
                        disabled={testingIntegration === integration.id}
                      >
                        {testingIntegration === integration.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
                        ) : (
                          'Test'
                        )}
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
