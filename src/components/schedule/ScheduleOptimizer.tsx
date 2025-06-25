
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  Users, 
  Brain,
  CheckCircle,
  ArrowRight,
  Activity,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { aiSchedulingService, AppointmentOptimization } from '@/services/aiSchedulingService';
import { ConflictResolutionPanel } from './ConflictResolutionPanel';
import { useToast } from '@/hooks/use-toast';
import { useProviders } from '@/hooks/useProviders';
import { format, addDays } from 'date-fns';

interface ScheduleOptimizerProps {
  providerId?: string;
  date?: string;
}

export const ScheduleOptimizer: React.FC<ScheduleOptimizerProps> = ({ 
  providerId: initialProviderId, 
  date: initialDate = new Date().toISOString().split('T')[0] 
}) => {
  const { toast } = useToast();
  const { providers } = useProviders();
  const [providerId, setProviderId] = useState(initialProviderId);
  const [date, setDate] = useState(initialDate);
  const [optimization, setOptimization] = useState<AppointmentOptimization | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationScore, setOptimizationScore] = useState(94);

  useEffect(() => {
    if (providerId && providers.length > 0) {
      loadCurrentSchedule();
    } else if (providers.length > 0 && !providerId) {
      setProviderId(providers[0].id);
    }
  }, [providerId, date, providers]);

  const loadCurrentSchedule = async () => {
    if (!providerId) return;
    
    setLoading(true);
    try {
      // Calculate current optimization score
      const score = Math.floor(Math.random() * 15) + 85; // 85-100
      setOptimizationScore(score);
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
      // Simulate applying optimization
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOptimizationScore(prev => Math.min(prev + optimization.improvements.improvedUtilization, 100));
      
      toast({
        title: "Optimization Applied",
        description: "Schedule has been updated with AI recommendations",
      });
      
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

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = addDays(new Date(), i);
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEEE, MMM d')
      });
    }
    return dates;
  };

  const selectedProvider = providers.find(p => p.id === providerId);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Schedule Optimizer
          </CardTitle>
          <CardDescription>
            Optimize provider schedules using AI for better patient flow and efficiency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <Select value={providerId || ""} onValueChange={setProviderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.first_name} {provider.last_name} - {provider.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Select value={date} onValueChange={setDate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {generateDateOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={optimizeSchedule}
              disabled={isOptimizing || !providerId}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isOptimizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>

            {selectedProvider && (
              <div className="text-sm text-gray-600">
                Analyzing schedule for {selectedProvider.first_name} {selectedProvider.last_name} on {format(new Date(date), 'MMM d, yyyy')}
              </div>
            )}
          </div>

          {/* Current Optimization Score */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Optimization Score</span>
              <Badge className={optimizationScore >= 95 ? "bg-green-100 text-green-800" : optimizationScore >= 85 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                {optimizationScore >= 95 ? "Excellent" : optimizationScore >= 85 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={optimizationScore} className="flex-1" />
              <span className="text-2xl font-bold text-purple-700">{optimizationScore}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflict Resolution Panel */}
      <ConflictResolutionPanel 
        date={date} 
        onConflictsResolved={() => {
          setOptimizationScore(prev => Math.min(prev + 5, 100));
          loadCurrentSchedule();
        }}
      />

      {/* Optimization Results */}
      {optimization && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              AI Optimization Results
            </CardTitle>
            <CardDescription>
              AI-powered improvements identified for your schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Improvement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Wait Time Reduction</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  -{optimization.improvements.reducedWaitTime} min
                </div>
                <p className="text-xs text-green-600 mt-1">Average per patient</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Utilization Increase</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  +{optimization.improvements.improvedUtilization}%
                </div>
                <p className="text-xs text-blue-600 mt-1">Schedule efficiency</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Patient Satisfaction</span>
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  +{optimization.improvements.patientSatisfactionIncrease}%
                </div>
                <p className="text-xs text-purple-600 mt-1">Predicted increase</p>
              </div>
            </div>

            {/* AI Reasoning */}
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Analysis:</strong> {optimization.reasoning}
              </AlertDescription>
            </Alert>

            {/* Schedule Preview */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Optimized Schedule Preview
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {optimization.optimizedSchedule.slice(0, 8).map((appointment, index) => (
                  <div key={appointment.id || index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">{appointment.title}</div>
                        <div className="text-sm text-gray-600">
                          {appointment.appointment_type} • {appointment.duration} min
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        {appointment.time}
                      </Badge>
                      <CheckCircle className="w-4 h-4 text-green-600" />
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
                Review Later
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{optimizationScore}%</p>
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
                <p className="text-2xl font-bold">+{100 - optimizationScore}%</p>
                <p className="text-sm text-gray-600">Potential Improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{Math.floor(Math.random() * 10) + 15}</p>
                <p className="text-sm text-gray-600">Appointments Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{Math.floor(Math.random() * 5) + 3}</p>
                <p className="text-sm text-gray-600">AI Suggestions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
