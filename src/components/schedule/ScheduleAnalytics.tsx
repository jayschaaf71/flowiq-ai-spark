
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scheduleIQService } from '@/services/scheduleIQService';

export const ScheduleAnalytics: React.FC = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const data = await scheduleIQService.getAnalytics({ start: startDate, end: endDate });
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mockTrendData = [
    { date: '2024-01-01', bookings: 15, optimizations: 3 },
    { date: '2024-01-02', bookings: 22, optimizations: 5 },
    { date: '2024-01-03', bookings: 18, optimizations: 2 },
    { date: '2024-01-04', bookings: 25, optimizations: 4 },
    { date: '2024-01-05', bookings: 30, optimizations: 6 },
    { date: '2024-01-06', bookings: 28, optimizations: 3 },
    { date: '2024-01-07', bookings: 35, optimizations: 7 }
  ];

  const pieData = [
    { name: 'AI Booked', value: analytics?.aiBookedAppointments || 12, color: '#3B82F6' },
    { name: 'Manual Booked', value: (analytics?.totalAppointments || 45) - (analytics?.aiBookedAppointments || 12), color: '#6B7280' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Schedule Analytics</h2>
            <p className="text-gray-600">AI scheduling performance and insights</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {['7', '30', '90'].map((days) => (
            <Badge
              key={days}
              variant={timeRange === days ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTimeRange(days)}
            >
              {days} days
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Booking Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.aiBookingRate?.toFixed(1) || 0}%</div>
            <Progress value={analytics?.aiBookingRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmation Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.confirmationRate?.toFixed(1) || 0}%</div>
            <Progress value={analytics?.confirmationRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimizations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.optimizationsApplied || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics?.averageUtilizationImprovement?.toFixed(1) || 0}% avg improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">Last {timeRange} days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="optimizations" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">AI Booking Performance</p>
                <p className="text-sm text-gray-600">
                  {analytics?.aiBookingRate > 70 
                    ? "Excellent AI booking rate! The system is effectively matching patients with available slots."
                    : "AI booking rate could be improved. Consider adjusting booking confidence thresholds."
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Schedule Optimization</p>
                <p className="text-sm text-gray-600">
                  {analytics?.optimizationsApplied > 0 
                    ? `${analytics.optimizationsApplied} optimizations applied with ${analytics?.averageUtilizationImprovement?.toFixed(1)}% average improvement.`
                    : "No recent optimizations. Consider running schedule optimization to improve efficiency."
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Patient Confirmation</p>
                <p className="text-sm text-gray-600">
                  {analytics?.confirmationRate > 85 
                    ? "High confirmation rate indicates good patient engagement and scheduling accuracy."
                    : "Consider implementing reminder automation to improve confirmation rates."
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
