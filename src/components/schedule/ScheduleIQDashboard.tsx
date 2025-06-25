
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Zap,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react';
import { scheduleIQService } from '@/services/scheduleIQService';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';

interface ScheduleIQDashboardProps {
  practiceId: string;
}

export const ScheduleIQDashboard: React.FC<ScheduleIQDashboardProps> = ({ practiceId }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
    initializeScheduleIQ();
  }, [practiceId]);

  const initializeScheduleIQ = async () => {
    try {
      await scheduleIQService.initializeConfig(practiceId);
      toast({
        title: "Schedule iQ Ready",
        description: "AI-powered scheduling is now active",
      });
    } catch (error) {
      console.error('Error initializing Schedule iQ:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize Schedule iQ",
        variant: "destructive"
      });
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const dateRange = {
        start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
      };
      
      const data = await scheduleIQService.getAnalytics(dateRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Analytics Error",
        description: "Failed to load Schedule iQ analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runOptimization = async () => {
    try {
      setOptimizing(true);
      
      // Run optimization for today's schedule
      const today = format(new Date(), 'yyyy-MM-dd');
      const optimization = await scheduleIQService.optimizeSchedule('default-provider', today);
      
      toast({
        title: "Schedule Optimized",
        description: `Utilization improved by ${optimization.improvements.improvedUtilization}%`,
      });
      
      await loadAnalytics();
    } catch (error) {
      console.error('Error running optimization:', error);
      toast({
        title: "Optimization Error",
        description: "Failed to optimize schedule",
        variant: "destructive"
      });
    } finally {
      setOptimizing(false);
    }
  };

  const processWaitlist = async () => {
    try {
      const result = await scheduleIQService.manageWaitlist();
      setWaitlistStatus(result);
      
      toast({
        title: "Waitlist Processed",
        description: `${result.booked} appointments booked from waitlist`,
      });
    } catch (error) {
      console.error('Error processing waitlist:', error);
      toast({
        title: "Waitlist Error",
        description: "Failed to process waitlist",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold">Schedule iQ Dashboard</h1>
            <p className="text-gray-600">AI-powered scheduling intelligence</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadAnalytics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={runOptimization} disabled={optimizing}>
            {optimizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Optimize Now
              </>
            )}
          </Button>
        </div>
      </div>

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
            <div className="text-2xl font-bold">{analytics?.totalAppointments || 0}</div>
            <p className="text-sm text-gray-600">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Auto-Booked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analytics?.aiBookedAppointments || 0}</div>
            <p className="text-sm text-gray-600">{analytics?.aiBookingRate?.toFixed(1) || 0}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Confirmation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics?.confirmationRate?.toFixed(1) || 0}%</div>
            <Progress value={analytics?.confirmationRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Optimizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics?.optimizationsApplied || 0}</div>
            <p className="text-sm text-gray-600">
              Avg {analytics?.averageUtilizationImprovement?.toFixed(1) || 0}% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Status Alert */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          Schedule iQ is actively learning from your appointment patterns and optimizing bookings in real-time. 
          AI confidence: <Badge className="ml-1 bg-green-100 text-green-700">High</Badge>
        </AlertDescription>
      </Alert>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Booking Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto-booking Success Rate</span>
                  <span className="font-semibold">{analytics?.aiBookingRate?.toFixed(1) || 0}%</span>
                </div>
                <Progress value={analytics?.aiBookingRate || 0} />
                
                <div className="flex items-center justify-between">
                  <span>Patient Satisfaction</span>
                  <span className="font-semibold">94.2%</span>
                </div>
                <Progress value={94.2} />
                
                <div className="flex items-center justify-between">
                  <span>Schedule Efficiency</span>
                  <span className="font-semibold">87.5%</span>
                </div>
                <Progress value={87.5} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent AI Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Auto-booked appointment</p>
                      <p className="text-xs text-gray-600">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Optimized schedule</p>
                      <p className="text-xs text-gray-600">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-purple-50 rounded">
                    <Users className="w-4 h-4 text-purple-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Processed waitlist</p>
                      <p className="text-xs text-gray-600">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">AI Schedule Optimizer</h3>
                  <p className="text-sm text-gray-600">Automatically optimize provider schedules for maximum efficiency</p>
                </div>
                <Button onClick={runOptimization} disabled={optimizing}>
                  {optimizing ? 'Running...' : 'Run Optimization'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-xl font-bold">15.2%</div>
                  <div className="text-sm text-gray-600">Avg Utilization Gain</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold">12 min</div>
                  <div className="text-sm text-gray-600">Reduced Wait Time</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-xl font-bold">98.1%</div>
                  <div className="text-sm text-gray-600">Optimization Success</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waitlist">
          <Card>
            <CardHeader>
              <CardTitle>Smart Waitlist Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">AI Waitlist Processor</h3>
                  <p className="text-sm text-gray-600">Automatically book patients from waitlist when slots become available</p>
                </div>
                <Button onClick={processWaitlist}>
                  Process Waitlist
                </Button>
              </div>
              
              {waitlistStatus && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl font-bold">{waitlistStatus.processed}</div>
                    <div className="text-sm text-gray-600">Processed</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-xl font-bold">{waitlistStatus.booked}</div>
                    <div className="text-sm text-gray-600">Booked</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-xl font-bold">{waitlistStatus.pending}</div>
                    <div className="text-sm text-gray-600">Still Pending</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-gray-500">
                  <BarChart3 className="w-12 h-12" />
                  <span className="ml-2">Chart visualization would be here</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Average Booking Time</span>
                  <span className="font-semibold">2.3 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>No-Show Rate</span>
                  <span className="font-semibold">4.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cancellation Rate</span>
                  <span className="font-semibold">8.1%</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Prediction Accuracy</span>
                  <span className="font-semibold">92.5%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
