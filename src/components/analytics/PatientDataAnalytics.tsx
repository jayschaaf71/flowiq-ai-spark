
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Activity, AlertTriangle, Download, Calendar } from 'lucide-react';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { useTenantConfig } from '@/utils/tenantConfig';

export const PatientDataAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const { submissions } = useIntakeForms();
  const tenantConfig = useTenantConfig();

  // Specialty-specific metrics
  const getSpecialtyMetrics = () => {
    switch (tenantConfig.specialty.toLowerCase()) {
      case 'dermatology':
        return {
          primaryMetrics: ['Skin Conditions', 'Age Groups', 'Treatment Types', 'Severity Levels'],
          charts: ['conditionTypes', 'ageDistribution', 'treatments', 'severity']
        };
      case 'cardiology':
        return {
          primaryMetrics: ['Risk Factors', 'Age Groups', 'Procedures', 'Emergency Cases'],
          charts: ['riskFactors', 'ageDistribution', 'procedures', 'emergency']
        };
      case 'pediatrics':
        return {
          primaryMetrics: ['Age Groups', 'Growth Metrics', 'Immunizations', 'Development'],
          charts: ['ageGroups', 'growth', 'vaccines', 'development']
        };
      default:
        return {
          primaryMetrics: ['Demographics', 'Conditions', 'Visits', 'Outcomes'],
          charts: ['demographics', 'conditions', 'visits', 'outcomes']
        };
    }
  };

  const specialtyMetrics = getSpecialtyMetrics();

  // Sample data - in real app this would come from your analytics service
  const patientDemographics = [
    { ageGroup: '0-18', count: 45, percentage: 15 },
    { ageGroup: '19-35', count: 89, percentage: 30 },
    { ageGroup: '36-50', count: 76, percentage: 25 },
    { ageGroup: '51-65', count: 58, percentage: 20 },
    { ageGroup: '65+', count: 32, percentage: 10 }
  ];

  const conditionTrends = [
    { month: 'Jan', newCases: 12, followUps: 8, resolved: 5 },
    { month: 'Feb', newCases: 19, followUps: 12, resolved: 7 },
    { month: 'Mar', newCases: 15, followUps: 15, resolved: 9 },
    { month: 'Apr', newCases: 22, followUps: 18, resolved: 12 },
    { month: 'May', newCases: 18, followUps: 20, resolved: 15 },
    { month: 'Jun', newCases: 25, followUps: 22, resolved: 18 }
  ];

  const getSpecialtyConditions = () => {
    switch (tenantConfig.specialty.toLowerCase()) {
      case 'dermatology':
        return [
          { condition: 'Acne', count: 45, severity: 'Moderate' },
          { condition: 'Eczema', count: 32, severity: 'Mild' },
          { condition: 'Psoriasis', count: 18, severity: 'Severe' },
          { condition: 'Skin Cancer Screening', count: 25, severity: 'Preventive' }
        ];
      case 'cardiology':
        return [
          { condition: 'Hypertension', count: 68, severity: 'High' },
          { condition: 'Chest Pain', count: 42, severity: 'Urgent' },
          { condition: 'Heart Murmur', count: 28, severity: 'Moderate' },
          { condition: 'Arrhythmia', count: 35, severity: 'High' }
        ];
      default:
        return [
          { condition: 'General Checkup', count: 85, severity: 'Routine' },
          { condition: 'Acute Care', count: 45, severity: 'Urgent' },
          { condition: 'Chronic Care', count: 32, severity: 'Ongoing' },
          { condition: 'Preventive Care', count: 28, severity: 'Routine' }
        ];
    }
  };

  const specialtyConditions = getSpecialtyConditions();

  const COLORS = ['#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'severe':
      case 'urgent':
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'mild':
      case 'routine':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Patient Data Analytics</h2>
          <p className="text-gray-600">{tenantConfig.specialty} practice insights and trends</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d' | '1y') => setTimeRange(value)}>
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
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-green-600">↗ 12% from last month</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Cases</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-green-600">↗ 8% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Treatments</p>
                <p className="text-2xl font-bold">234</p>
                <p className="text-xs text-blue-600">→ Stable</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-red-600">↗ 3 from yesterday</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Age Distribution</CardTitle>
                <CardDescription>Breakdown by age groups</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={patientDemographics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageGroup" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>{tenantConfig.specialty} Conditions</CardTitle>
                <CardDescription>Most common conditions treated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {specialtyConditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{condition.condition}</p>
                        <p className="text-sm text-gray-600">{condition.count} cases</p>
                      </div>
                      <Badge className={getSeverityColor(condition.severity)}>
                        {condition.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Patient demographics by age</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={patientDemographics}
                      dataKey="count"
                      nameKey="ageGroup"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {patientDemographics.map((entry, index) => (
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
                <CardTitle>Demographics Summary</CardTitle>
                <CardDescription>Key demographic insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">65%</div>
                    <div className="text-sm text-blue-700">Female Patients</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">42</div>
                    <div className="text-sm text-green-700">Average Age</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">78%</div>
                    <div className="text-sm text-purple-700">Return Patients</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">3.2</div>
                    <div className="text-sm text-orange-700">Avg Visits/Year</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Condition Analysis</CardTitle>
              <CardDescription>Detailed breakdown of {tenantConfig.specialty.toLowerCase()} conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={specialtyConditions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="condition" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Trends</CardTitle>
              <CardDescription>New cases, follow-ups, and resolved cases over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={conditionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="newCases" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="followUps" stroke="#06B6D4" strokeWidth={2} />
                  <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
