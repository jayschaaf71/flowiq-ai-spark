import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, TrendingUp, Users, DollarSign, Activity, PieChart, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PlatformAnalytics = () => {
  const navigate = useNavigate();
  
  console.log('🔧 [PlatformAnalytics] Component rendered');

  const handleViewDetailedReport = () => {
    console.log('🔧 [PlatformAnalytics] Viewing detailed revenue report');
    // Navigate to detailed revenue analytics
    navigate('/platform-admin/costs');
  };

  const handleViewUserInsights = () => {
    console.log('🔧 [PlatformAnalytics] Viewing user insights');
    // Navigate to user analytics
    navigate('/platform-admin/users');
  };

  const handleViewPerformanceReport = () => {
    console.log('🔧 [PlatformAnalytics] Viewing performance report');
    // Navigate to infrastructure page
    navigate('/platform-admin/infrastructure');
  };

  const handleViewSystemMonitor = () => {
    console.log('🔧 [PlatformAnalytics] Viewing system monitor');
    // Navigate to infrastructure page
    navigate('/platform-admin/infrastructure');
  };

  const handleExportReport = (reportType: string) => {
    console.log('🔧 [PlatformAnalytics] Exporting report:', reportType);
    // In a real implementation, this would generate and download a report
    alert(`Exporting ${reportType} report... (This would generate a PDF/CSV in production)`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">Comprehensive analytics and insights across all tenants</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Tenant Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Monthly Recurring Revenue</span>
              <Badge variant="default">$45,231</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Annual Growth Rate</span>
              <Badge variant="default">+23.4%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Average Revenue Per Tenant</span>
              <Badge variant="secondary">$3,769</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Churn Rate</span>
              <Badge variant="secondary">2.1%</Badge>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" variant="outline" onClick={handleViewDetailedReport}>
                <BarChart className="h-4 w-4 mr-2" />
                View Detailed Report
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => handleExportReport('revenue')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              User Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Total Users</span>
              <Badge variant="default">1,234</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Active This Month</span>
              <Badge variant="default">987</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>New Signups</span>
              <Badge variant="secondary">45</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Engagement Rate</span>
              <Badge variant="secondary">78.5%</Badge>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" variant="outline" onClick={handleViewUserInsights}>
                <PieChart className="h-4 w-4 mr-2" />
                User Insights
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => handleExportReport('users')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Average Response Time</span>
              <Badge variant="default">125ms</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>API Success Rate</span>
              <Badge variant="default">99.8%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Database Queries</span>
              <Badge variant="secondary">2.3M/day</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Error Rate</span>
              <Badge variant="secondary">0.2%</Badge>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" variant="outline" onClick={handleViewPerformanceReport}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance Report
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => handleExportReport('performance')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Export
              </Button>
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
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>CPU Usage</span>
              <Badge variant="default">45%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Memory Usage</span>
              <Badge variant="default">67%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Disk Usage</span>
              <Badge variant="secondary">23%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Network Load</span>
              <Badge variant="secondary">Medium</Badge>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" variant="outline" onClick={handleViewSystemMonitor}>
                <Activity className="h-4 w-4 mr-2" />
                System Monitor
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => handleExportReport('system')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};