import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  Shield, 
  CreditCard, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Settings,
  Zap,
  Bot,
  MessageSquare,
  ExternalLink,
  Download,
  Upload,
  Key,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Play,
  Square,
  Plus,
  Trash2,
  Edit,
  Copy,
  TestTube
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'ehr' | 'insurance' | 'payment' | 'lab' | 'imaging' | 'communication';
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'testing' | 'pending';
  health: number;
  lastSync?: string;
  config: Record<string, any>;
  compliance: {
    hipaa: boolean;
    soc2: boolean;
    hitech: boolean;
  };
  features: string[];
  aiAgentStatus: 'available' | 'busy' | 'offline';
}

interface AIAgentMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  action?: string;
}

export const PlatformIntegrationManagement = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'epic-ehr',
      name: 'Epic EHR',
      type: 'ehr',
      provider: 'Epic Systems',
      status: 'connected',
      health: 95,
      lastSync: '2024-01-15T10:30:00Z',
      config: {
        apiEndpoint: 'https://api.epic.com',
        apiVersion: '2023-01',
        syncInterval: '5min'
      },
      compliance: {
        hipaa: true,
        soc2: true,
        hitech: true
      },
      features: ['Patient Data Sync', 'Appointment Sync', 'Clinical Notes'],
      aiAgentStatus: 'available'
    },
    {
      id: 'cerner-ehr',
      name: 'Cerner EHR',
      type: 'ehr',
      provider: 'Cerner Corporation',
      status: 'testing',
      health: 78,
      lastSync: '2024-01-15T09:15:00Z',
      config: {
        apiEndpoint: 'https://api.cerner.com',
        apiVersion: '2023-01',
        syncInterval: '5min'
      },
      compliance: {
        hipaa: true,
        soc2: true,
        hitech: true
      },
      features: ['Patient Data Sync', 'Appointment Sync'],
      aiAgentStatus: 'busy'
    },
    {
      id: 'blue-cross-insurance',
      name: 'Blue Cross Insurance',
      type: 'insurance',
      provider: 'Blue Cross Blue Shield',
      status: 'connected',
      health: 92,
      lastSync: '2024-01-15T10:00:00Z',
      config: {
        apiEndpoint: 'https://api.bcbs.com',
        apiVersion: '2023-01',
        syncInterval: '1min'
      },
      compliance: {
        hipaa: true,
        soc2: true,
        hitech: true
      },
      features: ['Eligibility Verification', 'Claims Processing', 'Payment Posting'],
      aiAgentStatus: 'available'
    },
    {
      id: 'stripe-payments',
      name: 'Stripe Payments',
      type: 'payment',
      provider: 'Stripe',
      status: 'connected',
      health: 98,
      lastSync: '2024-01-15T10:45:00Z',
      config: {
        apiEndpoint: 'https://api.stripe.com',
        apiVersion: '2023-10-16',
        syncInterval: 'realtime'
      },
      compliance: {
        hipaa: false,
        soc2: true,
        hitech: false
      },
      features: ['Payment Processing', 'Refund Management', 'Subscription Billing'],
      aiAgentStatus: 'available'
    }
  ]);

  const [aiAgentMessages, setAiAgentMessages] = useState<AIAgentMessage[]>([
    {
      id: '1',
      type: 'info',
      message: 'AI Agent is ready to help with integration setup and troubleshooting.',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'success',
      message: 'Successfully configured Epic EHR integration with automatic patient data sync.',
      timestamp: '2024-01-15T09:45:00Z',
      action: 'View Details'
    }
  ]);

  const [showAIAgent, setShowAIAgent] = useState(false);
  const [aiAgentInput, setAiAgentInput] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAIAgentMessage = async (message: string) => {
    console.log('🔧 [PlatformIntegrationManagement] AI Agent message:', message);
    
    // Simulate AI agent response
    const aiResponse: AIAgentMessage = {
      id: Date.now().toString(),
      type: 'info',
      message: `AI Agent: I understand you want to ${message.toLowerCase()}. Let me help you with that.`,
      timestamp: new Date().toISOString()
    };
    
    setAiAgentMessages(prev => [aiResponse, ...prev]);
    setAiAgentInput('');
  };

  const handleTestIntegration = (integration: Integration) => {
    console.log('🔧 [PlatformIntegrationManagement] Testing integration:', integration.name);
    alert(`Testing ${integration.name} integration... (This would run integration tests in production)`);
  };

  const handleConfigureIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowIntegrationDialog(true);
  };

  const handleSaveIntegration = () => {
    if (selectedIntegration) {
      console.log('🔧 [PlatformIntegrationManagement] Saving integration:', selectedIntegration);
      alert(`Saving ${selectedIntegration.name} configuration... (This would save the configuration in production)`);
      setShowIntegrationDialog(false);
    }
  };

  const handleAddIntegration = () => {
    console.log('🔧 [PlatformIntegrationManagement] Adding new integration');
    alert('Opening integration catalog... (This would open the integration marketplace in production)');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integration Management</h1>
          <p className="text-muted-foreground">Manage EHR, insurance, and payment processing integrations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAIAgent(true)}
            className="flex items-center gap-2"
          >
            <Bot className="h-4 w-4" />
            AI Agent
          </Button>
          <Button onClick={handleAddIntegration}>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ehr">EHR Systems</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected Integrations</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'connected').length}</div>
                <p className="text-xs text-muted-foreground">
                  {integrations.length} total integrations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">EHR Systems</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrations.filter(i => i.type === 'ehr').length}</div>
                <p className="text-xs text-muted-foreground">
                  {integrations.filter(i => i.type === 'ehr' && i.status === 'connected').length} connected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Insurance Providers</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrations.filter(i => i.type === 'insurance').length}</div>
                <p className="text-xs text-muted-foreground">
                  {integrations.filter(i => i.type === 'insurance' && i.status === 'connected').length} connected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Processors</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrations.filter(i => i.type === 'payment').length}</div>
                <p className="text-xs text-muted-foreground">
                  {integrations.filter(i => i.type === 'payment' && i.status === 'connected').length} connected
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {aiAgentMessages.slice(0, 5).map((message) => (
                    <div key={message.id} className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        message.type === 'success' ? 'bg-green-500' : 
                        message.type === 'warning' ? 'bg-yellow-500' : 
                        message.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-sm">{message.message}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">HIPAA Compliance</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SOC2 Compliance</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">HITECH Compliance</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Encryption</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* EHR Systems Tab */}
        <TabsContent value="ehr" className="space-y-6">
          <div className="grid gap-6">
            {integrations.filter(i => i.type === 'ehr').map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5" />
                      <div>
                        <CardTitle>{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{integration.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                      </Badge>
                      <Badge className={`${getHealthColor(integration.health)}`}>
                        {integration.health}% Health
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <div className="space-y-1">
                        {integration.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Compliance</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">HIPAA: {integration.compliance.hipaa ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">SOC2: {integration.compliance.soc2 ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">HITECH: {integration.compliance.hitech ? '✓' : '✗'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestIntegration(integration)}
                    >
                      <TestTube className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConfigureIntegration(integration)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAIAgent(true)}
                    >
                      <Bot className="h-4 w-4 mr-1" />
                      AI Help
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insurance Tab */}
        <TabsContent value="insurance" className="space-y-6">
          <div className="grid gap-6">
            {integrations.filter(i => i.type === 'insurance').map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5" />
                      <div>
                        <CardTitle>{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{integration.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                      </Badge>
                      <Badge className={`${getHealthColor(integration.health)}`}>
                        {integration.health}% Health
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <div className="space-y-1">
                        {integration.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Compliance</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">HIPAA: {integration.compliance.hipaa ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">SOC2: {integration.compliance.soc2 ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">HITECH: {integration.compliance.hitech ? '✓' : '✗'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestIntegration(integration)}
                    >
                      <TestTube className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConfigureIntegration(integration)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAIAgent(true)}
                    >
                      <Bot className="h-4 w-4 mr-1" />
                      AI Help
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid gap-6">
            {integrations.filter(i => i.type === 'payment').map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <CardTitle>{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{integration.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                      </Badge>
                      <Badge className={`${getHealthColor(integration.health)}`}>
                        {integration.health}% Health
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <div className="space-y-1">
                        {integration.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Compliance</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">PCI DSS: ✓</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">SOC2: {integration.compliance.soc2 ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">Encryption: ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestIntegration(integration)}
                    >
                      <TestTube className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConfigureIntegration(integration)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAIAgent(true)}
                    >
                      <Bot className="h-4 w-4 mr-1" />
                      AI Help
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Agent Dialog */}
      <Dialog open={showAIAgent} onOpenChange={setShowAIAgent}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Integration AI Agent
            </DialogTitle>
            <DialogDescription>
              Get help with integration setup, troubleshooting, and configuration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
              {aiAgentMessages.map((message) => (
                <div key={message.id} className={`p-3 rounded-lg ${
                  message.type === 'success' ? 'bg-green-50 border border-green-200' :
                  message.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  message.type === 'error' ? 'bg-red-50 border border-red-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-4 w-4" />
                    <span className="text-sm font-medium">AI Agent</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                  {message.action && (
                    <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                      {message.action}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ask the AI agent for help..."
                value={aiAgentInput}
                onChange={(e) => setAiAgentInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && aiAgentInput.trim()) {
                    handleAIAgentMessage(aiAgentInput);
                  }
                }}
              />
              <Button onClick={() => handleAIAgentMessage(aiAgentInput)}>
                Send
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIAgent(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Integration Configuration Dialog */}
      <Dialog open={showIntegrationDialog} onOpenChange={setShowIntegrationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Update integration settings and API configuration
            </DialogDescription>
          </DialogHeader>
          {selectedIntegration && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="apiEndpoint">API Endpoint</Label>
                  <Input
                    id="apiEndpoint"
                    value={selectedIntegration.config.apiEndpoint}
                    onChange={(e) => {
                      setSelectedIntegration({
                        ...selectedIntegration,
                        config: {
                          ...selectedIntegration.config,
                          apiEndpoint: e.target.value
                        }
                      });
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="apiVersion">API Version</Label>
                  <Input
                    id="apiVersion"
                    value={selectedIntegration.config.apiVersion}
                    onChange={(e) => {
                      setSelectedIntegration({
                        ...selectedIntegration,
                        config: {
                          ...selectedIntegration.config,
                          apiVersion: e.target.value
                        }
                      });
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="syncInterval">Sync Interval</Label>
                  <Select
                    value={selectedIntegration.config.syncInterval}
                    onValueChange={(value) => {
                      setSelectedIntegration({
                        ...selectedIntegration,
                        config: {
                          ...selectedIntegration.config,
                          syncInterval: value
                        }
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="1min">1 minute</SelectItem>
                      <SelectItem value="5min">5 minutes</SelectItem>
                      <SelectItem value="15min">15 minutes</SelectItem>
                      <SelectItem value="1hour">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={selectedIntegration.status}
                    onValueChange={(value) => {
                      setSelectedIntegration({
                        ...selectedIntegration,
                        status: value as any
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="connected">Connected</SelectItem>
                      <SelectItem value="disconnected">Disconnected</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Compliance Settings</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hipaa"
                      checked={selectedIntegration.compliance.hipaa}
                      onCheckedChange={(checked) => {
                        setSelectedIntegration({
                          ...selectedIntegration,
                          compliance: {
                            ...selectedIntegration.compliance,
                            hipaa: checked
                          }
                        });
                      }}
                    />
                    <Label htmlFor="hipaa">HIPAA Compliance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="soc2"
                      checked={selectedIntegration.compliance.soc2}
                      onCheckedChange={(checked) => {
                        setSelectedIntegration({
                          ...selectedIntegration,
                          compliance: {
                            ...selectedIntegration.compliance,
                            soc2: checked
                          }
                        });
                      }}
                    />
                    <Label htmlFor="soc2">SOC2 Compliance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hitech"
                      checked={selectedIntegration.compliance.hitech}
                      onCheckedChange={(checked) => {
                        setSelectedIntegration({
                          ...selectedIntegration,
                          compliance: {
                            ...selectedIntegration.compliance,
                            hitech: checked
                          }
                        });
                      }}
                    />
                    <Label htmlFor="hitech">HITECH Compliance</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIntegrationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveIntegration}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
