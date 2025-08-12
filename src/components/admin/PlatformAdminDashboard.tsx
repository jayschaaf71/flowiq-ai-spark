import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Settings,
  Loader,
  Building
} from 'lucide-react';
import { RealTimePerformanceMonitor } from './RealTimePerformanceMonitor';
import { TenantResourceOptimization } from './TenantResourceOptimization';
import { SecurityIncidentResponse } from './SecurityIncidentResponse';
import { MultiLevelAdminHierarchy } from './MultiLevelAdminHierarchy';
import { APIRateLimitingDashboard } from './APIRateLimitingDashboard';
import { AutomatedBackupManager } from './AutomatedBackupManager';
import { UserRoleTester } from '@/components/testing/UserRoleTester';
import { TestUserManager } from './TestUserManager';
import { useRealPlatformMetrics } from '@/hooks/useRealPlatformMetrics';

export const PlatformAdminDashboard: React.FC = () => {
  console.log('🔧 [PlatformAdminDashboard] Component rendered');
  
  const { 
    metrics, 
    alerts, 
    tenants,
    users,
    loading, 
    error, 
    insertSampleMetrics 
  } = useRealPlatformMetrics();
  
  console.log('🔧 [PlatformAdminDashboard] Metrics state:', { metrics, loading, error });
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 animate-spin" />
          <span>Loading platform metrics...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert className="border-destructive bg-destructive/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Error loading platform data:</strong> {error}
          <Button 
            variant="link" 
            className="p-0 h-auto ml-2" 
            onClick={insertSampleMetrics}
          >
            Initialize Sample Data
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Main dashboard with real data
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Administration</h1>
          <p className="text-muted-foreground">Enterprise-level system monitoring and management</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate('/platform-admin/tenants')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalTenants || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.activeTenants || 0} active tenants
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate('/platform-admin/users')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {users?.filter(u => u.role === 'platform_admin').length || 0} platform admins
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate('/platform-admin/infrastructure')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.systemUptime || 0}%</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate('/platform-admin/costs')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics?.totalRevenue || 0}</div>
            <p className="text-xs text-muted-foreground">Total platform revenue</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenants?.slice(0, 3).map((tenant, index) => (
                <div key={tenant.id} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Tenant: {tenant.name}</span>
                </div>
              ))}
              {alerts?.slice(0, 2).map((alert, index) => (
                <div key={alert.id} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-500' : 
                    alert.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm">{alert.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/platform-admin/users')}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/platform-admin/tenants')}
              >
                <Building className="mr-2 h-4 w-4" />
                View Tenants
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/platform-admin/security')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Security Settings
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/platform-admin/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};