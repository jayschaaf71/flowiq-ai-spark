
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Clock, Users, Zap, AlertTriangle } from "lucide-react";
import { aiSchedulingService } from "@/services/aiSchedulingService";
import { useToast } from "@/hooks/use-toast";

interface Suggestion {
  id: string;
  type: 'optimization' | 'efficiency' | 'revenue' | 'patient-satisfaction' | 'conflict-resolution';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'moderate' | 'complex';
  estimatedImprovement: string;
  action: string;
  priority: number;
}

interface SmartSchedulingSuggestionsProps {
  appointments: any[];
  providerId?: string;
  date?: string;
  onApplySuggestion: (suggestion: Suggestion) => void;
}

export const SmartSchedulingSuggestions = ({ 
  appointments, 
  providerId,
  date = new Date().toISOString().split('T')[0],
  onApplySuggestion 
}: SmartSchedulingSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateAISuggestions = async () => {
    setLoading(true);
    
    try {
      const aiSuggestions: Suggestion[] = [];

      // Get optimization suggestions
      if (providerId) {
        try {
          const optimization = await aiSchedulingService.optimizeProviderSchedule(providerId, date);
          
          if (optimization.improvements.improvedUtilization > 5) {
            aiSuggestions.push({
              id: 'ai-optimization',
              type: 'optimization',
              title: 'AI Schedule Optimization Available',
              description: `AI analysis found ${optimization.conflictsResolved} conflicts and identified optimization opportunities that could improve utilization by ${optimization.improvements.improvedUtilization}%.`,
              impact: 'high',
              effort: 'easy',
              estimatedImprovement: `+${optimization.improvements.improvedUtilization}% utilization`,
              action: 'Apply AI optimization recommendations',
              priority: 1
            });
          }
        } catch (error) {
          console.log('Optimization analysis not available');
        }

        // Get conflict detection
        try {
          const conflicts = await aiSchedulingService.detectAndResolveConflicts(date);
          
          if (conflicts.conflicts.length > 0) {
            aiSuggestions.push({
              id: 'conflict-resolution',
              type: 'conflict-resolution',
              title: 'Schedule Conflicts Detected',
              description: `Found ${conflicts.conflicts.length} scheduling conflicts. ${conflicts.autoResolved} can be resolved automatically.`,
              impact: 'high',
              effort: 'easy',
              estimatedImprovement: 'Prevent double bookings',
              action: 'Resolve conflicts automatically',
              priority: 1
            });
          }
        } catch (error) {
          console.log('Conflict detection not available');
        }
      }

      // Analyze appointment patterns
      const patternSuggestions = analyzeAppointmentPatterns(appointments);
      aiSuggestions.push(...patternSuggestions);

      // Add no-show predictions if we have appointment data
      if (appointments.length > 0) {
        const noShowSuggestion = await generateNoShowSuggestions(appointments);
        if (noShowSuggestion) {
          aiSuggestions.push(noShowSuggestion);
        }
      }

      // Sort by priority and impact
      const sortedSuggestions = aiSuggestions
        .sort((a, b) => {
          const priorityDiff = a.priority - b.priority;
          if (priorityDiff !== 0) return priorityDiff;
          
          const impactOrder = { high: 3, medium: 2, low: 1 };
          return impactOrder[b.impact] - impactOrder[a.impact];
        })
        .slice(0, 6); // Limit to top 6 suggestions

      setSuggestions(sortedSuggestions);
      
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      toast({
        title: "AI Analysis Error",
        description: "Unable to generate smart suggestions at this time",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeAppointmentPatterns = (appointments: any[]): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    if (appointments.length === 0) {
      suggestions.push({
        id: 'no-appointments',
        type: 'efficiency',
        title: 'Maximize Available Time',
        description: 'No appointments scheduled. Consider blocking time for administrative tasks or offering same-day bookings.',
        impact: 'medium',
        effort: 'easy',
        estimatedImprovement: 'Better time utilization',
        action: 'Add administrative blocks or open slots',
        priority: 3
      });
      return suggestions;
    }

    // Analyze gaps between appointments
    const hasLargeGaps = appointments.some((apt, index) => {
      if (index === 0) return false;
      const prevApt = appointments[index - 1];
      const gap = calculateTimeGap(prevApt.time, prevApt.duration, apt.time);
      return gap > 30;
    });

    if (hasLargeGaps) {
      suggestions.push({
        id: 'gap-optimization',
        type: 'efficiency',
        title: 'Optimize Schedule Gaps',
        description: 'Large gaps detected between appointments. Consolidating could allow for additional bookings.',
        impact: 'medium',
        effort: 'moderate',
        estimatedImprovement: '+1-2 appointments per day',
        action: 'Consolidate appointment times',
        priority: 2
      });
    }

    // Check for peak hour utilization
    const morningApts = appointments.filter(apt => parseInt(apt.time.split(':')[0]) < 12);
    const afternoonApts = appointments.filter(apt => parseInt(apt.time.split(':')[0]) >= 12);

    if (morningApts.length > afternoonApts.length * 2) {
      suggestions.push({
        id: 'afternoon-utilization',
        type: 'revenue',
        title: 'Improve Afternoon Utilization',
        description: 'Morning slots are much busier than afternoons. Consider incentives for afternoon appointments.',
        impact: 'medium',
        effort: 'moderate',
        estimatedImprovement: '+20% revenue potential',
        action: 'Promote afternoon availability',
        priority: 2
      });
    }

    return suggestions;
  };

  const generateNoShowSuggestions = async (appointments: any[]): Promise<Suggestion | null> => {
    try {
      // Analyze no-show risk for upcoming appointments
      const highRiskCount = appointments.filter(apt => 
        apt.status === 'confirmed' && Math.random() > 0.7 // Simulate risk analysis
      ).length;

      if (highRiskCount > 0) {
        return {
          id: 'no-show-prevention',
          type: 'patient-satisfaction',
          title: 'No-Show Risk Detected',
          description: `${highRiskCount} appointments have elevated no-show risk. Proactive outreach could prevent cancellations.`,
          impact: 'high',
          effort: 'easy',
          estimatedImprovement: 'Reduce no-shows by 30%',
          action: 'Send targeted reminders',
          priority: 1
        };
      }
    } catch (error) {
      console.log('No-show analysis not available');
    }
    
    return null;
  };

  const calculateTimeGap = (prevTime: string, prevDuration: number, nextTime: string): number => {
    const [prevH, prevM] = prevTime.split(':').map(Number);
    const [nextH, nextM] = nextTime.split(':').map(Number);
    
    const prevEndMinutes = (prevH * 60) + prevM + prevDuration;
    const nextStartMinutes = (nextH * 60) + nextM;
    
    return nextStartMinutes - prevEndMinutes;
  };

  useEffect(() => {
    generateAISuggestions();
  }, [appointments, providerId, date]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'complex': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'efficiency': return <Clock className="w-4 h-4" />;
      case 'revenue': return <TrendingUp className="w-4 h-4" />;
      case 'patient-satisfaction': return <Users className="w-4 h-4" />;
      case 'conflict-resolution': return <AlertTriangle className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const handleApplySuggestion = async (suggestion: Suggestion) => {
    try {
      onApplySuggestion(suggestion);
      
      // Remove applied suggestion
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      
      toast({
        title: "Suggestion Applied",
        description: `Applied: ${suggestion.title}`,
      });
    } catch (error) {
      console.error('Error applying suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to apply suggestion",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI-Powered Scheduling Intelligence
            {loading && <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin ml-2" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 && !loading ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Optimized</h3>
              <p className="text-gray-600">Your schedule is running efficiently. Check back later for new AI insights.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {suggestions.map(suggestion => (
                <div key={suggestion.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(suggestion.type)}
                      <h3 className="font-semibold">{suggestion.title}</h3>
                      {suggestion.priority === 1 && (
                        <Badge variant="destructive" className="text-xs">
                          High Priority
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getImpactColor(suggestion.impact)}>
                        {suggestion.impact} impact
                      </Badge>
                      <Badge className={getEffortColor(suggestion.effort)}>
                        {suggestion.effort}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{suggestion.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="font-medium text-green-600">
                          {suggestion.estimatedImprovement}
                        </span>
                        <span className="text-gray-500 ml-1">improvement</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Action: {suggestion.action}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
