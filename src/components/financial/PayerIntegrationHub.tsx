import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Wifi, 
  WifiOff,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Zap,
  Network,
  Activity,
  Shield
} from 'lucide-react';

interface PayerConnection {
  id: string;
  name: string;
  type: 'clearinghouse' | 'direct_payer' | 'government';
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  capabilities: string[];
  lastSync: string;
  dailyVolume: number;
  successRate: number;
  setupCompleted: boolean;
}

export const PayerIntegrationHub: React.FC = () => {
  const [connections] = useState<PayerConnection[]>([
    {
      id: '1',
      name: 'Change Healthcare',
      type: 'clearinghouse',
      status: 'connected',
      capabilities: ['Claims Submission', 'Eligibility', 'Prior Auth', 'ERA Processing'],
      lastSync: '2 minutes ago',
      dailyVolume: 156,
      successRate: 98.5,
      setupCompleted: true
    },
    {
      id: '2',
      name: 'Blue Cross Blue Shield',
      type: 'direct_payer',
      status: 'connected',
      capabilities: ['Eligibility', 'Prior Auth', 'Claims Status'],
      lastSync: '5 minutes ago',
      dailyVolume: 89,
      successRate: 96.2,
      setupCompleted: true
    },
    {
      id: '3',
      name: 'Medicare',
      type: 'government',
      status: 'testing',
      capabilities: ['Claims Submission', 'Eligibility'],
      lastSync: 'Never',
      dailyVolume: 0,
      successRate: 0,
      setupCompleted: false
    },
    {
      id: '4',
      name: 'Availity',
      type: 'clearinghouse',
      status: 'error',
      capabilities: ['Eligibility', 'Prior Auth'],
      lastSync: '2 hours ago',
      dailyVolume: 45,
      successRate: 85.3,
      setupCompleted: true
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Wifi className="h-4 w-4 text-green-600" />;
      case 'disconnected': return <WifiOff className="h-4 w-4 text-red-600" />;
      case 'testing': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <WifiOff className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'clearinghouse': return <Network className="h-4 w-4 text-blue-600" />;
      case 'direct_payer': return <Building2 className="h-4 w-4 text-purple-600" />;
      case 'government': return <Shield className="h-4 w-4 text-green-600" />;
      default: return <Building2 className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Payer Integration Hub</h2>
            <p className="text-gray-600">Manage connections to insurance payers and clearinghouses</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            <Building2 className="h-4 w-4 mr-2" />
            Add Payer
          </Button>
        </div>
      </div>

      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Active Connections</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">97.2%</div>
              <div className="text-sm text-gray-600">Avg Success Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">290</div>
              <div className="text-sm text-gray-600">Daily Transactions</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">1.8s</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Real-time Connection Status
          </CardTitle>
          <CardDescription>
            Monitor the health and performance of all payer connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(connection.type)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{connection.name}</span>
                        <Badge className={getStatusColor(connection.status)}>
                          {getStatusIcon(connection.status)}
                          <span className="ml-1">{connection.status}</span>
                        </Badge>
                        <Badge variant="outline">
                          {connection.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Last sync: {connection.lastSync}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Test Connection
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Capabilities</div>
                    <div className="flex flex-wrap gap-1">
                      {connection.capabilities.map((capability, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Daily Volume</div>
                    <div className="text-lg font-medium">{connection.dailyVolume} transactions</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Success Rate</div>
                    <div className="flex items-center gap-2">
                      <Progress value={connection.successRate} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{connection.successRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Quick Setup
            </CardTitle>
            <CardDescription>
              Set up new payer connections in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Payer/Clearinghouse Name</label>
                <Input placeholder="Enter payer name..." />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Connection Type</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Clearinghouse</Button>
                  <Button variant="outline" size="sm">Direct Payer</Button>
                  <Button variant="outline" size="sm">Government</Button>
                </div>
              </div>
              
              <Button className="w-full">
                <Building2 className="h-4 w-4 mr-2" />
                Start Setup Wizard
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connection Health</CardTitle>
            <CardDescription>
              Monitor connection reliability and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Health Score</span>
                <span className="text-lg font-bold text-green-600">94%</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Uptime (24h)</span>
                  <span className="font-medium">99.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Error Rate</span>
                  <span className="font-medium">2.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Response Time</span>
                  <span className="font-medium">1.8s avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Failed Transactions</span>
                  <span className="font-medium">8 / 290</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>
            Pre-configured connections to major payers and clearinghouses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Trizetto', type: 'Clearinghouse', features: ['Claims', 'Eligibility', 'ERA'] },
              { name: 'Aetna', type: 'Direct Payer', features: ['Real-time eligibility', 'Prior Auth'] },
              { name: 'Humana', type: 'Direct Payer', features: ['Claims status', 'Eligibility'] },
              { name: 'RelayHealth', type: 'Clearinghouse', features: ['Full EDI suite', 'Analytics'] },
              { name: 'Medicaid', type: 'Government', features: ['State-specific rules', 'Compliance'] },
              { name: 'Cigna', type: 'Direct Payer', features: ['Provider portal', 'Real-time auth'] }
            ].map((integration, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(integration.type.toLowerCase().replace(' ', '_'))}
                  <h3 className="font-medium">{integration.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{integration.type}</p>
                <div className="space-y-2 mb-3">
                  {integration.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};