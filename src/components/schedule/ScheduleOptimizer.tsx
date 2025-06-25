
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  Users, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Brain,
  Calendar,
  Target
} from "lucide-react";
import { scheduleIQService } from "@/services/scheduleIQService";
import { format } from "date-fns";

export const ScheduleOptimizer = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimization, setOptimization] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { toast } = useToast();

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await scheduleIQService.optimizeSchedule('default-provider', selectedDate);
      setOptimization(result);
      
      toast({
        title: "Schedule Optimized",
        description: `Utilization improved by ${result.improvements.improvedUtilization}%`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize schedule at this time",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleTestOptimization = () => {
    // Mock optimization result for testing
    const mockOptimization = {
      originalSchedule: [
        { id: '1', time: '09:00', patient: 'John Doe', type: 'Consultation', duration: 60 },
        { id: '2', time: '11:00', patient: 'Jane Smith', type: 'Follow-up', duration: 30 },
        { id: '3', time: '14:00', patient: 'Bob Wilson', type: 'Procedure', duration: 90 },
      ],
      optimizedSchedule: [
        { id: '1', time: '09:00', patient: 'John Doe', type: 'Consultation', duration: 60 },
        { id: '2', time: '10:00', patient: 'Jane Smith', type: 'Follow-up', duration: 30 },
        { id: '3', time: '10:30', patient: 'Bob Wilson', type: 'Procedure', duration: 90 },
      ],
      improvements: {
        reducedWaitTime: 15,
        improvedUtilization: 23.5,
        patientSatisfactionScore: 8.7
      },
      aiRecommendations: [
        'Reduced gaps between appointments to improve flow',
        'Grouped similar appointment types for efficiency',
        'Optimized for provider preference patterns',
        'Minimized patient wait times'
      ]
    };
    setOptimization(mockOptimization);
  };

  return (
    <div className="space-y-6">
      {/* Optimizer Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            AI Schedule Optimizer
            <Badge className="bg-blue-100 text-blue-700">
              <Brain className="w-3 h-3 mr-1" />
              Real-time AI
            </Badge>
          </CardTitle>
          <CardDescription>
            Optimize provider schedules for maximum efficiency and patient satisfaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              AI analyzes appointment patterns, provider preferences, and patient flow to optimize schedules automatically.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Optimization</CardTitle>
          <CardDescription>
            Select a date and let AI optimize the schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Optimization Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button 
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="bg-blue-600 hover:bg-blue-700"
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
              <Button variant="outline" onClick={handleTestOptimization}>
                Load Test Results
              </Button>
            </div>
          </div>

          {/* Current Schedule Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-xl font-bold">12</div>
              <div className="text-sm text-gray-600">Appointments Today</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-xl font-bold">85%</div>
              <div className="text-sm text-gray-600">Current Utilization</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-xl font-bold">7.2</div>
              <div className="text-sm text-gray-600">Satisfaction Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {optimization && (
        <>
          {/* Improvements Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Optimization Results
              </CardTitle>
              <CardDescription>
                AI-powered improvements to your schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">
                    +{optimization.improvements.improvedUtilization}%
                  </div>
                  <div className="text-sm text-green-600">Utilization Gain</div>
                </div>
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">
                    -{optimization.improvements.reducedWaitTime} min
                  </div>
                  <div className="text-sm text-blue-600">Wait Time Reduced</div>
                </div>
                <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700">
                    {optimization.improvements.patientSatisfactionScore}/10
                  </div>
                  <div className="text-sm text-purple-600">Satisfaction Score</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Optimization Progress</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Schedule Efficiency</span>
                      <span>{85 + optimization.improvements.improvedUtilization}%</span>
                    </div>
                    <Progress value={85 + optimization.improvements.improvedUtilization} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Patient Flow</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Provider Satisfaction</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimization.aiRecommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-purple-800">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Comparison</CardTitle>
              <CardDescription>
                Before and after optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Original Schedule
                  </h4>
                  <div className="space-y-2">
                    {optimization.originalSchedule.map((appointment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{appointment.time}</span>
                          <span className="text-sm text-gray-600 ml-2">{appointment.patient}</span>
                        </div>
                        <Badge variant="outline">{appointment.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Optimized Schedule
                  </h4>
                  <div className="space-y-2">
                    {optimization.optimizedSchedule.map((appointment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-green-200 bg-green-50 rounded">
                        <div>
                          <span className="font-medium">{appointment.time}</span>
                          <span className="text-sm text-gray-600 ml-2">{appointment.patient}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-700">{appointment.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Apply Optimization
                </Button>
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Detailed Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
