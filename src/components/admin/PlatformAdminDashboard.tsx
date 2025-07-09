import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Server, 
  Users, 
  Activity, 
  DollarSign, 
  AlertTriangle, 
  Zap,
  Database,
  Network,
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react';
import { RealTimePerformanceMonitor } from './RealTimePerformanceMonitor';
import { TenantResourceOptimization } from './TenantResourceOptimization';
import { SecurityIncidentResponse } from './SecurityIncidentResponse';
import { MultiLevelAdminHierarchy } from './MultiLevelAdminHierarchy';
import { APIRateLimitingDashboard } from './APIRateLimitingDashboard';
import { AutomatedBackupManager } from './AutomatedBackupManager';

interface PlatformMetrics {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  systemUptime: number;
  totalRevenue: number;
  averageResponseTime: number;
  criticalAlerts: number;
  resourceUtilization: number;
}

export const PlatformAdminDashboard: React.FC = () => {
  const [metrics] = useState<PlatformMetrics>({
    totalTenants: 127,
    activeTenants: 119,
    totalUsers: 2847,
    systemUptime: 99.97,
    totalRevenue: 284750,
    averageResponseTime: 142,
    criticalAlerts: 3,
    resourceUtilization: 73
  });

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Administration</h1>
          <p className="text-muted-foreground">Enterprise-level system monitoring and management</p>
        </div>
        <div className="flex items-center gap-2">
              <Badge variant={metrics.criticalAlerts > 0 ? 'destructive' : 'success'}>
                {metrics.criticalAlerts} Critical Alerts
              </Badge>
          <Badge variant="outline">
            {metrics.systemUptime}% Uptime
          </Badge>
        </div>
      </div>

      {/* Critical Alerts */}
      {metrics.criticalAlerts > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {metrics.criticalAlerts} critical system alerts require immediate attention. 
            <Button variant="link" className="p-0 h-auto ml-2" onClick={() => setActiveTab('security')}>
              View Details
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeTenants} active ({((metrics.activeTenants/metrics.totalTenants)*100).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
            <Progress value={100 - (metrics.averageResponseTime / 10)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(metrics.totalRevenue/1000).toFixed(0)}k</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.resourceUtilization}%</div>
            <Progress value={metrics.resourceUtilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Across all services
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-5xl grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="admin">Admin Hierarchy</TabsTrigger>
              <TabsTrigger value="api">API Monitoring</TabsTrigger>
              <TabsTrigger value="backups">Backups</TabsTrigger>
            </TabsList>
          </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health Overview</CardTitle>
                <CardDescription>Real-time system status and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>Database Performance</span>
                    </div>
                    <Badge variant="success">Optimal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      <span>Network Latency</span>
                    </div>
                    <Badge variant="success">&lt; 50ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>API Response</span>
                    </div>
                    <Badge variant="warning">Elevated</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Security Status</span>
                    </div>
                    <Badge variant="success">Secure</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform events and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-success rounded-full mt-2"></div>
                    <div className="text-sm">
                      <p className="font-medium">New tenant onboarded</p>
                      <p className="text-muted-foreground">Sunrise Dental Care - 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-warning rounded-full mt-2"></div>
                    <div className="text-sm">
                      <p className="font-medium">Performance alert resolved</p>
                      <p className="text-muted-foreground">Database optimization complete - 15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                    <div className="text-sm">
                      <p className="font-medium">System update deployed</p>
                      <p className="text-muted-foreground">Version 2.1.4 - 2 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <RealTimePerformanceMonitor />
        </TabsContent>

        <TabsContent value="optimization">
          <TenantResourceOptimization />
        </TabsContent>

        <TabsContent value="security">
          <SecurityIncidentResponse />
        </TabsContent>

        <TabsContent value="admin">
          <MultiLevelAdminHierarchy />
        </TabsContent>

        <TabsContent value="api">
          <APIRateLimitingDashboard />
        </TabsContent>

        <TabsContent value="backups">
          <AutomatedBackupManager />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};