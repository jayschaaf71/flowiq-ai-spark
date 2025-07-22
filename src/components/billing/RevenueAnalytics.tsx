import React, { useState } from 'react';
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
  Cell
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target,
  AlertTriangle,
  Download,
  Filter
} from "lucide-react";

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  net: number;
  claims: number;
}

interface PayerData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export const RevenueAnalytics = () => {
  const [timeframe, setTimeframe] = useState('12months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data - replace with actual API calls
  const revenueData: RevenueData[] = [
    { month: 'Jan', revenue: 45231, expenses: 32100, net: 13131, claims: 124 },
    { month: 'Feb', revenue: 52847, expenses: 34200, net: 18647, claims: 142 },
    { month: 'Mar', revenue: 48392, expenses: 31800, net: 16592, claims: 135 },
    { month: 'Apr', revenue: 51204, expenses: 33500, net: 17704, claims: 148 },
    { month: 'May', revenue: 54672, expenses: 35200, net: 19472, claims: 156 },
    { month: 'Jun', revenue: 49823, expenses: 32900, net: 16923, claims: 139 },
    { month: 'Jul', revenue: 56431, expenses: 36100, net: 20331, claims: 162 },
    { month: 'Aug', revenue: 53918, expenses: 34800, net: 19118, claims: 151 },
    { month: 'Sep', revenue: 57249, expenses: 37200, net: 20049, claims: 168 },
    { month: 'Oct', revenue: 61032, expenses: 38500, net: 22532, claims: 174 },
    { month: 'Nov', revenue: 58764, expenses: 37800, net: 20964, claims: 165 },
    { month: 'Dec', revenue: 62187, expenses: 39200, net: 22987, claims: 179 }
  ];

  const payerData: PayerData[] = [
    { name: 'Blue Cross Blue Shield', amount: 185320, percentage: 32, color: '#3B82F6' },
    { name: 'Aetna', amount: 142850, percentage: 24, color: '#8B5CF6' },
    { name: 'UnitedHealth', amount: 128400, percentage: 22, color: '#10B981' },
    { name: 'Medicare', amount: 89670, percentage: 15, color: '#F59E0B' },
    { name: 'Cigna', amount: 42360, percentage: 7, color: '#EF4444' }
  ];

  const currentMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];
  
  const revenueChange = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;
  const netChange = ((currentMonth.net - previousMonth.net) / previousMonth.net) * 100;

  const totalYearRevenue = revenueData.reduce((sum, month) => sum + month.revenue, 0);
  const totalYearExpenses = revenueData.reduce((sum, month) => sum + month.expenses, 0);
  const totalYearNet = totalYearRevenue - totalYearExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Revenue Analytics</h2>
          <p className="text-muted-foreground">
            Financial performance and revenue insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalYearRevenue.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              {revenueChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={revenueChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(revenueChange).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalYearNet.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              {netChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={netChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(netChange).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((totalYearNet / totalYearRevenue) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Above industry average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalYearRevenue / 12).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Per month this year
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
          <TabsTrigger value="payers">Payer Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trends</CardTitle>
              <CardDescription>
                Revenue, expenses, and net profit over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    name="Expenses"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="net" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Net Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Claims Volume</CardTitle>
              <CardDescription>
                Number of claims processed monthly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="claims" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payers" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Payer</CardTitle>
                <CardDescription>
                  Distribution of revenue across insurance providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={payerData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="amount"
                      label={({ percentage }) => `${percentage}%`}
                    >
                      {payerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Payers</CardTitle>
                <CardDescription>
                  Largest revenue sources by insurance provider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {payerData.map((payer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: payer.color }}
                      />
                      <div>
                        <p className="text-sm font-medium">{payer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {payer.percentage}% of total revenue
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${payer.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payer Performance Analysis</CardTitle>
              <CardDescription>
                Payment speed and approval rates by insurance provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Blue Cross Blue Shield', approval: 94, avgDays: 12, trend: 'up' },
                  { name: 'Aetna', approval: 91, avgDays: 15, trend: 'stable' },
                  { name: 'UnitedHealth', approval: 88, avgDays: 18, trend: 'down' },
                  { name: 'Medicare', approval: 96, avgDays: 8, trend: 'up' },
                  { name: 'Cigna', approval: 87, avgDays: 22, trend: 'down' }
                ].map((payer, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{payer.name}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Approval Rate</p>
                      <p className="font-medium">{payer.approval}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Avg Payment Days</p>
                      <p className="font-medium">{payer.avgDays} days</p>
                    </div>
                    <div className="text-center">
                      <Badge variant={
                        payer.trend === 'up' ? 'default' : 
                        payer.trend === 'down' ? 'destructive' : 'secondary'
                      }>
                        {payer.trend === 'up' ? '↑' : payer.trend === 'down' ? '↓' : '→'} 
                        {payer.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Collection Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">94.2%</div>
                <div className="mt-2 w-full bg-secondary rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +1.8% from last quarter
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Days in A/R</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32.4</div>
                <p className="text-xs text-muted-foreground">
                  Industry benchmark: 35 days
                </p>
                <Badge variant="default" className="mt-1 text-xs">
                  Above Average
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Clean Claim Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">89.7%</div>
                <div className="mt-2 w-full bg-secondary rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '89.7%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: 90%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Cycle KPIs</CardTitle>
              <CardDescription>
                Key performance indicators for revenue cycle management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { metric: 'First-pass resolution rate', value: '87.3%', target: '90%', status: 'warning' },
                { metric: 'Denial rate', value: '8.2%', target: '<5%', status: 'alert' },
                { metric: 'Authorization success rate', value: '95.8%', target: '95%', status: 'good' },
                { metric: 'Patient satisfaction score', value: '4.6/5', target: '4.5/5', status: 'good' },
                { metric: 'Revenue per patient', value: '$324', target: '$300', status: 'good' }
              ].map((kpi, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      kpi.status === 'good' ? 'bg-green-500' : 
                      kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">{kpi.metric}</p>
                      <p className="text-sm text-muted-foreground">Target: {kpi.target}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{kpi.value}</p>
                    <Badge variant={
                      kpi.status === 'good' ? 'default' : 
                      kpi.status === 'warning' ? 'secondary' : 'destructive'
                    } className="text-xs">
                      {kpi.status === 'good' ? 'On Target' : 
                       kpi.status === 'warning' ? 'Needs Attention' : 'Below Target'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecast</CardTitle>
              <CardDescription>
                Projected revenue for the next 6 months based on current trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Q1 2025 Projection</h4>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">$186,420</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">+8.2% growth expected</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
                    <h4 className="font-medium text-green-900 dark:text-green-100">Annual Target</h4>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">$750,000</p>
                    <p className="text-sm text-green-700 dark:text-green-300">On track to exceed by 12%</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Growth Opportunities</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                      <span>Reduce claim denials</span>
                      <Badge variant="outline">+$15K/month</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                      <span>Improve collection rate</span>
                      <Badge variant="outline">+$8K/month</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                      <span>Optimize payer mix</span>
                      <Badge variant="outline">+$12K/month</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};