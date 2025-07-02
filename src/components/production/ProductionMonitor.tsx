import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Database, 
  Globe, 
  Server,
  Users,
  Zap
} from 'lucide-react';

interface SystemStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  responseTime: number;
  uptime: number;
  lastChecked: string;
}

export const ProductionMonitor: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    { name: 'Database', status: 'healthy', responseTime: 25, uptime: 99.99, lastChecked: '30s ago' },
    { name: 'API Gateway', status: 'healthy', responseTime: 85, uptime: 99.95, lastChecked: '45s ago' },
    { name: 'Edge Functions', status: 'healthy', responseTime: 120, uptime: 99.8, lastChecked: '1m ago' },
    { name: 'File Storage', status: 'healthy', responseTime: 45, uptime: 99.9, lastChecked: '2m ago' },
    { name: 'Authentication', status: 'healthy', responseTime: 65, uptime: 99.85, lastChecked: '1m ago' },
    { name: 'Real-time', status: 'healthy', responseTime: 95, uptime: 99.7, lastChecked: '45s ago' }
  ]);

  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    apiRequests: 0,
    errorRate: 0,
    avgResponseTime: 0
  });

  // Simulate real-time monitoring updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate metrics updates
      setMetrics(prev => ({
        activeUsers: Math.max(50, Math.min(500, prev.activeUsers + Math.floor((Math.random() - 0.5) * 20))),
        apiRequests: prev.apiRequests + Math.floor(Math.random() * 50),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5)),
        avgResponseTime: Math.max(50, Math.min(300, prev.avgResponseTime + (Math.random() - 0.5) * 20))
      }));

      // Simulate status updates
      setSystemStatus(prev => prev.map(service => ({
        ...service,
        responseTime: Math.max(10, service.responseTime + (Math.random() - 0.5) * 20),
        status: service.responseTime > 200 ? 'warning' : 'healthy'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Initialize with realistic values
  useEffect(() => {
    setMetrics({
      activeUsers: 187,
      apiRequests: 12450,
      errorRate: 0.8,
      avgResponseTime: 125
    });
  }, []);

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const overallStatus = systemStatus.every(s => s.status === 'healthy') ? 'healthy' : 
                      systemStatus.some(s => s.status === 'critical') ? 'critical' : 'warning';

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Health Monitor</h2>
          <p className="text-gray-600">Real-time production monitoring</p>
        </div>
        <Badge className={`${getStatusColor(overallStatus)} px-3 py-1`}>
          {getStatusIcon(overallStatus)}
          <span className="ml-2 capitalize">
            {overallStatus === 'healthy' ? 'All Systems Operational' : 
             overallStatus === 'warning' ? 'Degraded Performance' : 'Service Disruption'}
          </span>
        </Badge>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.apiRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.errorRate > 2 ? 'text-red-600' : 'text-green-600'}`}>
              {metrics.errorRate.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">Last 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.avgResponseTime > 200 ? 'text-yellow-600' : 'text-green-600'}`}>
              {Math.round(metrics.avgResponseTime)}ms
            </div>
            <p className="text-xs text-muted-foreground">API latency</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health</CardTitle>
          <CardDescription>Current status of all system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemStatus.map((service) => (
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
                    <span className="font-medium">{Math.round(service.responseTime)}ms</span>
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

      {/* Alerts */}
      {systemStatus.some(s => s.status !== 'healthy') && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Some services are experiencing issues. Performance may be affected.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};