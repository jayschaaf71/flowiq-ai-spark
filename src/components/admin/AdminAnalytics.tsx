import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Database,
  Clock,
  Target
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const tenantUsageData = [
    { name: 'West County Spine', users: 8, appointments: 45, forms: 23 },
    { name: 'Midwest Dental Sleep', users: 6, appointments: 32, forms: 18 },
  ];

  const activityData = [
    { month: 'Oct', logins: 234, appointments: 89, forms: 67 },
    { month: 'Nov', logins: 312, appointments: 127, forms: 94 },
    { month: 'Dec', logins: 398, appointments: 156, forms: 112 },
    { month: 'Jan', logins: 445, appointments: 189, forms: 134 },
  ];

  const specialtyData = [
    { name: 'Chiropractic', value: 60, color: '#059669' },
    { name: 'Dental Sleep', value: 40, color: '#0ea5e9' },
  ];

  const performanceMetrics = [
    {
      title: 'Platform Uptime',
      value: '99.97%',
      change: '+0.02%',
      icon: Activity,
      trend: 'up'
    },
    {
      title: 'Avg Response Time',
      value: '45ms',
      change: '-5ms',
      icon: Clock,
      trend: 'up'
    },
    {
      title: 'Active Sessions',
      value: '127',
      change: '+23',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Database Load',
      value: '12%',
      change: '-3%',
      icon: Database,
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into platform performance and usage</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <metric.icon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">{metric.change} from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tenant Usage Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Tenant Usage Comparison</CardTitle>
            <CardDescription>Active usage across pilot practices</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tenantUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#059669" name="Users" />
                <Bar dataKey="appointments" fill="#0ea5e9" name="Appointments" />
                <Bar dataKey="forms" fill="#8b5cf6" name="Forms" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Specialty Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Specialties</CardTitle>
            <CardDescription>Distribution of practice types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={specialtyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {specialtyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4 space-x-4">
              {specialtyData.map((entry) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Activity Trends</CardTitle>
          <CardDescription>User engagement and system usage over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="logins" 
                stroke="#059669" 
                strokeWidth={2}
                name="User Logins"
              />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                name="Appointments"
              />
              <Line 
                type="monotone" 
                dataKey="forms" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Form Submissions"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pilot Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">95%</div>
            <p className="text-sm text-muted-foreground mt-2">
              Both pilot practices showing excellent adoption rates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">4.8/5</div>
            <p className="text-sm text-muted-foreground mt-2">
              Average user feedback rating across practices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">Excellent</div>
            <p className="text-sm text-muted-foreground mt-2">
              All key metrics within optimal ranges
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};