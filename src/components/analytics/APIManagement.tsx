import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Key, 
  Activity, 
  Shield, 
  BarChart3,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  AlertTriangle
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  requestCount: number;
  rateLimit: number;
  isActive: boolean;
}

export const APIManagement: React.FC = () => {
  const [showKey, setShowKey] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Mobile App Integration',
      key: 'sk_live_1234567890abcdef',
      permissions: ['read:patients', 'write:appointments'],
      createdAt: '2024-01-10T10:00:00Z',
      lastUsed: '2024-01-15T14:30:00Z',
      requestCount: 1247,
      rateLimit: 1000,
      isActive: true
    },
    {
      id: '2',
      name: 'EHR Sync Service',
      key: 'sk_live_fedcba0987654321',
      permissions: ['read:patients', 'read:medical-history', 'write:soap-notes'],
      createdAt: '2024-01-05T09:15:00Z',
      lastUsed: '2024-01-15T12:00:00Z',
      requestCount: 5892,
      rateLimit: 5000,
      isActive: true
    }
  ]);

  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    permissions: [] as string[],
    rateLimit: 1000
  });

  const availablePermissions = [
    { id: 'read:patients', label: 'Read Patients', description: 'View patient information' },
    { id: 'write:patients', label: 'Write Patients', description: 'Create and update patient records' },
    { id: 'read:appointments', label: 'Read Appointments', description: 'View appointment data' },
    { id: 'write:appointments', label: 'Write Appointments', description: 'Create and modify appointments' },
    { id: 'read:medical-history', label: 'Read Medical History', description: 'Access medical history' },
    { id: 'write:medical-history', label: 'Write Medical History', description: 'Update medical records' },
    { id: 'read:soap-notes', label: 'Read SOAP Notes', description: 'View clinical notes' },
    { id: 'write:soap-notes', label: 'Write SOAP Notes', description: 'Create clinical notes' },
    { id: 'admin', label: 'Admin Access', description: 'Full system access' }
  ];

  const apiUsageData = [
    { endpoint: '/api/patients', calls: 1234, avgResponse: '45ms' },
    { endpoint: '/api/appointments', calls: 892, avgResponse: '32ms' },
    { endpoint: '/api/medical-history', calls: 567, avgResponse: '78ms' },
    { endpoint: '/api/soap-notes', calls: 445, avgResponse: '156ms' }
  ];

  const handleCreateKey = () => {
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyForm.name,
      key: `sk_live_${Math.random().toString(36).substring(2, 18)}`,
      permissions: newKeyForm.permissions,
      createdAt: new Date().toISOString(),
      requestCount: 0,
      rateLimit: newKeyForm.rateLimit,
      isActive: true
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyForm({ name: '', permissions: [], rateLimit: 1000 });
  };

  const handlePermissionToggle = (permission: string) => {
    const permissions = newKeyForm.permissions.includes(permission)
      ? newKeyForm.permissions.filter(p => p !== permission)
      : [...newKeyForm.permissions, permission];
    
    setNewKeyForm({ ...newKeyForm, permissions });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(showKey === keyId ? null : keyId);
  };

  const maskKey = (key: string) => {
    return `${key.substring(0, 8)}${'*'.repeat(key.length - 16)}${key.substring(key.length - 8)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">API Management</h2>
        <p className="text-gray-600">Manage API keys and monitor usage for your practice</p>
      </div>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          {/* Create New API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New API Key
              </CardTitle>
              <CardDescription>Generate a new API key for your integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    value={newKeyForm.name}
                    onChange={(e) => setNewKeyForm({ ...newKeyForm, name: e.target.value })}
                    placeholder="e.g., Mobile App Integration"
                  />
                </div>
                <div>
                  <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
                  <Select value={newKeyForm.rateLimit.toString()} onValueChange={(value) => setNewKeyForm({ ...newKeyForm, rateLimit: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 requests/hour</SelectItem>
                      <SelectItem value="500">500 requests/hour</SelectItem>
                      <SelectItem value="1000">1,000 requests/hour</SelectItem>
                      <SelectItem value="5000">5,000 requests/hour</SelectItem>
                      <SelectItem value="10000">10,000 requests/hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={permission.id}
                        checked={newKeyForm.permissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="rounded"
                      />
                      <div>
                        <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                          {permission.label}
                        </label>
                        <p className="text-xs text-gray-500">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleCreateKey}
                disabled={!newKeyForm.name || newKeyForm.permissions.length === 0}
              >
                <Key className="w-4 h-4 mr-2" />
                Generate API Key
              </Button>
            </CardContent>
          </Card>

          {/* Existing API Keys */}
          <Card>
            <CardHeader>
              <CardTitle>Active API Keys</CardTitle>
              <CardDescription>Manage your existing API keys and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{key.name}</h4>
                        <p className="text-sm text-gray-600">
                          Created {new Date(key.createdAt).toLocaleDateString()}
                          {key.lastUsed && ` • Last used ${new Date(key.lastUsed).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={key.isActive ? 'default' : 'secondary'}>
                          {key.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {showKey === key.id ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(key.key)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                        {showKey === key.id ? key.key : maskKey(key.key)}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {key.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{key.requestCount.toLocaleString()} requests made</span>
                        <span>Rate limit: {key.rateLimit.toLocaleString()}/hour</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold">24,847</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold">3,142</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response</p>
                    <p className="text-2xl font-bold">78ms</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Error Rate</p>
                    <p className="text-2xl font-bold">0.1%</p>
                  </div>
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Endpoint Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Endpoint Usage</CardTitle>
              <CardDescription>Most frequently used API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiUsageData.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-mono text-sm">{endpoint.endpoint}</p>
                      <p className="text-xs text-gray-600">{endpoint.calls.toLocaleString()} calls</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{endpoint.avgResponse}</p>
                      <p className="text-xs text-gray-600">avg response</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Integration guides and API reference</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  All API endpoints are HIPAA compliant and require proper authentication. Patient data is encrypted in transit and at rest.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-medium">Getting Started</h4>
                <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div>curl -H "Authorization: Bearer YOUR_API_KEY" \</div>
                  <div className="ml-4">https://api.yourpractice.com/v1/patients</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Available Endpoints</h4>
                <div className="space-y-2">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/v1/patients</code>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Retrieve patient list</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">POST</Badge>
                      <code>/api/v1/appointments</code>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Create new appointment</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/v1/medical-history/:patientId</code>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Get patient medical history</p>
                  </div>
                </div>
              </div>

              <Button variant="outline">
                View Full Documentation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
