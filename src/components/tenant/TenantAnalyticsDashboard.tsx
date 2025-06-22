
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Building2, Activity, 
  DollarSign, Calendar, FileText, Download, Filter
} from 'lucide-react';
import { useTenantManagement } from '@/hooks/useTenantManagement';

export const TenantAnalyticsDashboard: React.FC = () => {
  const { tenants } = useTenantManagement();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock analytics data - in real app this would come from API
  const getAnalyticsData = () => {
    const totalTenants = tenants?.length || 0;
    const activeTenants = tenants?.filter(t => t.is_active)?.length || 0;
    const basicTier = tenants?.filter(t => t.subscription_tier === 'basic')?.length || 0;
    const premiumTier = tenants?.filter(t => t.subscription_tier === 'premium')?.length || 0;
    const enterpriseTier = tenants?.filter(t => t.subscription_tier === 'enterprise')?.length || 0;

    return {
      totalTenants,
      activeTenants,
      inactiveTenants: totalTenants - activeTenants,
      basicTier,
      premiumTier,
      enterpriseTier,
      growth: 12.5, // Mock growth percentage
      revenue: 47580,
      revenueGrowth: 8.3
    };
  };

  const analytics = getAnalyticsData();

  const tenantGrowthData = [
    { month: 'Jan', tenants: 15, revenue: 25000 },
    { month: 'Feb', tenants: 18, revenue: 28500 },
    { month: 'Mar', tenants: 22, revenue: 35200 },
    { month: 'Apr', tenants: 28, revenue: 42800 },
    { month: 'May', tenants: 35, revenue: 52500 },
    { month: 'Jun', tenants: 42, revenue: 63000 }
  ];

  const subscriptionData = [
    { name: 'Basic', value: analytics.basicTier, color: '#8884d8' },
    { name: 'Premium', value: analytics.premiumTier, color: '#82ca9d' },
    { name: 'Enterprise', value: analytics.enterpriseTier, color: '#ffc658' }
  ];

  const usageMetrics = [
    { tenant: 'Smile Dental', users: 15, storage: 2.4, apiCalls: 12500 },
    { tenant: 'BackFix Chiro', users: 8, storage: 1.8, apiCalls: 8900 },
    { tenant: 'HealthFirst', users: 22, storage: 4.1, apiCalls: 18200 },
    { tenant: 'WellCare Clinic', users: 12, storage: 2.9, apiCalls: 9800 }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tenant Analytics</h2>
          <p className="text-gray-600">Comprehensive insights across all tenants</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                <p className="text-2xl font-bold">{analytics.totalTenants}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+{analytics.growth}%</span>
                </div>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tenants</p>
                <p className="text-2xl font-bold">{analytics.activeTenants}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-gray-600">
                    {Math.round((analytics.activeTenants / analytics.totalTenants) * 100)}% active
                  </span>
                </div>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">${analytics.revenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+{analytics.revenueGrowth}%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Users/Tenant</p>
                <p className="text-2xl font-bold">14.2</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-600">+5.1%</span>
                </div>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="growth" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="usage">Usage Metrics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tenant Growth</CardTitle>
                <CardDescription>Monthly tenant acquisition over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={tenantGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="tenants" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>Monthly recurring revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tenantGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>Breakdown of subscription tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subscriptionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {subscriptionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Metrics</CardTitle>
                <CardDescription>Key subscription performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Basic Tier</span>
                    <span>{analytics.basicTier} tenants</span>
                  </div>
                  <Progress value={(analytics.basicTier / analytics.totalTenants) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Premium Tier</span>
                    <span>{analytics.premiumTier} tenants</span>
                  </div>
                  <Progress value={(analytics.premiumTier / analytics.totalTenants) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enterprise Tier</span>
                    <span>{analytics.enterpriseTier} tenants</span>
                  </div>
                  <Progress value={(analytics.enterpriseTier / analytics.totalTenants) * 100} className="h-2" />
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Average Revenue per Tenant</span>
                    <span className="font-bold text-green-600">$1,135</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Usage Metrics</CardTitle>
              <CardDescription>Resource consumption across tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageMetrics.map((tenant, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{tenant.tenant}</h4>
                      <Badge variant="outline">{tenant.users} users</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Storage Usage</p>
                        <p className="font-medium">{tenant.storage} GB</p>
                        <Progress value={(tenant.storage / 5) * 100} className="h-1 mt-1" />
                      </div>
                      <div>
                        <p className="text-gray-600">API Calls (Monthly)</p>
                        <p className="font-medium">{tenant.apiCalls.toLocaleString()}</p>
                        <Progress value={(tenant.apiCalls / 25000) * 100} className="h-1 mt-1" />
                      </div>
                      <div>
                        <p className="text-gray-600">Active Users</p>
                        <p className="font-medium">{Math.round(tenant.users * 0.8)} active</p>
                        <Progress value={80} className="h-1 mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Platform health and performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>System Uptime</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">99.8%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Response Time</span>
                  <span className="font-medium">142ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Database Performance</span>
                  <Badge variant="outline" className="text-green-600">Excellent</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Error Rate</span>
                  <span className="font-medium text-green-600">0.02%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Metrics</CardTitle>
                <CardDescription>Customer support and satisfaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Open Tickets</span>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg Resolution Time</span>
                  <span className="font-medium">2.4 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Customer Satisfaction</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">4.8/5</span>
                    <div className="text-yellow-500">★★★★★</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Feature Requests</span>
                  <span className="font-medium">23</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
