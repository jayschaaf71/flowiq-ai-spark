import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAutomatedInsurance } from '@/hooks/useAutomatedInsurance';
import {
  Bot,
  Shield,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  TrendingUp,
  FileText,
  Send,
  RefreshCw,
  Zap,
  Target,
  BarChart3,
  Users,
  Calendar,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Settings
} from 'lucide-react';

interface InsuranceProvider {
  id: string;
  name: string;
  type: 'va_military' | 'medicare' | 'commercial' | 'government';
  status: 'connected' | 'disconnected' | 'processing' | 'error';
  currentBacklog: number;
  monthlyVolume: number;
  automationLevel: number;
  lastSync: string;
  features: string[];
  priority: 'high' | 'medium' | 'low';
}

interface AutomatedProcess {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed' | 'error';
  progress: number;
  totalItems: number;
  processedItems: number;
  successRate: number;
  lastRun: string;
  nextRun: string;
}

export const AutomatedInsuranceAgent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  
  const {
    status,
    metrics,
    loading,
    error,
    startAutomation,
    stopAutomation,
    getProviderStatus,
    refresh
  } = useAutomatedInsurance();

  // Priority-based insurance providers based on your data
  const insuranceProviders: InsuranceProvider[] = [
    {
      id: 'va-ccn-optum',
      name: 'VA CCN Optum',
      type: 'va_military',
      status: 'connected',
      currentBacklog: 33700,
      monthlyVolume: 45000,
      automationLevel: 95,
      lastSync: '2024-01-15T10:30:00Z',
      features: ['Automated Claims Submission', 'Real-time Status Tracking', 'Auto-Denial Handling'],
      priority: 'high'
    },
    {
      id: 'medicare-dme-mac',
      name: 'Medicare DME MAC JurD',
      type: 'medicare',
      status: 'connected',
      currentBacklog: 33344,
      monthlyVolume: 38000,
      automationLevel: 92,
      lastSync: '2024-01-15T10:25:00Z',
      features: ['Standardized Claims Processing', 'Documentation Validation', 'Auto-Appeals'],
      priority: 'high'
    },
    {
      id: 'united-healthcare',
      name: 'United Healthcare',
      type: 'commercial',
      status: 'connected',
      currentBacklog: 26473,
      monthlyVolume: 32000,
      automationLevel: 88,
      lastSync: '2024-01-15T10:20:00Z',
      features: ['Real-time Eligibility', 'Claims Status Tracking', 'Payment Posting'],
      priority: 'high'
    },
    {
      id: 'aetna',
      name: 'Aetna',
      type: 'commercial',
      status: 'connected',
      currentBacklog: 13160,
      monthlyVolume: 18000,
      automationLevel: 85,
      lastSync: '2024-01-15T10:15:00Z',
      features: ['Prior Authorization', 'Benefits Verification', 'Claims Processing'],
      priority: 'medium'
    },
    {
      id: 'bcbs-anthem-mo',
      name: 'Anthem BCBS MO',
      type: 'commercial',
      status: 'connected',
      currentBacklog: 8052,
      monthlyVolume: 12000,
      automationLevel: 82,
      lastSync: '2024-01-15T10:10:00Z',
      features: ['Claims Submission', 'Eligibility Checks', 'Denial Management'],
      priority: 'medium'
    },
    {
      id: 'cigna',
      name: 'Cigna',
      type: 'commercial',
      status: 'processing',
      currentBacklog: 5000,
      monthlyVolume: 8000,
      automationLevel: 75,
      lastSync: '2024-01-15T10:05:00Z',
      features: ['Claims Processing', 'Status Tracking'],
      priority: 'medium'
    }
  ];

  const automatedProcesses: AutomatedProcess[] = [
    {
      id: 'eligibility-check',
      name: 'Real-time Eligibility Verification',
      status: 'running',
      progress: 87,
      totalItems: 156,
      processedItems: 136,
      successRate: 94.2,
      lastRun: '2024-01-15T10:30:00Z',
      nextRun: '2024-01-15T10:35:00Z'
    },
    {
      id: 'claims-submission',
      name: 'Automated Claims Submission',
      status: 'running',
      progress: 73,
      totalItems: 89,
      processedItems: 65,
      successRate: 91.8,
      lastRun: '2024-01-15T10:25:00Z',
      nextRun: '2024-01-15T10:30:00Z'
    },
    {
      id: 'denial-management',
      name: 'Automated Denial Management',
      status: 'running',
      progress: 45,
      totalItems: 23,
      processedItems: 10,
      successRate: 87.5,
      lastRun: '2024-01-15T10:20:00Z',
      nextRun: '2024-01-15T10:25:00Z'
    },
    {
      id: 'payment-posting',
      name: 'Automated Payment Posting',
      status: 'running',
      progress: 92,
      totalItems: 234,
      processedItems: 215,
      successRate: 96.1,
      lastRun: '2024-01-15T10:15:00Z',
      nextRun: '2024-01-15T10:20:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProcessStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4 text-green-600 animate-pulse" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleToggleAgent = async () => {
    if (status.isRunning) {
      await stopAutomation();
    } else {
      await startAutomation();
    }
  };

  const handleProviderAction = (providerId: string, action: string) => {
    console.log(`Performing ${action} for provider: ${providerId}`);
    // Implement provider-specific actions
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automated Insurance Agent</h1>
          <p className="text-gray-600">AI-powered insurance automation eliminating human intervention</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${status.isRunning ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {status.isRunning ? 'Agent Active' : 'Agent Paused'}
            </span>
          </div>
          <Button
            variant={status.isRunning ? 'outline' : 'default'}
            onClick={handleToggleAgent}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {status.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {loading ? 'Processing...' : (status.isRunning ? 'Pause Agent' : 'Activate Agent')}
          </Button>
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Claims Processed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {metrics.totalClaimsProcessed.toLocaleString()}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Recovered</p>
                <p className="text-2xl font-bold text-green-600">
                  ${metrics.totalRevenueRecovered.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                <p className="text-2xl font-bold text-purple-600">
                  {metrics.averageProcessingTime}s
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Automation Efficiency</p>
                <p className="text-2xl font-bold text-orange-600">
                  {metrics.automationEfficiency}%
                </p>
              </div>
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Insurance Providers</TabsTrigger>
          <TabsTrigger value="processes">Automated Processes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insurance Provider Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Insurance Provider Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insuranceProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          provider.status === 'connected' ? 'bg-green-500' : 
                          provider.status === 'processing' ? 'bg-blue-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-sm text-gray-500">
                            ${provider.currentBacklog.toLocaleString()} backlog
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(provider.status)}>
                          {provider.status}
                        </Badge>
                        <Badge className={getPriorityColor(provider.priority)}>
                          {provider.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Automated Processes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Automated Processes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automatedProcesses.map((process) => (
                    <div key={process.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getProcessStatusIcon(process.status)}
                          <span className="font-medium">{process.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {process.processedItems}/{process.totalItems}
                        </span>
                      </div>
                      <Progress value={process.progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Success Rate: {process.successRate}%</span>
                        <span>Next Run: {new Date(process.nextRun).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Real-time Agent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium">VA CCN Optum claim submitted</div>
                    <div className="text-sm text-gray-500">Claim #CLM-2024-001 processed successfully</div>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">2 min ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Send className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Medicare DME MAC eligibility verified</div>
                    <div className="text-sm text-gray-500">Patient #12345 coverage confirmed</div>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">5 min ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <RefreshCw className="w-4 h-4 text-yellow-600" />
                  <div>
                    <div className="font-medium">United Healthcare denial auto-corrected</div>
                    <div className="text-sm text-gray-500">Claim #CLM-2024-002 resubmitted</div>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">8 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Providers Tab */}
        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insuranceProviders.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      {provider.name}
                    </CardTitle>
                    <Badge className={getPriorityColor(provider.priority)}>
                      {provider.priority} priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Current Backlog</p>
                      <p className="text-xl font-bold text-red-600">
                        ${provider.currentBacklog.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Volume</p>
                      <p className="text-xl font-bold text-blue-600">
                        ${provider.monthlyVolume.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Automation Level</p>
                      <p className="text-xl font-bold text-green-600">
                        {provider.automationLevel}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <Badge className={getStatusColor(provider.status)}>
                        {provider.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Automated Features</p>
                    <div className="space-y-1">
                      {provider.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleProviderAction(provider.id, 'sync')}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleProviderAction(provider.id, 'configure')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automated Processes Tab */}
        <TabsContent value="processes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {automatedProcesses.map((process) => (
              <Card key={process.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    {process.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-500">{process.progress}%</span>
                  </div>
                  <Progress value={process.progress} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Processed</p>
                      <p className="text-lg font-bold text-blue-600">
                        {process.processedItems}/{process.totalItems}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-lg font-bold text-green-600">
                        {process.successRate}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Last Run: {new Date(process.lastRun).toLocaleTimeString()}</span>
                    <span>Next Run: {new Date(process.nextRun).toLocaleTimeString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Recovery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Recovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      ${metrics.totalRevenueRecovered.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Total Recovered This Month</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">VA/Military</span>
                      <span className="text-sm font-medium">$28,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medicare</span>
                      <span className="text-sm font-medium">$25,680</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Commercial</span>
                      <span className="text-sm font-medium">$35,104</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Processing Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {metrics.automationEfficiency}%
                    </p>
                    <p className="text-sm text-gray-500">Automation Efficiency</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Claims Processed</span>
                      <span className="text-sm font-medium">{metrics.totalClaimsProcessed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Processing Time</span>
                      <span className="text-sm font-medium">{metrics.averageProcessingTime}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Denial Rate</span>
                      <span className="text-sm font-medium">{metrics.denialRate}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Provider Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {insuranceProviders.slice(0, 5).map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            provider.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm font-medium">{provider.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${provider.currentBacklog.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{provider.automationLevel}% automated</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
