
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock, 
  Target,
  Brain,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export const ScheduleAnalytics = () => {
  const analyticsData = {
    totalAppointments: 342,
    aiBookedAppointments: 127,
    confirmationRate: 94.2,
    aiBookingRate: 37.1,
    optimizationsApplied: 15,
    averageUtilizationImprovement: 18.5,
    patientSatisfaction: 8.7,
    noShowRate: 4.3,
    averageWaitTime: 12.5,
    scheduleEfficiency: 89.2
  };

  const trendsData = [
    { metric: 'AI Booking Rate', current: 37.1, previous: 28.4, trend: 'up' },
    { metric: 'Schedule Efficiency', current: 89.2, previous: 82.1, trend: 'up' },
    { metric: 'Patient Satisfaction', current: 8.7, previous: 7.9, trend: 'up' },
    { metric: 'No-Show Rate', current: 4.3, previous: 6.8, trend: 'down' },
    { metric: 'Average Wait Time', current: 12.5, previous: 18.2, trend: 'down' },
    { metric: 'Confirmation Rate', current: 94.2, previous: 91.8, trend: 'up' }
  ];

  const aiInsights = [
    { type: 'success', message: 'AI booking rate increased 31% this month', impact: 'High' },
    { type: 'info', message: 'Peak booking times identified: 10-11 AM and 2-3 PM', impact: 'Medium' },
    { type: 'warning', message: 'Thursday afternoons show higher no-show rates', impact: 'Medium' },
    { type: 'success', message: 'Schedule optimization reduced wait times by 32%', impact: 'High' }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Schedule iQ Analytics
            <Badge className="bg-blue-100 text-blue-700">
              <Brain className="w-3 h-3 mr-1" />
              AI Insights
            </Badge>
          </CardTitle>
          <CardDescription>
            Comprehensive analytics and AI-powered insights for your scheduling performance
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalAppointments}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              AI Auto-Booked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analyticsData.aiBookedAppointments}</div>
            <div className="text-xs text-gray-600">{analyticsData.aiBookingRate}% of total</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Confirmation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.confirmationRate}%</div>
            <Progress value={analyticsData.confirmationRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Schedule Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analyticsData.scheduleEfficiency}%</div>
            <Progress value={analyticsData.scheduleEfficiency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            Month-over-month comparison of key scheduling metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendsData.map((trend, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{trend.metric}</span>
                  <div className={`flex items-center gap-1 text-xs ${
                    (trend.trend === 'up' && !trend.metric.includes('No-Show') && !trend.metric.includes('Wait Time')) ||
                    (trend.trend === 'down' && (trend.metric.includes('No-Show') || trend.metric.includes('Wait Time')))
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${trend.trend === 'down' ? 'rotate-180' : ''}`} />
                    {Math.abs(trend.current - trend.previous).toFixed(1)}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{trend.current}{trend.metric.includes('Rate') || trend.metric.includes('Efficiency') || trend.metric.includes('Satisfaction') ? (trend.metric.includes('Satisfaction') ? '/10' : '%') : (trend.metric.includes('Time') ? ' min' : '')}</div>
                <div className="text-xs text-gray-600">
                  Previous: {trend.previous}{trend.metric.includes('Rate') || trend.metric.includes('Efficiency') || trend.metric.includes('Satisfaction') ? (trend.metric.includes('Satisfaction') ? '/10' : '%') : (trend.metric.includes('Time') ? ' min' : '')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription>
            Intelligent analysis and recommendations based on your scheduling data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 border rounded-lg ${
                insight.type === 'success' ? 'bg-green-50 border-green-200' :
                insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  {insight.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : insight.type === 'warning' ? (
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  ) : (
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${
                      insight.type === 'success' ? 'text-green-800' :
                      insight.type === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {insight.message}
                    </p>
                    <Badge className={`mt-2 text-xs ${
                      insight.impact === 'High' ? 'bg-red-100 text-red-700' :
                      insight.impact === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {insight.impact} Impact
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Auto-booking Success Rate</span>
              <span className="font-semibold">92.3%</span>
            </div>
            <Progress value={92.3} />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">AI Prediction Accuracy</span>
              <span className="font-semibold">88.7%</span>
            </div>
            <Progress value={88.7} />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Optimization Effectiveness</span>
              <span className="font-semibold">85.4%</span>
            </div>
            <Progress value={85.4} />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Patient Preference Matching</span>
              <span className="font-semibold">91.2%</span>
            </div>
            <Progress value={91.2} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">Average Booking Time</span>
              <span className="font-semibold">2.3 minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Staff Time Saved</span>
              <span className="font-semibold">4.2 hours/day</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Revenue Impact</span>
              <span className="font-semibold text-green-600">+$12,450/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Patient Satisfaction</span>
              <span className="font-semibold">{analyticsData.patientSatisfaction}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Optimization Count</span>
              <span className="font-semibold">{analyticsData.optimizationsApplied} this month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg Utilization Gain</span>
              <span className="font-semibold text-green-600">+{analyticsData.averageUtilizationImprovement}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
