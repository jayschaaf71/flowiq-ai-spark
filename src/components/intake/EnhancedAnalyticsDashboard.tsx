
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Users } from 'lucide-react';
import { useIntakeForms } from '@/hooks/useIntakeForms';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const EnhancedAnalyticsDashboard: React.FC = () => {
  const { submissions, forms } = useIntakeForms();

  // Generate analytics data
  const submissionsByDay = React.useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const daySubmissions = submissions.filter(s => 
        new Date(s.created_at).toDateString() === date.toDateString()
      );
      
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        submissions: daySubmissions.length,
        completed: daySubmissions.filter(s => s.status === 'completed').length
      });
    }
    return last7Days;
  }, [submissions]);

  const priorityDistribution = React.useMemo(() => {
    const priorities = submissions.reduce((acc, s) => {
      acc[s.priority_level] = (acc[s.priority_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(priorities).map(([priority, count]) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: count,
      percentage: Math.round((count / submissions.length) * 100)
    }));
  }, [submissions]);

  const formPerformance = React.useMemo(() => {
    return forms.map(form => {
      const formSubmissions = submissions.filter(s => s.form_id === form.id);
      const completedSubmissions = formSubmissions.filter(s => s.status === 'completed');
      
      return {
        name: form.title,
        submissions: formSubmissions.length,
        completion_rate: formSubmissions.length > 0 
          ? Math.round((completedSubmissions.length / formSubmissions.length) * 100)
          : 0
      };
    });
  }, [forms, submissions]);

  const completionRate = submissions.length > 0 
    ? Math.round((submissions.filter(s => s.status === 'completed').length / submissions.length) * 100)
    : 0;

  const avgResponseTime = '8.5 min'; // This would be calculated from actual data
  const todaySubmissions = submissions.filter(s => 
    new Date(s.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Submissions</p>
                <p className="text-2xl font-bold">{todaySubmissions}</p>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">{avgResponseTime}</p>
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm">-2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Forms</p>
                <p className="text-2xl font-bold">{forms.length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions Trend */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Submission Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={submissionsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Total Submissions"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Form Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Form Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="submissions" fill="#3B82F6" name="Total Submissions" />
              <Bar yAxisId="right" dataKey="completion_rate" fill="#10B981" name="Completion Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Form Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Form Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formPerformance.map((form, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{form.name}</h4>
                  <p className="text-sm text-gray-600">{form.submissions} submissions</p>
                </div>
                <Badge 
                  className={
                    form.completion_rate >= 90 
                      ? "bg-green-100 text-green-700"
                      : form.completion_rate >= 70
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {form.completion_rate}% completion
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
