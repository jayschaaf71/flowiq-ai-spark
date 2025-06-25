
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Mail, 
  MessageSquare, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { integrationService, IntegrationConfig } from '@/services/integrationService';

export const IntegrationStatus: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'payment': return <CreditCard className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'error': return <AlertCircle className="w-3 h-3 text-red-600" />;
      case 'syncing': return <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />;
      default: return <AlertCircle className="w-3 h-3 text-gray-400" />;
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

  const connectedIntegrations = integrations.filter(int => int.status === 'connected' && int.enabled);
  const totalIntegrations = integrations.length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm">Loading integrations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Integration Status
          <Badge variant="outline">
            {connectedIntegrations.length}/{totalIntegrations} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {integrations.slice(0, 4).map(integration => (
          <div key={integration.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getIntegrationIcon(integration.type)}
              <span className="text-sm font-medium">{integration.name}</span>
            </div>
            <Badge className={`text-xs ${getStatusColor(integration.status)}`}>
              {getStatusIcon(integration.status)}
              <span className="ml-1 capitalize">{integration.status}</span>
            </Badge>
          </div>
        ))}
        
        {integrations.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No integrations configured</p>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={loadIntegrations}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
