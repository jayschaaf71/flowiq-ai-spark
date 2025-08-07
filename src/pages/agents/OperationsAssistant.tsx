import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Package, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Database,
  Download,
  Upload,
  Search,
  Filter,
  User,
  RefreshCw,
  Play,
  Square,
  Zap,
  Workflow,
  Gauge,
  Target,
  BarChart3
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'ordered';
  lastUpdated: string;
  supplier: string;
}

interface Workflow {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  progress: number;
  lastRun: string;
  nextRun: string;
  efficiency: number;
}

interface Automation {
  id: string;
  name: string;
  description: string;
  status: 'enabled' | 'disabled' | 'error';
  lastTriggered: string;
  successRate: number;
  timeSaved: number;
}

export const OperationsAssistant = () => {
  const [selectedTab, setSelectedTab] = useState('inventory');

  // Mock data
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'CPAP Masks',
      category: 'DME Equipment',
      quantity: 45,
      minQuantity: 20,
      status: 'in-stock',
      lastUpdated: '2024-01-15 10:30 AM',
      supplier: 'DME Supply Co.'
    },
    {
      id: '2',
      name: 'Sleep Study Sensors',
      category: 'Diagnostic Equipment',
      quantity: 8,
      minQuantity: 15,
      status: 'low-stock',
      lastUpdated: '2024-01-15 09:15 AM',
      supplier: 'MedTech Solutions'
    },
    {
      id: '3',
      name: 'Oral Appliances',
      category: 'DME Equipment',
      quantity: 0,
      minQuantity: 10,
      status: 'out-of-stock',
      lastUpdated: '2024-01-15 08:45 AM',
      supplier: 'Dental Sleep Lab'
    },
    {
      id: '4',
      name: 'Patient Forms',
      category: 'Office Supplies',
      quantity: 200,
      minQuantity: 50,
      status: 'in-stock',
      lastUpdated: '2024-01-15 08:30 AM',
      supplier: 'Office Depot'
    }
  ];

  const workflows: Workflow[] = [
    {
      id: '1',
      name: 'Patient Intake Automation',
      type: 'Patient Onboarding',
      status: 'active',
      progress: 85,
      lastRun: '2024-01-15 10:00 AM',
      nextRun: '2024-01-15 11:00 AM',
      efficiency: 92
    },
    {
      id: '2',
      name: 'Appointment Reminder System',
      type: 'Communication',
      status: 'active',
      progress: 100,
      lastRun: '2024-01-15 09:30 AM',
      nextRun: '2024-01-15 10:30 AM',
      efficiency: 98
    },
    {
      id: '3',
      name: 'Insurance Verification',
      type: 'Claims Processing',
      status: 'paused',
      progress: 60,
      lastRun: '2024-01-15 08:00 AM',
      nextRun: '2024-01-15 12:00 PM',
      efficiency: 87
    }
  ];

  const automations: Automation[] = [
    {
      id: '1',
      name: 'Auto-Scheduling',
      description: 'Automatically schedule follow-up appointments',
      status: 'enabled',
      lastTriggered: '2024-01-15 10:15 AM',
      successRate: 95,
      timeSaved: 2.5
    },
    {
      id: '2',
      name: 'Inventory Alerts',
      description: 'Send alerts when inventory is low',
      status: 'enabled',
      lastTriggered: '2024-01-15 09:45 AM',
      successRate: 100,
      timeSaved: 1.8
    },
    {
      id: '3',
      name: 'Payment Processing',
      description: 'Automated payment collection',
      status: 'enabled',
      lastTriggered: '2024-01-15 10:00 AM',
      successRate: 88,
      timeSaved: 3.2
    }
  ];

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-600';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-600';
      case 'out-of-stock':
        return 'bg-red-100 text-red-600';
      case 'ordered':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'paused':
        return 'bg-yellow-100 text-yellow-600';
      case 'completed':
        return 'bg-blue-100 text-blue-600';
      case 'failed':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getAutomationStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
        return 'bg-green-100 text-green-600';
      case 'disabled':
        return 'bg-gray-100 text-gray-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operations Assistant</h1>
          <p className="text-gray-600">AI-powered operations management and automation</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            AI Assistant
          </Badge>
        </div>
      </div>

      {/* Operations Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">12</div>
            <div className="text-xs text-blue-700 mt-2">+3 this week</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Automation Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">94%</div>
            <div className="text-xs text-green-700 mt-2">+2% this month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">18.5h</div>
            <div className="text-xs text-purple-700 mt-2">This week</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">156</div>
            <div className="text-xs text-orange-700 mt-2">3 need reorder</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="automations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automations
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inventory List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getInventoryStatusColor(item.status)}`}>
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.category} • {item.supplier}</div>
                          <div className="text-xs text-gray-500 mt-1">Last updated: {item.lastUpdated}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{item.quantity}</div>
                          <div className="text-sm text-gray-600">Min: {item.minQuantity}</div>
                        </div>
                        <Badge className={getInventoryStatusColor(item.status)}>
                          {item.status.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inventory Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Inventory Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">In Stock</div>
                      <div className="text-sm text-green-700">Well stocked items</div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">15</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium text-yellow-900">Low Stock</div>
                      <div className="text-sm text-yellow-700">Needs reorder</div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">3</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-red-900">Out of Stock</div>
                      <div className="text-sm text-red-700">Critical items</div>
                    </div>
                    <div className="text-2xl font-bold text-red-900">1</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">On Order</div>
                      <div className="text-sm text-blue-700">Pending delivery</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">2</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workflow List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Active Workflows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getWorkflowStatusColor(workflow.status)}`}>
                          <Activity className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{workflow.name}</div>
                          <div className="text-sm text-gray-600">{workflow.type}</div>
                          <div className="text-xs text-gray-500 mt-1">Last run: {workflow.lastRun}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{workflow.efficiency}%</div>
                          <div className="text-sm text-gray-600">Efficiency</div>
                        </div>
                        <div className="w-20">
                          <Progress value={workflow.progress} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">{workflow.progress}%</div>
                        </div>
                        <Badge className={getWorkflowStatusColor(workflow.status)}>
                          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workflow Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Workflow Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Active</div>
                      <div className="text-sm text-green-700">Running workflows</div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">8</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">Completed</div>
                      <div className="text-sm text-blue-700">Today</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">24</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium text-yellow-900">Paused</div>
                      <div className="text-sm text-yellow-700">On hold</div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">2</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-red-900">Failed</div>
                      <div className="text-sm text-red-700">Errors</div>
                    </div>
                    <div className="text-2xl font-bold text-red-900">1</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Automations Tab */}
        <TabsContent value="automations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Automation List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Smart Automations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automations.map((automation) => (
                    <div key={automation.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getAutomationStatusColor(automation.status)}`}>
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{automation.name}</div>
                          <div className="text-sm text-gray-600">{automation.description}</div>
                          <div className="text-xs text-gray-500 mt-1">Last triggered: {automation.lastTriggered}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{automation.successRate}%</div>
                          <div className="text-sm text-gray-600">Success Rate</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{automation.timeSaved}h</div>
                          <div className="text-sm text-gray-600">Time Saved</div>
                        </div>
                        <Badge className={getAutomationStatusColor(automation.status)}>
                          {automation.status.charAt(0).toUpperCase() + automation.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Automation Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Automation Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Success Rate</div>
                      <div className="text-sm text-green-700">Workflow completion</div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">94%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">Time Saved</div>
                      <div className="text-sm text-blue-700">Daily automation</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">6.2h</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium text-purple-900">Error Rate</div>
                      <div className="text-sm text-purple-700">Failed workflows</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">2.1%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Workflow Efficiency</span>
                    <span className="text-sm text-green-600">+5.2%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Automation Success</span>
                    <span className="text-sm text-green-600">+2.1%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Time Savings</span>
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uptime</span>
                    <Badge className="bg-green-100 text-green-700">99.9%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-gray-600">~150ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Error Rate</span>
                    <span className="text-sm text-green-600">0.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Users</span>
                    <span className="text-sm text-gray-600">24</span>
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