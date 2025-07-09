import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Database
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const platformMetrics = [
    {
      title: 'Total Tenants',
      value: '2',
      icon: Building,
      change: '+2 this month',
      changeType: 'positive' as const
    },
    {
      title: 'Active Users',
      value: '12',
      icon: Users,
      change: '+8 this week',
      changeType: 'positive' as const
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      icon: Activity,
      change: '+0.1% this month',
      changeType: 'positive' as const
    },
    {
      title: 'Database Usage',
      value: '2.4GB',
      icon: Database,
      change: '+0.5GB this week',
      changeType: 'neutral' as const
    }
  ];

  const recentActivity = [
    {
      action: 'New tenant created',
      details: 'West County Spine & Joint',
      timestamp: '2 hours ago',
      type: 'success'
    },
    {
      action: 'User invited',
      details: 'amanda.chen@midwestdentalsleep.com',
      timestamp: '4 hours ago',
      type: 'info'
    },
    {
      action: 'System maintenance',
      details: 'Database optimization completed',
      timestamp: '1 day ago',
      type: 'success'
    }
  ];

  const systemAlerts = [
    {
      level: 'info',
      message: 'Pilot programs ready for deployment',
      timestamp: '1 hour ago'
    },
    {
      level: 'warning',
      message: 'High API usage detected for tenant #2',
      timestamp: '3 hours ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground">Monitor and manage the entire platform ecosystem</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </div>
                <metric.icon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">{metric.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Platform health and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    {alert.level === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp}
                    </span>
                  </div>
                  <Badge variant={alert.level === 'warning' ? 'destructive' : 'default'}>
                    {alert.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Health</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-muted-foreground">API Availability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">45ms</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2.1k</div>
              <div className="text-sm text-muted-foreground">Daily API Calls</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};