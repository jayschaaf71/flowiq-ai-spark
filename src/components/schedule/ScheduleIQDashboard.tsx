
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Calendar, Clock, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scheduleIQService } from '@/services/scheduleIQService';

interface ScheduleIQDashboardProps {
  practiceId: string;
}

export const ScheduleIQDashboard: React.FC<ScheduleIQDashboardProps> = ({ practiceId }) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [practiceId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Initialize configuration
      const configData = await scheduleIQService.initializeConfig(practiceId);
      setConfig(configData);

      // Load analytics for last 30 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const analyticsData = await scheduleIQService.getAnalytics({ start: startDate, end: endDate });
      setAnalytics(analyticsData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load Schedule iQ dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessWaitlist = async () => {
    try {
      const result = await scheduleIQService.manageWaitlist();
      toast({
        title: "Waitlist Processed",
        description: `${result.booked} appointments booked from ${result.processed} waitlist entries`,
      });
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error processing waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to process waitlist",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Schedule iQ Dashboard</h2>
            <p className="text-gray-600">AI-powered scheduling automation</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={`${config?.aiOptimizationEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            <CheckCircle className="w-3 h-3 mr-1" />
            AI Optimization: {config?.aiOptimizationEnabled ? 'ON' : 'OFF'}
          </Badge>
          <Badge className={`${config?.autoBookingEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
            <Calendar className="w-3 h-3 mr-1" />
            Auto-Booking: {config?.autoBookingEnabled ? 'ON' : 'OFF'}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Bookings</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.aiBookedAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.aiBookingRate?.toFixed(1) || 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmation Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.confirmationRate?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.confirmedAppointments || 0} confirmed
            </p>
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
              +{analytics?.averageUtilizationImprovement?.toFixed(1) || 0}% efficiency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Waitlist Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Process waitlist entries and automatically book available appointments
            </p>
            <Button onClick={handleProcessWaitlist} className="w-full">
              Process Waitlist
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Schedule Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              AI analyzes and optimizes schedules to reduce wait times and improve efficiency
            </p>
            <Button variant="outline" className="w-full">
              View Optimization History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">AI Features</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Optimization</span>
                  <Badge variant={config?.aiOptimizationEnabled ? "default" : "secondary"}>
                    {config?.aiOptimizationEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auto-Booking</span>
                  <Badge variant={config?.autoBookingEnabled ? "default" : "secondary"}>
                    {config?.autoBookingEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Waitlist</span>
                  <Badge variant={config?.waitlistEnabled ? "default" : "secondary"}>
                    {config?.waitlistEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Working Hours</h4>
              <div className="text-sm">
                <p>{config?.workingHours?.start} - {config?.workingHours?.end}</p>
                <p className="text-gray-600">
                  {config?.workingHours?.days?.length || 0} days per week
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
