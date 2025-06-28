
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Webhook, 
  Plus, 
  Trash2, 
  Edit, 
  Play, 
  Activity,
  Copy,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered?: string;
  successCount: number;
  errorCount: number;
  secret?: string;
}

export const WebhookManager: React.FC = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: '1',
      name: 'Appointment Notifications',
      url: 'https://api.example.com/webhooks/appointments',
      events: ['appointment.created', 'appointment.updated', 'appointment.cancelled'],
      status: 'active',
      lastTriggered: new Date(Date.now() - 3600000).toISOString(),
      successCount: 245,
      errorCount: 3,
      secret: 'wh_secret_123'
    },
    {
      id: '2',
      name: 'Patient Registration',
      url: 'https://crm.example.com/webhook',
      events: ['patient.registered', 'patient.updated'],
      status: 'active',
      lastTriggered: new Date(Date.now() - 7200000).toISOString(),
      successCount: 89,
      errorCount: 0
    }
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint | null>(null);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: ''
  });

  const availableEvents = [
    'appointment.created',
    'appointment.updated',
    'appointment.cancelled',
    'appointment.confirmed',
    'patient.registered',
    'patient.updated',
    'payment.completed',
    'form.submitted'
  ];

  const handleCreateWebhook = () => {
    if (!formData.name || !formData.url || formData.events.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newWebhook: WebhookEndpoint = {
      id: Date.now().toString(),
      name: formData.name,
      url: formData.url,
      events: formData.events,
      status: 'active',
      successCount: 0,
      errorCount: 0,
      secret: formData.secret || undefined
    };

    setWebhooks(prev => [...prev, newWebhook]);
    resetForm();
    
    toast({
      title: "Webhook Created",
      description: "New webhook endpoint has been created successfully",
    });
  };

  const handleUpdateWebhook = () => {
    if (!editingWebhook || !formData.name || !formData.url || formData.events.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setWebhooks(prev => prev.map(webhook => 
      webhook.id === editingWebhook.id 
        ? { ...webhook, name: formData.name, url: formData.url, events: formData.events, secret: formData.secret || undefined }
        : webhook
    ));
    
    resetForm();
    
    toast({
      title: "Webhook Updated",
      description: "Webhook endpoint has been updated successfully",
    });
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
    toast({
      title: "Webhook Deleted",
      description: "Webhook endpoint has been deleted",
    });
  };

  const handleTestWebhook = async (webhook: WebhookEndpoint) => {
    setTestingWebhook(webhook.id);
    
    try {
      // Simulate webhook test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update success count
      setWebhooks(prev => prev.map(w => 
        w.id === webhook.id 
          ? { ...w, successCount: w.successCount + 1, lastTriggered: new Date().toISOString() }
          : w
      ));
      
      toast({
        title: "Test Successful",
        description: "Webhook endpoint responded successfully",
      });
    } catch (error) {
      // Update error count
      setWebhooks(prev => prev.map(w => 
        w.id === webhook.id 
          ? { ...w, errorCount: w.errorCount + 1 }
          : w
      ));
      
      toast({
        title: "Test Failed",
        description: "Webhook endpoint test failed",
        variant: "destructive",
      });
    } finally {
      setTestingWebhook(null);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', url: '', events: [], secret: '' });
    setShowCreateForm(false);
    setEditingWebhook(null);
  };

  const startEdit = (webhook: WebhookEndpoint) => {
    setFormData({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      secret: webhook.secret || ''
    });
    setEditingWebhook(webhook);
    setShowCreateForm(true);
  };

  const copyWebhookUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied",
        description: "Webhook URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'error': return AlertTriangle;
      case 'inactive': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Webhook className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold">Webhook Manager</h2>
            <p className="text-gray-600">Configure and manage webhook endpoints</p>
          </div>
        </div>
        
        <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingWebhook ? 'Edit Webhook' : 'Create New Webhook'}
            </CardTitle>
            <CardDescription>
              Configure webhook endpoint to receive real-time notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="webhook-name">Name</Label>
                <Input
                  id="webhook-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Appointment Notifications"
                />
              </div>
              
              <div>
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://your-api.com/webhook"
                />
              </div>
            </div>
            
            <div>
              <Label>Events to Subscribe</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {availableEvents.map(event => (
                  <label key={event} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.events.includes(event)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, events: [...formData.events, event]});
                        } else {
                          setFormData({...formData, events: formData.events.filter(e => e !== event)});
                        }
                      }}
                    />
                    <span>{event}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="webhook-secret">Secret (Optional)</Label>
              <Input
                id="webhook-secret"
                value={formData.secret}
                onChange={(e) => setFormData({...formData, secret: e.target.value})}
                placeholder="Webhook signing secret"
                type="password"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={editingWebhook ? handleUpdateWebhook : handleCreateWebhook}>
                {editingWebhook ? 'Update Webhook' : 'Create Webhook'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webhooks List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Active Webhooks ({webhooks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No webhooks configured</p>
              <p className="text-sm">Create your first webhook to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => {
                const StatusIcon = getStatusIcon(webhook.status);
                
                return (
                  <div key={webhook.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{webhook.name}</h3>
                          <Badge className={getStatusColor(webhook.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {webhook.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                              {webhook.url}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyWebhookUrl(webhook.url)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div>
                            <span className="font-medium">Events:</span> {webhook.events.join(', ')}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <span className="font-medium">Success:</span> {webhook.successCount}
                            </div>
                            <div>
                              <span className="font-medium">Errors:</span> {webhook.errorCount}
                            </div>
                            <div>
                              <span className="font-medium">Success Rate:</span> {
                                webhook.successCount + webhook.errorCount > 0 
                                  ? Math.round((webhook.successCount / (webhook.successCount + webhook.errorCount)) * 100)
                                  : 0
                              }%
                            </div>
                            {webhook.lastTriggered && (
                              <div>
                                <span className="font-medium">Last:</span> {new Date(webhook.lastTriggered).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestWebhook(webhook)}
                          disabled={testingWebhook === webhook.id}
                        >
                          {testingWebhook === webhook.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          Test
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(webhook)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteWebhook(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
