
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { IntakeFormProcessor } from '@/services/intakeFormProcessor';
import { TrendingUp, Users, Clock, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

export const IntakeAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { forms, submissions } = useIntakeForms();

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const result = await IntakeFormProcessor.getSubmissionAnalytics();
        if (result.success) {
          setAnalytics(result.analytics || []);
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const getSubmissionStats = () => {
    const total = submissions.length;
    const completed = submissions.filter(s => s.status === 'completed').length;
    const pending = submissions.filter(s => s.status === 'pending').length;
    const highPriority = submissions.filter(s => s.priority_level === 'high').length;

    return { total, completed, pending, highPriority };
  };

  const getFormPerformance = () => {
    const formStats = forms.map(form => {
      const formSubmissions = submissions.filter(s => s.form_id === form.id);
      const completionRate = formSubmissions.length > 0 
        ? (formSubmissions.filter(s => s.status === 'completed').length / formSubmissions.length) * 100
        : 0;

      return {
        name: form.title,
        submissions: formSubmissions.length,
        completionRate: Math.round(completionRate),
        averageTime: 8 // This would be calculated from actual data
      };
    });

    return formStats;
  };

  const getEventTypeData = () => {
    const eventCounts: Record<string, number> = {};
    analytics.forEach(event => {
      eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1;
    });

    return Object.entries(eventCounts).map(([type, count]) => ({
      name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count
    }));
  };

  const stats = getSubmissionStats();
  const formPerformance = getFormPerformance();
  const eventTypeData = getEventTypeData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="grid gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forms">Form Performance</TabsTrigger>
          <TabsTrigger value="events">Event Analytics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Performance Metrics</CardTitle>
              <CardDescription>
                Completion rates and submission volumes by form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formPerformance.map((form, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{form.name}</h4>
                      <Badge variant={form.completionRate >= 80 ? 'default' : 'secondary'}>
                        {form.completionRate}% completion
                      </Badge>
                    </div>
                    <Progress value={form.completionRate} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{form.submissions} submissions</span>
                      <span>~{form.averageTime} min avg</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Distribution</CardTitle>
                <CardDescription>Breakdown of form interaction events</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={eventTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {eventTypeData.map((entry, index) => (
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
                <CardTitle>Submission Volume</CardTitle>
                <CardDescription>Form submissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="submissions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Key performance indicators and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Completion Rate Trends
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This Week</span>
                      <span className="font-medium text-green-600">↗ 12%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Week</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Previous Week</span>
                      <span className="font-medium">82%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Patient Engagement
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Form Views</span>
                      <span className="font-medium text-blue-600">↗ 23%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Start Rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Drop-off Rate</span>
                      <span className="font-medium text-red-600">15%</span>
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
