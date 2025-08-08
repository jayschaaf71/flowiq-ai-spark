
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  DollarSign,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  Star,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data
  const analyticsData = {
    revenue: {
      current: 28470,
      previous: 25120,
      change: '+13.3%',
      trend: 'up'
    },
    bookings: {
      current: 156,
      previous: 142,
      change: '+9.9%',
      trend: 'up'
    },
    customers: {
      current: 247,
      previous: 231,
      change: '+6.9%',
      trend: 'up'
    },
    satisfaction: {
      current: 94,
      previous: 91,
      change: '+3.3%',
      trend: 'up'
    }
  };

  const communicationData = [
    { type: 'SMS', count: 1247, percentage: 45 },
    { type: 'Voice Calls', count: 892, percentage: 32 },
    { type: 'Email', count: 634, percentage: 23 }
  ];

  const serviceTypeData = [
    { type: 'HVAC Maintenance', bookings: 45, revenue: 10800 },
    { type: 'Plumbing Repair', bookings: 32, revenue: 7680 },
    { type: 'Electrical Installation', bookings: 28, revenue: 12600 },
    { type: 'Emergency Service', bookings: 15, revenue: 4500 },
    { type: 'Inspection', bookings: 36, revenue: 4320 }
  ];

  const weeklyData = [
    { day: 'Mon', bookings: 12, revenue: 2880 },
    { day: 'Tue', bookings: 18, revenue: 4320 },
    { day: 'Wed', bookings: 15, revenue: 3600 },
    { day: 'Thu', bookings: 22, revenue: 5280 },
    { day: 'Fri', bookings: 19, revenue: 4560 },
    { day: 'Sat', bookings: 8, revenue: 1920 },
    { day: 'Sun', bookings: 3, revenue: 720 }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ?
      <TrendingUp className="h-4 w-4 text-green-600" /> :
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="bookings">Bookings</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
              <SelectItem value="satisfaction">Satisfaction</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${analyticsData.revenue.current.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analyticsData.revenue.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(analyticsData.revenue.trend)}`}>
                    {analyticsData.revenue.change}
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{analyticsData.bookings.current}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analyticsData.bookings.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(analyticsData.bookings.trend)}`}>
                    {analyticsData.bookings.change}
                  </span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold">{analyticsData.customers.current}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analyticsData.customers.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(analyticsData.customers.trend)}`}>
                    {analyticsData.customers.change}
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction Rate</p>
                <p className="text-2xl font-bold">{analyticsData.satisfaction.current}%</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analyticsData.satisfaction.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(analyticsData.satisfaction.trend)}`}>
                    {analyticsData.satisfaction.change}
                  </span>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
            <CardDescription>Bookings and revenue by day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-center font-medium">{day.day}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(day.bookings / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{day.bookings} bookings</div>
                    <div className="text-sm text-gray-600">${day.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Communication Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Channels</CardTitle>
            <CardDescription>How customers prefer to contact you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {communicationData.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {item.type === 'SMS' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                      {item.type === 'Voice Calls' && <Phone className="h-4 w-4 text-green-600" />}
                      {item.type === 'Email' && <Mail className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.type}</div>
                      <div className="text-sm text-gray-600">{item.count} interactions</div>
                    </div>
                  </div>
                  <Badge variant="secondary">{item.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Type Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Service Type Performance</CardTitle>
          <CardDescription>Revenue and bookings by service type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceTypeData.map((service) => (
              <div key={service.type} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Activity className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">{service.type}</div>
                    <div className="text-sm text-gray-600">{service.bookings} bookings</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${service.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">
                    ${Math.round(service.revenue / service.bookings)} avg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common analytics tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Export Report</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <PieChart className="h-6 w-6 mb-2" />
              <span>Generate Insights</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Set Goals</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
