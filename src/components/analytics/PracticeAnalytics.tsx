import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign,
  Activity,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter
} from "lucide-react";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
}

interface ChartData {
  name: string;
  value: number;
  previous?: number;
  target?: number;
}

export const PracticeAnalytics = () => {
  const [timeframe, setTimeframe] = useState('30days');
  const [selectedMetrics, setSelectedMetrics] = useState('overview');
  
  // Mock data - replace with actual API calls
  const metrics: MetricCard[] = [
    {
      title: 'Total Patients',
      value: 1247,
      change: 12.5,
      trend: 'up',
      icon: Users
    },
    {
      title: 'Appointments This Month',
      value: 342,
      change: 8.2,
      trend: 'up',
      icon: Calendar
    },
    {
      title: 'Monthly Revenue',
      value: '$54,230',
      change: -3.1,
      trend: 'down',
      icon: DollarSign
    },
    {
      title: 'Patient Satisfaction',
      value: '4.8/5',
      change: 2.3,
      trend: 'up',
      icon: Activity
    },
    {
      title: 'No-Show Rate',
      value: '8.5%',
      change: -15.2,
      trend: 'up',
      icon: Target
    },
    {
      title: 'Avg Wait Time',
      value: '12 min',
      change: -22.1,
      trend: 'up',
      icon: Clock
    }
  ];

  const patientGrowthData: ChartData[] = [
    { name: 'Jan', value: 1050, previous: 980 },
    { name: 'Feb', value: 1120, previous: 1020 },
    { name: 'Mar', value: 1180, previous: 1080 },
    { name: 'Apr', value: 1210, previous: 1150 },
    { name: 'May', value: 1247, previous: 1180 },
    { name: 'Jun', value: 1290, previous: 1210 }
  ];

  const appointmentData: ChartData[] = [
    { name: 'Week 1', value: 85, target: 80 },
    { name: 'Week 2', value: 92, target: 80 },
    { name: 'Week 3', value: 78, target: 80 },
    { name: 'Week 4', value: 87, target: 80 }
  ];

  const revenueByService: ChartData[] = [
    { name: 'Consultations', value: 35000 },
    { name: 'Procedures', value: 28000 },
    { name: 'Follow-ups', value: 15000 },
    { name: 'Emergency', value: 8000 }
  ];

  const outcomeData: ChartData[] = [
    { name: 'Excellent', value: 45 },
    { name: 'Good', value: 35 },
    { name: 'Fair', value: 15 },
    { name: 'Poor', value: 5 }
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const renderTrendIcon = (trend: string, change: number) => {
    const isPositive = (trend === 'up' && change > 0) || (trend === 'down' && change < 0);
    return isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Practice Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into practice performance and patient outcomes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                {renderTrendIcon(metric.trend, metric.change)}
                <span className={
                  metric.change > 0 ? 'text-green-500' : 'text-red-500'
                }>
                  {formatChange(metric.change)}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="patients">Patient Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Growth Trend</CardTitle>
                <CardDescription>
                  Monthly patient acquisition vs. previous year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={patientGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.2}
                      name="This Year"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="previous" 
                      stroke="hsl(var(--muted-foreground))" 
                      fill="hsl(var(--muted))" 
                      fillOpacity={0.1}
                      name="Last Year"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Appointment Volume</CardTitle>
                <CardDescription>
                  Appointments scheduled vs. target capacity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Actual" />
                    <Bar dataKey="target" fill="hsl(var(--muted))" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Practice Efficiency Metrics</CardTitle>
              <CardDescription>
                Key performance indicators for operational efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Capacity Utilization</span>
                    <Badge variant="default">87%</Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">On-Time Performance</span>
                    <Badge variant="default">92%</Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Patient Flow</span>
                    <Badge variant="secondary">Good</Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Resource Efficiency</span>
                    <Badge variant="default">85%</Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>
                  Age distribution of patient population
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: '0-17', value: 45 },
                    { name: '18-35', value: 120 },
                    { name: '36-50', value: 180 },
                    { name: '51-65', value: 160 },
                    { name: '65+', value: 95 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Acquisition Sources</CardTitle>
                <CardDescription>
                  How new patients discover your practice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Referrals', value: 40 },
                        { name: 'Online Search', value: 25 },
                        { name: 'Insurance Network', value: 20 },
                        { name: 'Word of Mouth', value: 15 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Patient Engagement Metrics</CardTitle>
              <CardDescription>
                Tracking patient interaction and satisfaction levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">94%</div>
                  <p className="text-sm text-muted-foreground">Appointment Attendance</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">4.8/5</div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">78%</div>
                  <p className="text-sm text-muted-foreground">Return Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service Type</CardTitle>
                <CardDescription>
                  Revenue breakdown across different services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByService}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${(value/1000).toFixed(0)}k`}
                    >
                      {revenueByService.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Performance</CardTitle>
                <CardDescription>
                  Payment collection rates and timelines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Collection Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Avg Days to Payment</span>
                  <span className="text-sm font-medium">28 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Outstanding A/R</span>
                  <span className="text-sm font-medium">$12,450</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bad Debt Rate</span>
                  <span className="text-sm font-medium">2.1%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Outcomes</CardTitle>
                <CardDescription>
                  Patient outcome distribution across treatments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={outcomeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {outcomeData.map((entry, index) => (
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
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>
                  Key quality indicators and benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Patient Safety Score</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">98.5%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Readmission Rate</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">3.2%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Infection Rate</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">0.8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Compliance Score</span>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">89%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};