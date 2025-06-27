
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { enhancedAISchedulingService } from '@/services/enhancedAISchedulingService';

export const EnhancedAISchedulingAssistant: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [optimization, setOptimization] = useState<any>(null);

  const [bookingForm, setBookingForm] = useState({
    patientId: '',
    appointmentType: '',
    preferredDate: '',
    preferredTime: ''
  });

  const handlePredictSlots = async () => {
    if (!bookingForm.patientId || !bookingForm.appointmentType) {
      toast({
        title: "Missing Information",
        description: "Please provide patient ID and appointment type",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await enhancedAISchedulingService.predictOptimalSlots(
        bookingForm.patientId,
        bookingForm.appointmentType
      );
      
      setPredictions(result);
      
      toast({
        title: "AI Predictions Generated",
        description: `Found ${result.recommendedSlots.length} optimal slots with ${result.confidenceLevel} confidence`,
      });
    } catch (error) {
      console.error('Error predicting slots:', error);
      toast({
        title: "Prediction Failed",
        description: "Unable to generate AI predictions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConflictDetection = async () => {
    if (!bookingForm.preferredDate || !bookingForm.preferredTime) {
      toast({
        title: "Missing Information",
        description: "Please provide preferred date and time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await enhancedAISchedulingService.detectAdvancedConflicts({
        date: bookingForm.preferredDate,
        time: bookingForm.preferredTime
      });
      
      setConflicts(result);
      
      if (result.length === 0) {
        toast({
          title: "No Conflicts Detected",
          description: "The selected time slot is available",
        });
      } else {
        toast({
          title: "Conflicts Detected",
          description: `Found ${result.length} scheduling conflicts`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error detecting conflicts:', error);
      toast({
        title: "Detection Failed",
        description: "Unable to analyze conflicts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeSchedule = async () => {
    setLoading(true);
    try {
      const result = await enhancedAISchedulingService.optimizeScheduleWithAI(
        'default-provider',
        new Date().toISOString().split('T')[0]
      );
      
      setOptimization(result);
      
      toast({
        title: "Schedule Optimized",
        description: "AI optimization completed successfully",
      });
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-700';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold">Enhanced AI Scheduling Assistant</h2>
          <p className="text-gray-600">Advanced AI-powered scheduling with predictive analytics and conflict resolution</p>
        </div>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduling Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient ID</label>
              <Input
                value={bookingForm.patientId}
                onChange={(e) => setBookingForm({...bookingForm, patientId: e.target.value})}
                placeholder="Enter patient ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Appointment Type</label>
              <Select value={bookingForm.appointmentType} onValueChange={(value) => setBookingForm({...bookingForm, appointmentType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Date</label>
              <Input
                type="date"
                value={bookingForm.preferredDate}
                onChange={(e) => setBookingForm({...bookingForm, preferredDate: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Time</label>
              <Input
                type="time"
                value={bookingForm.preferredTime}
                onChange={(e) => setBookingForm({...bookingForm, preferredTime: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button onClick={handlePredictSlots} disabled={loading}>
              <Brain className="w-4 h-4 mr-2" />
              Predict Optimal Slots
            </Button>
            <Button onClick={handleConflictDetection} variant="outline" disabled={loading}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Detect Conflicts
            </Button>
            <Button onClick={handleOptimizeSchedule} variant="outline" disabled={loading}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Optimize Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      {predictions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              AI Slot Predictions
              <Badge className={predictions.confidenceLevel === 'high' ? 'bg-green-100 text-green-700' : 
                               predictions.confidenceLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                               'bg-red-100 text-red-700'}>
                {predictions.confidenceLevel} confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{predictions.reasoning}</p>
            
            <div className="space-y-3">
              {predictions.recommendedSlots.map((slot: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{slot.date} at {slot.time}</div>
                      <div className="text-sm text-gray-600">{slot.reasoning}</div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getConfidenceColor(slot.confidence)}>
                        {Math.round(slot.confidence * 100)}% confidence
                      </Badge>
                      <Badge variant="outline">
                        Patient Fit: {Math.round(slot.patientFitScore * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conflict Analysis */}
      {conflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Conflict Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conflicts.map((conflict, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium capitalize">{conflict.conflictType.replace('_', ' ')}</span>
                        <Badge className={getSeverityColor(conflict.severity)}>
                          {conflict.severity}
                        </Badge>
                        {conflict.autoResolvable && (
                          <Badge className="bg-blue-100 text-blue-700">Auto-resolvable</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{conflict.resolution}</p>
                      {conflict.alternativeSlots.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Alternative times: </span>
                          <span className="text-sm text-gray-600">
                            {conflict.alternativeSlots.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Optimization Results */}
      {optimization && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Schedule Optimization Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-green-600">
                  -{optimization.improvements.timeGapReduction}min
                </div>
                <div className="text-sm text-gray-600">Time Gap Reduction</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-blue-600">
                  +{optimization.improvements.patientFlowImprovement}%
                </div>
                <div className="text-sm text-gray-600">Patient Flow</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-purple-600">
                  +{optimization.improvements.providerEfficiencyGain}%
                </div>
                <div className="text-sm text-gray-600">Provider Efficiency</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">AI Insights:</h4>
              <ul className="space-y-1">
                {optimization.aiInsights.map((insight: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
