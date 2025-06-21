
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react';

export const IntakeAnalyticsAdvanced: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [formFilter, setFormFilter] = useState('all');

  // Mock advanced analytics data
  const analytics = {
    overview: {
      totalSubmissions: 1247,
      completionRate: 78.5,
      avgTimeToComplete: 8.5,
      dropOffRate: 21.5,
      mobileUsage: 62.3
    },
    trends: {
      submissionsGrowth: 12.5,
      completionTrend: 5.2,
      mobileTrend: 8.1
    },
    formPerformance: [
      {
        name: 'New Patient Intake',
        submissions: 456,
        completionRate: 85.2,
        avgTime: 12.3,
        dropOffPoints: ['Insurance Information', 'Medical History'],
        satisfaction: 4.7
      },
      {
        name: 'Pre-Visit Questionnaire',
        submissions: 324,
        completionRate: 92.1,
        avgTime: 5.8,
        dropOffPoints: ['Symptoms Details'],
        satisfaction: 4.8
      },
      {
        name: 'Medical History Update',
        submissions: 267,
        completionRate: 76.4,
        avgTime: 8.9,
        dropOffPoints: ['Medications List', 'Allergies'],
        satisfaction: 4.2
      }
    ],
    demographics: {
      ageGroups: [
        { range: '18-25', percentage: 15.2 },
        { range: '26-35', percentage: 23.8 },
        { range: '36-45', percentage: 28.4 },
        { range: '46-55', percentage: 19.6 },
        { range: '56+', percentage: 13.0 }
      ],
      devices: [
        { type: 'Mobile', percentage: 62.3, trend: 8.1 },
        { type: 'Desktop', percentage: 31.2, trend: -4.2 },
        { type: 'Tablet', percentage: 6.5, trend: -1.8 }
      ]
    },
    dropOffAnalysis: [
      { step: 'Personal Information', completions: 95.2, dropOffs: 4.8 },
      { step: 'Insurance Details', completions: 87.3, dropOffs: 12.7 },
      { step: 'Medical History', completions: 82.1, dropOffs: 17.9 },
      { step: 'Current Medications', completions: 78.5, dropOffs: 21.5 },
      { step: 'Consent & Signature', completions: 76.2, dropOffs: 23.8 }
    ]
  };

  const getStatusColor = (rate: number) => {
    if (rate >= 85) return 'text-green-600 bg-green-100';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Advanced Intake Analytics</CardTitle>
              <CardDescription>Deep insights into form performance and user behavior</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formFilter} onValueChange={setFormFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Forms</SelectItem>
                  <SelectItem value="new-patient">New Patient</SelectItem>
                  <SelectItem value="pre-visit">Pre-Visit</SelectItem>
                  <SelectItem value="medical-history">Medical History</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{analytics.overview.totalSubmissions.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(analytics.trends.submissionsGrowth)}
                  <span className="text-xs text-gray-600 ml-1">
                    +{analytics.trends.submissionsGrowth}% vs last period
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">{analytics.overview.completionRate}%</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(analytics.trends.completionTrend)}
                  <span className="text-xs text-gray-600 ml-1">
                    +{analytics.trends.completionTrend}% vs last period
                  </span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.overview.avgTimeToComplete}m</p>
                <div className="flex items-center mt-1">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600 ml-1">
                    Time to complete
                  </span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drop-off Rate</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.overview.dropOffRate}%</p>
                <div className="flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-gray-600 ml-1">
                    Users who don't complete
                  </span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mobile Usage</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.overview.mobileUsage}%</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(analytics.trends.mobileTrend)}
                  <span className="text-xs text-gray-600 ml-1">
                    +{analytics.trends.mobileTrend}% vs last period
                  </span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            Form Performance Analysis
          </CardTitle>
          <CardDescription>Detailed performance metrics for each form template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analytics.formPerformance.map((form, index) => (
              <div key={form.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{form.name}</h4>
                    <p className="text-sm text-gray-600">{form.submissions} submissions</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(form.completionRate)}>
                      {form.completionRate}% completion
                    </Badge>
                    <Badge variant="outline">
                      ⭐ {form.satisfaction}/5.0
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <Progress value={form.completionRate} className="mt-1 h-2" />
                    <p className="text-xs text-gray-500 mt-1">{form.completionRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg. Time</p>
                    <div className="flex items-center mt-1">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="font-medium">{form.avgTime} minutes</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User Satisfaction</p>
                    <div className="flex items-center mt-1">
                      <span className="font-medium">{form.satisfaction}/5.0</span>
                      <div className="flex ml-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={`text-sm ${star <= Math.floor(form.satisfaction) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {form.dropOffPoints.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-2">Common Drop-off Points:</p>
                    <div className="flex gap-2">
                      {form.dropOffPoints.map(point => (
                        <Badge key={point} variant="outline" className="text-red-600 border-red-200">
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Drop-off Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step-by-Step Drop-off Analysis</CardTitle>
            <CardDescription>Where users are leaving the form</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.dropOffAnalysis.map((step, index) => (
                <div key={step.step} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{step.step}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600">{step.completions}%</span>
                      <span className="text-sm text-red-600">({step.dropOffs}% drop)</span>
                    </div>
                  </div>
                  <div className="flex">
                    <div 
                      className="bg-green-200 h-2 rounded-l"
                      style={{ width: `${step.completions}%` }}
                    />
                    <div 
                      className="bg-red-200 h-2 rounded-r"
                      style={{ width: `${step.dropOffs}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device & Demographics</CardTitle>
            <CardDescription>User behavior insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Device Usage</h4>
              <div className="space-y-3">
                {analytics.demographics.devices.map(device => (
                  <div key={device.type} className="flex items-center justify-between">
                    <span className="text-sm">{device.type}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={device.percentage} className="w-20 h-2" />
                      <span className="text-sm font-medium w-12">{device.percentage}%</span>
                      <div className="flex items-center">
                        {getTrendIcon(device.trend)}
                        <span className="text-xs text-gray-600 ml-1">{Math.abs(device.trend)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Age Groups</h4>
              <div className="space-y-2">
                {analytics.demographics.ageGroups.map(group => (
                  <div key={group.range} className="flex items-center justify-between">
                    <span className="text-sm">{group.range}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={group.percentage} className="w-20 h-2" />
                      <span className="text-sm font-medium w-12">{group.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
