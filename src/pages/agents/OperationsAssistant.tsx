import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Database,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  PieChart,
  Activity,
  Users,
  Shield,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Send,
  Receipt,
  Zap,
  Calculator,
  Target,
  Award,
  Cog,
  Wrench,
  Truck,
  Package,
  AlertCircle,
  Bell,
  FileText,
  Monitor,
  Smartphone,
  Tablet,
  Server,
  Cloud,
  Lock,
  Key,
  UserCheck,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Wifi,
  WifiOff,
  CheckSquare,
  Square,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

// Import existing comprehensive components
import { OpsIQ } from '@/pages/agents/OpsIQ';
import { SystemHealthCheck } from '@/components/production/SystemHealthCheck';
import { TenantPerformanceMetrics } from '@/components/tenant/TenantPerformanceMetrics';
import InventoryIQ from '@/pages/agents/InventoryIQ';
import InsightIQ from '@/pages/agents/InsightIQ';
import EducationIQ from '@/pages/agents/EducationIQ';
import GrowthIQ from '@/pages/agents/GrowthIQ';
import { PlatformSecurity } from '@/components/admin/PlatformSecurity';

interface System {
  id: string;
  name: string;
  type: 'database' | 'api' | 'service' | 'integration';
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  uptime: number;
  lastCheck: string;
  responseTime: number;
}

interface Inventory {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'on-order';
  lastUpdated: string;
}

interface Performance {
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export const OperationsAssistant = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data
  const systems: System[] = [
    {
      id: '1',
      name: 'Main Database',
      type: 'database',
      status: 'online',
      uptime: 99.9,
      lastCheck: '2024-01-15 10:30 AM',
      responseTime: 45
    },
    {
      id: '2',
      name: 'Payment API',
      type: 'api',
      status: 'online',
      uptime: 99.8,
      lastCheck: '2024-01-15 10:30 AM',
      responseTime: 120
    },
    {
      id: '3',
      name: 'Email Service',
      type: 'service',
      status: 'degraded',
      uptime: 95.2,
      lastCheck: '2024-01-15 10:30 AM',
      responseTime: 800
    },
    {
      id: '4',
      name: 'Insurance Integration',
      type: 'integration',
      status: 'offline',
      uptime: 0,
      lastCheck: '2024-01-15 10:30 AM',
      responseTime: 0
    }
  ];

  const inventory: Inventory[] = [
    {
      id: '1',
      name: 'CPAP Masks',
      category: 'Sleep Medicine',
      quantity: 45,
      minQuantity: 20,
      status: 'in-stock',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Oral Appliances',
      category: 'Sleep Medicine',
      quantity: 12,
      minQuantity: 15,
      status: 'low-stock',
      lastUpdated: '2024-01-15'
    },
    {
      id: '3',
      name: 'Sleep Study Equipment',
      category: 'Diagnostic',
      quantity: 0,
      minQuantity: 5,
      status: 'out-of-stock',
      lastUpdated: '2024-01-14'
    }
  ];

  const performance: Performance[] = [
    {
      metric: 'System Uptime',
      value: 99.7,
      unit: '%',
      trend: 'up',
      change: 0.2
    },
    {
      metric: 'Response Time',
      value: 245,
      unit: 'ms',
      trend: 'down',
      change: -15
    },
    {
      metric: 'Active Users',
      value: 127,
      unit: '',
      trend: 'up',
      change: 12
    },
    {
      metric: 'Data Processing',
      value: 1.2,
      unit: 'GB/s',
      trend: 'stable',
      change: 0
    }
  ];

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'on-order': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operations Assistant</h1>
          <p className="text-gray-600">AI-powered operations management and system optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            AI Assistant
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold">99.7%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Systems</p>
                <p className="text-2xl font-bold">{systems.filter(s => s.status === 'online').length}</p>
              </div>
              <Server className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Items</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className="text-2xl font-bold">245ms</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

<<<<<<< HEAD
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
=======
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
>>>>>>> main
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemHealthCheck />
            <TenantPerformanceMetrics />
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          <OpsIQ />
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <InventoryIQ />
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <InsightIQ />
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <EducationIQ />
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          <GrowthIQ />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <PlatformSecurity />
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.map((metric) => (
                  <div key={metric.metric} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{metric.metric}</div>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">
                        {metric.value}{metric.unit}
                      </div>
                      <div className={`text-sm ${metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 