import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { NotificationCenter } from '@/components/ui/NotificationCenter';
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
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Surgical Masks',
      category: 'PPE',
      quantity: 500,
      minQuantity: 100,
      status: 'in-stock',
      lastUpdated: '2024-01-15',
      supplier: 'MedSupply Co.'
    },
    {
      id: '2',
      name: 'Disposable Gloves',
      category: 'PPE',
      quantity: 50,
      minQuantity: 200,
      status: 'low-stock',
      lastUpdated: '2024-01-14',
      supplier: 'SafetyFirst Inc.'
    },
    {
      id: '3',
      name: 'Antibacterial Wipes',
      category: 'Cleaning',
      quantity: 0,
      minQuantity: 50,
      status: 'out-of-stock',
      lastUpdated: '2024-01-10',
      supplier: 'CleanPro Solutions'
    }
  ];

  const workflows: Workflow[] = [
    {
      id: '1',
      name: 'Patient Check-in',
      type: 'Automation',
      status: 'active',
      progress: 85,
      lastRun: '2024-01-15 09:30',
      nextRun: '2024-01-15 10:00',
      efficiency: 92
    },
    {
      id: '2',
      name: 'Appointment Reminders',
      type: 'Communication',
      status: 'active',
      progress: 60,
      lastRun: '2024-01-15 08:00',
      nextRun: '2024-01-15 12:00',
      efficiency: 88
    }
  ];

  const automations: Automation[] = [
    {
      id: '1',
      name: 'Auto Check-in',
      description: 'Automatically check in patients based on appointment time',
      status: 'enabled',
      lastTriggered: '2024-01-15 09:30',
      successRate: 95,
      timeSaved: 15
    },
    {
      id: '2',
      name: 'Inventory Alerts',
      description: 'Send alerts when inventory items are running low',
      status: 'enabled',
      lastTriggered: '2024-01-15 08:15',
      successRate: 100,
      timeSaved: 30
    }
  ];

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      case 'ordered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAutomationStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
        return 'bg-green-100 text-green-800';
      case 'disabled':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Operations Assistant</h1>
          <p className="text-muted-foreground">Manage practice operations, inventory, and automations</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationCenter />
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">
                  8 completed, 37 remaining
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  2 low stock, 1 out of stock
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Automation Success</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last week
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
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Patient John Doe checked in</span>
                    <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Appointment reminder sent</span>
                    <span className="text-xs text-muted-foreground ml-auto">5 min ago</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Low stock alert: Disposable gloves</span>
                    <span className="text-xs text-muted-foreground ml-auto">10 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Patient Wait Time</span>
                    <span className="text-sm text-green-600">-15%</span>
                  </div>
                  <Progress value={85} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Automation Success</span>
                    <span className="text-sm text-green-600">+2.1%</span>
                  </div>
                  <Progress value={94} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Time Savings</span>
                    <span className="text-sm text-green-600">+25%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inventory List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Items
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
                      <div className="text-sm text-blue-700">Today's completed</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">12</div>
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
                      <div className="text-sm text-red-700">Errors today</div>
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
                  Active Automations
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
                          <div className="font-medium text-gray-900">{automation.timeSaved}min</div>
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
                      <div className="font-medium text-green-900">Enabled</div>
                      <div className="text-sm text-green-700">Active automations</div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">6</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">Time Saved</div>
                      <div className="text-sm text-blue-700">Today's savings</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">2.5h</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium text-purple-900">Success Rate</div>
                      <div className="text-sm text-purple-700">Overall average</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">94%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <div className="font-medium text-orange-900">Triggers</div>
                      <div className="text-sm text-orange-700">Today's triggers</div>
                    </div>
                    <div className="text-2xl font-bold text-orange-900">45</div>
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