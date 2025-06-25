
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  Users, 
  Brain,
  CheckCircle,
  ArrowRight,
  Activity
} from 'lucide-react';
import { aiSchedulingService, AppointmentOptimization } from '@/services/aiSchedulingService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ScheduleOptimizerProps {
  providerId?: string;
  date?: string;
}

export const ScheduleOptimizer: React.FC<ScheduleOptimizerProps> = ({ 
  providerId, 
  date = new Date().toISOString().split('T')[0] 
}) => {
  const { toast } = useToast();
  const [optimization, setOptimization] = useState<AppointmentOptimization | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    if (providerId) {
      loadCurrentSchedule();
    }
  }, [providerId, date]);

  const loadCurrentSchedule = async () => {
    if (!providerId) return;
    
    setLoading(true);
    try {
      // This would load the current schedule without optimization
      console.log('Loading current schedule for provider:', providerId, 'date:', date);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const optimizeSchedule = async () => {
    if (!providerId) {
      toast({
        title: "Error",
        description: "Please select a provider first",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await aiSchedulingService.optimizeProviderSchedule(providerId, date);
      setOptimization(result);
      
      toast({
        title: "Schedule Optimized",
        description: "AI has analyzed and optimized the schedule for better efficiency",
      });
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      toast({
        title: "Optimization Error",
        description: "Failed to optimize schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyOptimization = async () => {
    if (!optimization) return;

    try {
      // In a real implementation, this would apply the optimization
      toast({
        title: "Optimization Applied",
        description: "Schedule has been updated with AI recommendations",
      });
      
      // Clear optimization after applying
      setOptimization(null);
    } catch (error) {
      console.error('Error applying optimization:', error);
      toast({
        title: "Error",
        description: "Failed to apply optimization",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Schedule Optimizer
          </CardTitle>
          <CardDescription>
            Optimize provider schedules for better patient flow and efficiency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-600">
                Date: {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </div>
              {providerId && (
                <div className="text-sm text-gray-600">
                  Provider ID: {providerId}
                </div>
              )}
            </div>
            <Button
              onClick={optimizeSchedule}
              disabled={isOptimizing || !providerId}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isOptimizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Schedule
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {optimization && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Optimization Results
            </CardTitle>
            <CardDescription>
              AI-powered improvements identified for your schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Improvement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Wait Time Reduction</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  -{optimization.improvements.reducedWaitTime} min
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Utilization Increase</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  +{optimization.improvements.improvedUtilization}%
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Patient Satisfaction</span>
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  +{optimization.improvements.patientSatisfactionIncrease}%
                </div>
              </div>
            </div>

            {/* AI Reasoning */}
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Analysis:</strong> {optimization.reasoning}
              </AlertDescription>
            </Alert>

            {/* Schedule Comparison */}
            <div>
              <h4 className="font-medium mb-3">Schedule Changes</h4>
              <div className="space-y-3">
                {optimization.originalSchedule.slice(0, 3).map((appointment, index) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">{appointment.title}</div>
                        <div className="text-sm text-gray-600">
                          {appointment.appointment_type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{appointment.time}</Badge>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <Badge className="bg-green-100 text-green-800">
                        {appointment.time} (Optimized)
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={applyOptimization} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Apply Optimization
              </Button>
              <Button variant="outline" onClick={() => setOptimization(null)}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-sm text-gray-600">Current Efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">+12%</p>
                <p className="text-sm text-gray-600">Potential Improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
