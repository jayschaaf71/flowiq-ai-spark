import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useWebhookManager } from '@/hooks/useWebhookManager';
import { 
  Webhook,
  Plus,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  Settings,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered?: string;
  createdAt: string;
}

export const WebhookManager = () => {
  const { 
    webhooks, 
    isLoading, 
    testWebhook, 
    addWebhook, 
    updateWebhook, 
    deleteWebhook, 
    retryFailedWebhook 
  } = useWebhookManager();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    headers: {} as Record<string, string>,
    secretKey: ''
  });

  const availableEvents = [
    { value: 'appointment.created', label: 'Appointment Created' },
    { value: 'appointment.updated', label: 'Appointment Updated' },
    { value: 'appointment.completed', label: 'Appointment Completed' },
    { value: 'appointment.no_show', label: 'Appointment No-Show' },
    { value: 'intake.completed', label: 'Intake Completed' },
    { value: 'followup.initiated', label: 'Follow-up Initiated' }
  ];

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      return;
    }

    addWebhook({
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      headers: newWebhook.headers,
      secretKey: newWebhook.secretKey || undefined
    });
    
    setNewWebhook({ name: '', url: '', events: [], headers: {}, secretKey: '' });
    setShowAddForm(false);
  };

  const handleEventToggle = (event: string) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Webhook className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Webhook Endpoints</CardTitle>
                <CardDescription>
                  Send real-time appointment events to external systems
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {webhooks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No webhooks configured yet. Add your first webhook endpoint to get started.
              </div>
            ) : (
              webhooks.map((webhook) => (
                <div key={webhook.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(webhook.status)}
                        <h4 className="font-medium">{webhook.name}</h4>
                        <Badge variant={webhook.status === 'active' ? 'default' : 
                          webhook.status === 'error' ? 'destructive' : 'secondary'}>
                          {webhook.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded break-all">
                          {webhook.url}
                        </code>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>

                      {webhook.lastTriggered && (
                        <p className="text-xs text-gray-500">
                          Last triggered: {formatTimeAgo(webhook.lastTriggered)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testWebhook(webhook)}
                        disabled={isLoading}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        {isLoading ? 'Testing...' : 'Test'}
                      </Button>
                      
                      {webhook.status === 'error' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => retryFailedWebhook(webhook.id)}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteWebhook(webhook.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {webhook.status === 'error' && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded text-sm text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      This webhook has failed. Check the endpoint URL and try testing again.
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Webhook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-name">Name</Label>
              <Input
                id="webhook-name"
                placeholder="e.g., EHR System Integration"
                value={newWebhook.name}
                onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Endpoint URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://your-system.com/webhook"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Events to Subscribe To</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableEvents.map((event) => (
                  <label key={event.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newWebhook.events.includes(event.value)}
                      onChange={() => handleEventToggle(event.value)}
                    />
                    <span className="text-sm">{event.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret-key">Secret Key (Optional)</Label>
              <Input
                id="secret-key"
                placeholder="Your webhook secret for signature verification"
                value={newWebhook.secretKey}
                onChange={(e) => setNewWebhook({ ...newWebhook, secretKey: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Used to generate HMAC signatures for webhook verification
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddWebhook} disabled={!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0}>
                Add Webhook
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};