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
      name: 'Claims Processing',
      type: 'Revenue Cycle',
      status: 'paused',
      progress: 45,
      lastRun: '2024-01-15 08:00 AM',
      nextRun: '2024-01-15 12:00 PM',
      efficiency: 78
    }
  ];

  const automations: Automation[] = [
    {
      id: '1',
      name: 'Auto Patient Scheduling',
      description: 'Automatically schedules follow-up appointments based on treatment plans',
      status: 'enabled',
      lastTriggered: '2024-01-15 10:15 AM',
      successRate: 95,
      timeSaved: 120
    },
    {
      id: '2',
      name: 'Inventory Reorder Alerts',
      description: 'Automatically generates reorder requests when inventory is low',
      status: 'enabled',
      lastTriggered: '2024-01-15 09:45 AM',
      successRate: 88,
      timeSaved: 90
    },
    {
      id: '3',
      name: 'Insurance Verification',
      description: 'Automatically verifies patient insurance coverage before appointments',
      status: 'enabled',
      lastTriggered: '2024-01-15 09:00 AM',
      successRate: 92,
      timeSaved: 180
    },
    {
      id: '4',
      name: 'Report Generation',
      description: 'Automatically generates daily operational reports',
      status: 'error',
      lastTriggered: '2024-01-15 08:30 AM',
      successRate: 75,
      timeSaved: 60
    }
  ];

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-500 text-white';
      case 'low-stock':
        return 'bg-yellow-500 text-white';
      case 'out-of-stock':
        return 'bg-red-500 text-white';
      case 'ordered':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'paused':
        return 'bg-yellow-500 text-white';
      case 'completed':
        return 'bg-blue-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAutomationStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
        return 'bg-green-500 text-white';
      case 'disabled':
        return 'bg-gray-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operations Assistant</h1>
          <p className="text-gray-600">AI-powered operations management and workflow automation</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white">
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
            <div className="text-xs text-blue-700 mt-2">+2 from yesterday</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Automation Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">94%</div>
            <div className="text-xs text-green-700 mt-2">+3% from last week</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">8.5 hrs</div>
            <div className="text-xs text-purple-700 mt-2">Today</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">3</div>
            <div className="text-xs text-orange-700 mt-2">Low stock items</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory Management
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Workflow Automation
          </TabsTrigger>
          <TabsTrigger value="automations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Smart Automations
          </TabsTrigger>
        </TabsList>

        {/* Inventory Management Tab */}
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

        {/* Workflow Automation Tab */}
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
                          <div className="font-medium text-gray-900">{workflow.progress}%</div>
                          <div className="text-sm text-gray-600">Efficiency: {workflow.efficiency}%</div>
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

            {/* Workflow Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Performance Metrics
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

        {/* Smart Automations Tab */}
        <TabsContent value="automations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Automation List */}
            <Card>
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
                          <div className="text-sm text-gray-600">{automation.timeSaved} min saved</div>
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
                  <Target className="h-5 w-5" />
                  Automation Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Time Savings</h4>
                    <p className="text-sm text-green-700">Automations save 8.5 hours daily across all workflows</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Error Reduction</h4>
                    <p className="text-sm text-blue-700">Automated processes reduce manual errors by 87%</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Efficiency Gains</h4>
                    <p className="text-sm text-purple-700">Overall operational efficiency improved by 34%</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Cost Savings</h4>
                    <p className="text-sm text-orange-700">Automation saves approximately $2,400 monthly</p>
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