import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  Server, 
  Shield,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  activeUsers: number;
  dbConnections: number;
  apiRequests: number;
  errorRate: number;
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastChecked: string;
  responseTime: number;
}

export const ProductionDashboard = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkLatency: 0,
    activeUsers: 0,
    dbConnections: 0,
    apiRequests: 0,
    errorRate: 0
  });

  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Schedule iQ', status: 'healthy', uptime: 99.9, lastChecked: '30s ago', responseTime: 120 },
    { name: 'Intake iQ', status: 'healthy', uptime: 99.8, lastChecked: '45s ago', responseTime: 95 },
    { name: 'Claims iQ', status: 'healthy', uptime: 99.7, lastChecked: '1m ago', responseTime: 150 },
    { name: 'Billing iQ', status: 'warning', uptime: 98.5, lastChecked: '2m ago', responseTime: 280 },
    { name: 'Scribe iQ', status: 'healthy', uptime: 99.6, lastChecked: '1m ago', responseTime: 110 },
    { name: 'Remind iQ', status: 'healthy', uptime: 99.9, lastChecked: '30s ago', responseTime: 85 },
    { name: 'Database', status: 'healthy', uptime: 99.99, lastChecked: '15s ago', responseTime: 25 },
    { name: 'File Storage', status: 'healthy', uptime: 99.95, lastChecked: '1m ago', responseTime: 45 }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'Billing iQ response time above threshold (280ms)',
      timestamp: '2 minutes ago'
    }
  ]);

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(20, Math.min(85, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        diskUsage: Math.max(15, Math.min(80, prev.diskUsage + (Math.random() - 0.5) * 2)),
        networkLatency: Math.max(10, Math.min(200, prev.networkLatency + (Math.random() - 0.5) * 20)),
        activeUsers: Math.max(50, Math.min(500, prev.activeUsers + Math.floor((Math.random() - 0.5) * 20))),
        dbConnections: Math.max(10, Math.min(100, prev.dbConnections + Math.floor((Math.random() - 0.5) * 5))),
        apiRequests: prev.apiRequests + Math.floor(Math.random() * 50),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Initialize with realistic values
  useEffect(() => {
    setMetrics({
      cpuUsage: 35,
      memoryUsage: 62,
      diskUsage: 45,
      networkLatency: 85,
      activeUsers: 187,
      dbConnections: 23,
      apiRequests: 12450,
      errorRate: 0.8
    });
  }, []);

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getMetricColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Production Monitoring</h1>
          <p className="text-gray-600">Real-time system health and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-700">
            <Activity className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <span className="text-xs text-gray-500">{alert.timestamp}</span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.cpuUsage, { warning: 70, critical: 85 })}`}>
              {metrics.cpuUsage.toFixed(1)}%
            </div>
            <Progress value={metrics.cpuUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.memoryUsage, { warning: 75, critical: 90 })}`}>
              {metrics.memoryUsage.toFixed(1)}%
            </div>
            <Progress value={metrics.memoryUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.errorRate, { warning: 2, critical: 5 })}`}>
              {metrics.errorRate.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.apiRequests.toLocaleString()} requests today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health</CardTitle>
          <CardDescription>Current status of all AI agents and core services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div key={service.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{service.name}</span>
                  <Badge className={getStatusColor(service.status)}>
                    {getStatusIcon(service.status)}
                    <span className="ml-1 capitalize">{service.status}</span>
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">{service.uptime}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response:</span>
                    <span className="font-medium">{service.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Check:</span>
                    <span className="font-medium">{service.lastChecked}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>AI-generated optimization recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-blue-900">Optimization Opportunity</p>
                <p className="text-xs text-blue-700">
                  Database query optimization could reduce Billing iQ response time by 30%
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-green-900">Performance Achievement</p>
                <p className="text-xs text-green-700">
                  Schedule iQ processing speed improved 15% this week
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-purple-900">Scaling Recommendation</p>
                <p className="text-xs text-purple-700">
                  Consider scaling Claims iQ processing capacity during peak hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Actions</CardTitle>
            <CardDescription>Production management and maintenance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Run Security Scan
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Database className="w-4 h-4 mr-2" />
              Database Health Check
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Globe className="w-4 h-4 mr-2" />
              Network Diagnostics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="w-4 h-4 mr-2" />
              Performance Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Zap className="w-4 h-4 mr-2" />
              Scale Resources
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};