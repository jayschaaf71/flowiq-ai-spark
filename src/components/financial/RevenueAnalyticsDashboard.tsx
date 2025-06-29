
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const RevenueAnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const revenueData = [
    { month: 'Jan', revenue: 145000, collections: 138000, charges: 155000 },
    { month: 'Feb', revenue: 152000, collections: 144000, charges: 162000 },
    { month: 'Mar', revenue: 148000, collections: 141000, charges: 158000 },
    { month: 'Apr', revenue: 167000, collections: 159000, charges: 178000 },
    { month: 'May', revenue: 172000, collections: 164000, charges: 183000 },
    { month: 'Jun', revenue: 165000, collections: 157000, charges: 175000 }
  ];

  const kpiData = [
    { 
      title: 'Monthly Collections', 
      value: '$164,750', 
      change: '+12.3%', 
      trend: 'up',
      target: '$170,000',
      progress: 97
    },
    { 
      title: 'Collection Rate', 
      value: '94.8%', 
      change: '+2.1%', 
      trend: 'up',
      target: '95%',
      progress: 95
    },
    { 
      title: 'Days in A/R', 
      value: '18.2', 
      change: '-3.2 days', 
      trend: 'up',
      target: '15 days',
      progress: 82
    },
    { 
      title: 'Denial Rate', 
      value: '2.8%', 
      change: '-0.5%', 
      trend: 'up',
      target: '2%',
      progress: 86
    }
  ];

  const payerMix = [
    { name: 'Medicare', value: 35, amount: 57750 },
    { name: 'Medicaid', value: 25, amount: 41250 },
    { name: 'Commercial', value: 30, amount: 49500 },
    { name: 'Self-Pay', value: 10, amount: 16500 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold">Revenue Analytics Dashboard</h2>
            <p className="text-gray-600">Comprehensive financial performance insights</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </Button>
          <Button 
            variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('quarter')}
          >
            Quarter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{kpi.value}</div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">{kpi.change}</span>
                </div>
                <span className="text-sm text-gray-500">Target: {kpi.target}</span>
              </div>
              <Progress value={kpi.progress} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Revenue Trend Analysis
            </CardTitle>
            <CardDescription>Monthly revenue, collections, and charges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="collections" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="charges" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payer Mix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Payer Mix Analysis
            </CardTitle>
            <CardDescription>Revenue distribution by payer type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payerMix.map((payer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-blue-${500 + (index * 100)}`} />
                    <span className="font-medium">{payer.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${payer.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{payer.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Performance Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Revenue Goal</span>
                <Badge variant="outline" className="text-green-600">97% Complete</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Collection Rate Target</span>
                <Badge variant="outline" className="text-green-600">On Track</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">A/R Days Reduction</span>
                <Badge variant="outline" className="text-yellow-600">Needs Attention</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              Real-time Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Today's Collections</span>
                <span className="font-medium">$8,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Claims Submitted</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Payments Posted</span>
                <span className="font-medium">15</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Generate Monthly Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="w-4 h-4 mr-2" />
                Update Targets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
