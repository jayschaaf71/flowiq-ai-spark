
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Eye, Lock } from 'lucide-react';

export const ComplianceAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');

  const complianceScoreData = [
    { month: 'Jan', score: 92, incidents: 2 },
    { month: 'Feb', score: 94, incidents: 1 },
    { month: 'Mar', score: 96, incidents: 0 },
    { month: 'Apr', score: 95, incidents: 1 },
    { month: 'May', score: 97, incidents: 0 },
    { month: 'Jun', score: 98, incidents: 0 }
  ];

  const auditActivityData = [
    { date: '2024-01-01', phi_access: 145, system_access: 892, failed_attempts: 3 },
    { date: '2024-01-02', phi_access: 132, system_access: 756, failed_attempts: 1 },
    { date: '2024-01-03', phi_access: 189, system_access: 1024, failed_attempts: 2 },
    { date: '2024-01-04', phi_access: 167, system_access: 945, failed_attempts: 0 },
    { date: '2024-01-05', phi_access: 143, system_access: 823, failed_attempts: 1 },
    { date: '2024-01-06', phi_access: 156, system_access: 887, failed_attempts: 0 },
    { date: '2024-01-07', phi_access: 178, system_access: 967, failed_attempts: 2 }
  ];

  const riskCategoryData = [
    { name: 'Low Risk', value: 65, color: '#10B981' },
    { name: 'Medium Risk', value: 25, color: '#F59E0B' },
    { name: 'High Risk', value: 10, color: '#EF4444' }
  ];

  const complianceBreakdownData = [
    { category: 'Data Encryption', score: 100, target: 100 },
    { category: 'Access Controls', score: 95, target: 98 },
    { category: 'Audit Logging', score: 98, target: 95 },
    { category: 'Data Retention', score: 88, target: 90 },
    { category: 'Breach Detection', score: 92, target: 85 },
    { category: 'User Training', score: 85, target: 90 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compliance Analytics</h2>
          <p className="text-gray-600">Detailed compliance metrics and trends</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-green-600">98%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+2% this month</span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Incidents</p>
                <p className="text-2xl font-bold text-green-600">0</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">No incidents</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">PHI Access Events</p>
                <p className="text-2xl font-bold text-blue-600">1,210</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-gray-600">This month</span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Encrypted Data</p>
                <p className="text-2xl font-bold text-purple-600">100%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Lock className="w-3 h-3 text-purple-600" />
                  <span className="text-xs text-purple-600">All PHI secure</span>
                </div>
              </div>
              <Lock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Score Trend</CardTitle>
          <CardDescription>Monthly compliance scores and security incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={complianceScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Compliance Score (%)"
              />
              <Line 
                type="monotone" 
                dataKey="incidents" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Security Incidents"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Activity</CardTitle>
            <CardDescription>Daily system and PHI access patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={auditActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                <Bar dataKey="phi_access" fill="#3B82F6" name="PHI Access" />
                <Bar dataKey="system_access" fill="#10B981" name="System Access" />
                <Bar dataKey="failed_attempts" fill="#EF4444" name="Failed Attempts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Breakdown of security risk levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskCategoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {riskCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Category Breakdown</CardTitle>
          <CardDescription>Performance against compliance targets by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceBreakdownData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {item.score}% / {item.target}% target
                    </span>
                    {item.score >= item.target ? (
                      <Badge className="bg-green-100 text-green-700">✓ Met</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700">△ Below</Badge>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.score >= item.target ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${Math.min(item.score, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
