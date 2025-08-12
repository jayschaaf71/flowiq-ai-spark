import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  TestTube,
  Building,
  Users,
  Calendar,
  FileText
} from 'lucide-react';

interface TenantIntegration {
  id: string;
  name: string;
  type: 'ehr' | 'insurance' | 'payment' | 'lab' | 'imaging' | 'communication' | 'scheduling' | 'billing';
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'testing' | 'pending' | 'setup_required';
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
  setupDifficulty: 'easy' | 'medium' | 'hard';
  setupTime: string;
  cost: string;
}

interface AIAgentMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  action?: string;
}

export const TenantIntegrationManagement = () => {
  const [integrations, setIntegrations] = useState<TenantIntegration[]>([
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
      aiAgentStatus: 'available',
      setupDifficulty: 'hard',
      setupTime: '2-4 weeks',
      cost: 'Contact Sales'
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
      aiAgentStatus: 'available',
      setupDifficulty: 'medium',
      setupTime: '1-2 weeks',
      cost: 'Included'
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
      aiAgentStatus: 'available',
      setupDifficulty: 'easy',
      setupTime: '1-2 days',
      cost: '2.9% + 30¢ per transaction'
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      type: 'scheduling',
      provider: 'Google',
      status: 'setup_required',
      health: 0,
      config: {},
      compliance: {
        hipaa: false,
        soc2: true,
        hitech: false
      },
      features: ['Appointment Sync', 'Calendar Integration', 'Meeting Scheduling'],
      aiAgentStatus: 'available',
      setupDifficulty: 'easy',
      setupTime: '5-10 minutes',
      cost: 'Free'
    }
  ]);

  const [aiAgentMessages, setAiAgentMessages] = useState<AIAgentMessage[]>([
    {
      id: '1',
      type: 'info',
      message: 'AI Agent is ready to help you set up and configure integrations.',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'success',
      message: 'Successfully configured Epic EHR integration. Patient data sync is now active.',
      timestamp: '2024-01-15T09:45:00Z',
      action: 'View Details'
    }
  ]);

  const [showAIAgent, setShowAIAgent] = useState(false);
  const [aiAgentInput, setAiAgentInput] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<TenantIntegration | null>(null);
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);

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
      case 'setup_required':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAIAgentMessage = async (message: string) => {
    console.log('🔧 [TenantIntegrationManagement] AI Agent message:', message);
    
    // Simulate AI agent response
    const aiResponse: AIAgentMessage = {
      id: Date.now().toString(),
      type: 'info',
      message: `AI Agent: I understand you want to ${message.toLowerCase()}. Let me help you set that up.`,
      timestamp: new Date().toISOString()
    };
    
    setAiAgentMessages(prev => [aiResponse, ...prev]);
    setAiAgentInput('');
  };

  const handleSetupIntegration = (integration: TenantIntegration) => {
    setSelectedIntegration(integration);
    setShowSetupWizard(true);
  };

  const handleTestIntegration = (integration: TenantIntegration) => {
    console.log('🔧 [TenantIntegrationManagement] Testing integration:', integration.name);
    alert(`Testing ${integration.name} integration... (This would run integration tests in production)`);
  };

  const handleConfigureIntegration = (integration: TenantIntegration) => {
    setSelectedIntegration(integration);
    setShowIntegrationDialog(true);
  };

  const handleSaveIntegration = () => {
    if (selectedIntegration) {
      console.log('🔧 [TenantIntegrationManagement] Saving integration:', selectedIntegration);
      alert(`Saving ${selectedIntegration.name} configuration... (This would save the configuration in production)`);
      setShowIntegrationDialog(false);
    }
  };

  const handleAddIntegration = () => {
    console.log('🔧 [TenantIntegrationManagement] Adding new integration');
    alert('Opening integration catalog... (This would open the integration marketplace in production)');
  };

  const handleAISetup = () => {
    if (selectedIntegration) {
      console.log('🔧 [TenantIntegrationManagement] AI setup for:', selectedIntegration.name);
      alert(`AI Agent will help you set up ${selectedIntegration.name}. This will guide you through the configuration process.`);
      setShowSetupWizard(false);
      setShowAIAgent(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integration Management</h1>
          <p className="text-muted-foreground">Connect your practice with EHR, insurance, and payment systems</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAIAgent(true)}
            className="flex items-center gap-2"
          >
            <Bot className="h-4 w-4" />
            AI Assistant
          </Button>
          <Button onClick={handleAddIntegration}>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ehr">EHR Systems</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'connected').length}</div>
                <p className="text-xs text-muted-foreground">
                  Active integrations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Setup Required</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'setup_required').length}</div>
                <p className="text-xs text-muted-foreground">
                  Need configuration
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
                <Bot className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Available</div>
                <p className="text-xs text-muted-foreground">
                  Ready to help
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96%</div>
                <p className="text-xs text-muted-foreground">
                  Overall system health
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {integrations.filter(i => i.status === 'setup_required').slice(0, 3).map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getDifficultyColor(integration.setupDifficulty)}`}>
                          {integration.type === 'ehr' ? <Database className="h-4 w-4" /> :
                           integration.type === 'insurance' ? <Shield className="h-4 w-4" /> :
                           integration.type === 'payment' ? <CreditCard className="h-4 w-4" /> :
                           <Calendar className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-medium">{integration.name}</div>
                          <div className="text-sm text-muted-foreground">{integration.setupTime} setup</div>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleSetupIntegration(integration)}
                      >
                        Setup
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
                        {integration.status.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                      {integration.health > 0 && (
                        <Badge className={`${getHealthColor(integration.health)}`}>
                          {integration.health}% Health
                        </Badge>
                      )}
                      <Badge className={getDifficultyColor(integration.setupDifficulty)}>
                        {integration.setupDifficulty.charAt(0).toUpperCase() + integration.setupDifficulty.slice(1)}
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
                      <h4 className="font-medium mb-2">Setup Info</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">Setup Time: {integration.setupTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">Cost: {integration.cost}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">HIPAA: {integration.compliance.hipaa ? '✓' : '✗'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {integration.status === 'setup_required' ? (
                      <Button 
                        onClick={() => handleSetupIntegration(integration)}
                        className="flex items-center gap-2"
                      >
                        <Bot className="h-4 w-4" />
                        AI Setup
                      </Button>
                    ) : (
                      <>
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
                      </>
                    )}
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
                        {integration.status.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                      {integration.health > 0 && (
                        <Badge className={`${getHealthColor(integration.health)}`}>
                          {integration.health}% Health
                        </Badge>
                      )}
                      <Badge className={getDifficultyColor(integration.setupDifficulty)}>
                        {integration.setupDifficulty.charAt(0).toUpperCase() + integration.setupDifficulty.slice(1)}
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
                      <h4 className="font-medium mb-2">Setup Info</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">Setup Time: {integration.setupTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">Cost: {integration.cost}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">HIPAA: {integration.compliance.hipaa ? '✓' : '✗'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {integration.status === 'setup_required' ? (
                      <Button 
                        onClick={() => handleSetupIntegration(integration)}
                        className="flex items-center gap-2"
                      >
                        <Bot className="h-4 w-4" />
                        AI Setup
                      </Button>
                    ) : (
                      <>
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
                      </>
                    )}
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
                        {integration.status.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                      {integration.health > 0 && (
                        <Badge className={`${getHealthColor(integration.health)}`}>
                          {integration.health}% Health
                        </Badge>
                      )}
                      <Badge className={getDifficultyColor(integration.setupDifficulty)}>
                        {integration.setupDifficulty.charAt(0).toUpperCase() + integration.setupDifficulty.slice(1)}
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
                      <h4 className="font-medium mb-2">Setup Info</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">Setup Time: {integration.setupTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">Cost: {integration.cost}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">PCI DSS: ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {integration.status === 'setup_required' ? (
                      <Button 
                        onClick={() => handleSetupIntegration(integration)}
                        className="flex items-center gap-2"
                      >
                        <Bot className="h-4 w-4" />
                        AI Setup
                      </Button>
                    ) : (
                      <>
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
                      </>
                    )}
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

        {/* Other Tab */}
        <TabsContent value="other" className="space-y-6">
          <div className="grid gap-6">
            {integrations.filter(i => !['ehr', 'insurance', 'payment'].includes(i.type)).map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {integration.type === 'scheduling' ? <Calendar className="h-5 w-5" /> :
                       integration.type === 'billing' ? <FileText className="h-5 w-5" /> :
                       <Activity className="h-5 w-5" />}
                      <div>
                        <CardTitle>{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{integration.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                      {integration.health > 0 && (
                        <Badge className={`${getHealthColor(integration.health)}`}>
                          {integration.health}% Health
                        </Badge>
                      )}
                      <Badge className={getDifficultyColor(integration.setupDifficulty)}>
                        {integration.setupDifficulty.charAt(0).toUpperCase() + integration.setupDifficulty.slice(1)}
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
                      <h4 className="font-medium mb-2">Setup Info</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">Setup Time: {integration.setupTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">Cost: {integration.cost}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">Security: ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {integration.status === 'setup_required' ? (
                      <Button 
                        onClick={() => handleSetupIntegration(integration)}
                        className="flex items-center gap-2"
                      >
                        <Bot className="h-4 w-4" />
                        AI Setup
                      </Button>
                    ) : (
                      <>
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
                      </>
                    )}
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
              Integration AI Assistant
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
                    <span className="text-sm font-medium">AI Assistant</span>
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
                placeholder="Ask the AI assistant for help..."
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

      {/* Setup Wizard Dialog */}
      <Dialog open={showSetupWizard} onOpenChange={setShowSetupWizard}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Setup {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              AI Assistant will guide you through the setup process
            </DialogDescription>
          </DialogHeader>
          {selectedIntegration && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-medium mb-2">Setup Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Estimated Time: {selectedIntegration.setupTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Difficulty: {selectedIntegration.setupDifficulty.charAt(0).toUpperCase() + selectedIntegration.setupDifficulty.slice(1)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Cost: {selectedIntegration.cost}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Features Included</h4>
                <div className="space-y-1">
                  {selectedIntegration.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSetupWizard(false)}>
              Cancel
            </Button>
            <Button onClick={handleAISetup} className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Start AI Setup
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
                    value={selectedIntegration.config.apiEndpoint || ''}
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
                    value={selectedIntegration.config.apiVersion || ''}
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
                    value={selectedIntegration.config.syncInterval || '5min'}
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
                      <SelectItem value="setup_required">Setup Required</SelectItem>
                    </SelectContent>
                  </Select>
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
