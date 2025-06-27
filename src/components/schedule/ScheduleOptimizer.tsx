
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scheduleIQService } from '@/services/scheduleIQService';

export const ScheduleOptimizer: React.FC = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [optimization, setOptimization] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    if (!selectedProvider) {
      toast({
        title: "Provider Required",
        description: "Please select a provider to optimize",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await scheduleIQService.optimizeSchedule(selectedProvider, selectedDate);
      setOptimization(result);
      
      toast({
        title: "Schedule Optimized",
        description: `Found ${result.aiRecommendations.length} optimization opportunities`,
      });
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      toast({
        title: "Error",
        description: "Failed to optimize schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-green-600" />
        <div>
          <h2 className="text-2xl font-bold">Schedule Optimizer</h2>
          <p className="text-gray-600">AI-powered schedule optimization to maximize efficiency</p>
        </div>
      </div>

      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Provider</label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default-provider">Dr. Sarah Johnson</SelectItem>
                  <SelectItem value="provider-2">Dr. Mike Chen</SelectItem>
                  <SelectItem value="provider-3">Dr. Lisa Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleOptimize} disabled={loading} className="w-full">
                {loading ? 'Optimizing...' : 'Optimize Schedule'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {optimization && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Improvements Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Optimization Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Wait Time Reduction</span>
                    <Badge className="bg-green-100 text-green-700">
                      -{optimization.improvements.reducedWaitTime} min
                    </Badge>
                  </div>
                  <Progress value={optimization.improvements.reducedWaitTime} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Utilization Improvement</span>
                    <Badge className="bg-blue-100 text-blue-700">
                      +{optimization.improvements.improvedUtilization}%
                    </Badge>
                  </div>
                  <Progress value={optimization.improvements.improvedUtilization} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Patient Satisfaction</span>
                  <Badge className="bg-purple-100 text-purple-700">
                    +{optimization.improvements.patientSatisfactionScore}%
                  </Badge>
                </div>
                <Progress value={optimization.improvements.patientSatisfactionScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimization.aiRecommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Comparison */}
      {optimization && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Original Schedule ({optimization.originalSchedule.length} appointments)
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {optimization.originalSchedule.map((apt: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{apt.time}</span>
                      <span className="text-xs text-gray-600">{apt.title || 'Appointment'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Optimized Schedule ({optimization.optimizedSchedule.length} appointments)
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {optimization.optimizedSchedule.map((apt: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">{apt.time}</span>
                      <span className="text-xs text-green-700">{apt.title || 'Appointment'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
