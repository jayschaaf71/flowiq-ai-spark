
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  FileText
} from 'lucide-react';
import { useIntakeForms } from '@/hooks/useIntakeForms';

const mockAnalyticsData = {
  completionRates: [
    { name: 'Mon', completed: 85, abandoned: 15 },
    { name: 'Tue', completed: 92, abandoned: 8 },
    { name: 'Wed', completed: 78, abandoned: 22 },
    { name: 'Thu', completed: 88, abandoned: 12 },
    { name: 'Fri', completed: 94, abandoned: 6 },
    { name: 'Sat', completed: 82, abandoned: 18 },
    { name: 'Sun', completed: 76, abandoned: 24 }
  ],
  submissionTrends: [
    { month: 'Jan', submissions: 45 },
    { month: 'Feb', submissions: 52 },
    { month: 'Mar', submissions: 48 },
    { month: 'Apr', submissions: 61 },
    { month: 'May', submissions: 55 },
    { month: 'Jun', submissions: 67 }
  ],
  formPopularity: [
    { name: 'New Patient Intake', value: 35, color: '#3B82F6' },
    { name: 'Follow-up Forms', value: 25, color: '#10B981' },
    { name: 'Pregnancy Intake', value: 20, color: '#F59E0B' },
    { name: 'Insurance Update', value: 12, color: '#EF4444' },
    { name: 'Other', value: 8, color: '#8B5CF6' }
  ]
};

export const IntakeAnalyticsDashboard: React.FC = () => {
  const { forms, submissions, loading } = useIntakeForms();

  const analytics = {
    totalSubmissions: submissions.length,
    completedSubmissions: submissions.filter(s => s.status === 'completed').length,
    pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
    averageCompletionTime: '8.5 min',
    completionRate: submissions.length > 0 
      ? Math.round((submissions.filter(s => s.status === 'completed').length / submissions.length) * 100)
      : 0
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{analytics.totalSubmissions}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{analytics.completionRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={analytics.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Time</p>
                <p className="text-2xl font-bold">{analytics.averageCompletionTime}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{analytics.pendingSubmissions}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Completion Rates</CardTitle>
            <CardDescription>Form completion vs abandonment rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalyticsData.completionRates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
                <Bar dataKey="abandoned" fill="#EF4444" name="Abandoned" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Submission Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Trends</CardTitle>
            <CardDescription>Monthly form submissions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockAnalyticsData.submissionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Form Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Popularity */}
        <Card>
          <CardHeader>
            <CardTitle>Most Used Forms</CardTitle>
            <CardDescription>Distribution of form submissions by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockAnalyticsData.formPopularity}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockAnalyticsData.formPopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Key insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">High Completion Rate</p>
                <p className="text-sm text-green-700">
                  {analytics.completionRate}% completion rate is above industry average
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Optimal Form Length</p>
                <p className="text-sm text-blue-700">
                  Average completion time of {analytics.averageCompletionTime} indicates good form design
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
              <Users className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Review Queue</p>
                <p className="text-sm text-amber-700">
                  {analytics.pendingSubmissions} submissions awaiting staff review
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form-specific Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Form Performance Details</CardTitle>
          <CardDescription>Individual form completion statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forms.map(form => {
              const formSubmissions = submissions.filter(s => s.form_id === form.id);
              const completedCount = formSubmissions.filter(s => s.status === 'completed').length;
              const completionRate = formSubmissions.length > 0 
                ? Math.round((completedCount / formSubmissions.length) * 100) 
                : 0;

              return (
                <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{form.title}</h3>
                    <p className="text-sm text-gray-600">
                      {formSubmissions.length} total submissions • {completedCount} completed
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{completionRate}%</p>
                      <p className="text-xs text-gray-500">completion</p>
                    </div>
                    <Badge variant={completionRate >= 80 ? "default" : completionRate >= 60 ? "secondary" : "destructive"}>
                      {completionRate >= 80 ? "Excellent" : completionRate >= 60 ? "Good" : "Needs Improvement"}
                    </Badge>
                  </div>
                </div>
              );
            })}
            
            {forms.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No forms available for analysis
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
