
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Clock, Users, TrendingUp, CheckCircle, X, Lightbulb } from "lucide-react";

interface SchedulingSuggestion {
  id: string;
  type: 'optimization' | 'conflict' | 'efficiency' | 'revenue';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  action: string;
  appointmentIds?: string[];
}

interface SmartSchedulingSuggestionsProps {
  appointments: any[];
  onApplySuggestion?: (suggestion: SchedulingSuggestion) => void;
}

export const SmartSchedulingSuggestions = ({ appointments, onApplySuggestion }: SmartSchedulingSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<SchedulingSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateSuggestions();
  }, [appointments]);

  const generateSuggestions = async () => {
    setLoading(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const generatedSuggestions: SchedulingSuggestion[] = [];

    // Analyze gaps in schedule
    const gaps = findScheduleGaps(appointments);
    if (gaps.length > 0) {
      generatedSuggestions.push({
        id: 'gap-optimization',
        type: 'efficiency',
        priority: 'medium',
        title: 'Schedule Gap Optimization',
        description: `Found ${gaps.length} schedule gaps that could be optimized`,
        impact: 'Reduce idle time by 45 minutes',
        action: 'Consolidate appointments to minimize gaps'
      });
    }

    // Check for back-to-back conflicts
    const conflicts = findBackToBackConflicts(appointments);
    if (conflicts.length > 0) {
      generatedSuggestions.push({
        id: 'conflict-resolution',
        type: 'conflict',
        priority: 'high',
        title: 'Scheduling Conflicts Detected',
        description: `${conflicts.length} appointments may have insufficient buffer time`,
        impact: 'Prevent delays and improve patient satisfaction',
        action: 'Add 15-minute buffer between appointments',
        appointmentIds: conflicts
      });
    }

    // Suggest revenue optimization
    const lowRevenueSlots = findLowRevenueOpportunities(appointments);
    if (lowRevenueSlots.length > 0) {
      generatedSuggestions.push({
        id: 'revenue-optimization',
        type: 'revenue',
        priority: 'medium',
        title: 'Revenue Optimization Opportunity',
        description: 'Premium time slots available for higher-value appointments',
        impact: 'Potential revenue increase of $450/week',
        action: 'Move routine appointments to create premium slots'
      });
    }

    // Check for no-show risk
    const noShowRisk = identifyNoShowRisk(appointments);
    if (noShowRisk.length > 0) {
      generatedSuggestions.push({
        id: 'noshow-prevention',
        type: 'optimization',
        priority: 'high',
        title: 'No-Show Risk Prevention',
        description: `${noShowRisk.length} appointments have high no-show probability`,
        impact: 'Reduce no-show rate by 25%',
        action: 'Send additional reminders and confirmations',
        appointmentIds: noShowRisk
      });
    }

    setSuggestions(generatedSuggestions);
    setLoading(false);
  };

  const findScheduleGaps = (appointments: any[]) => {
    // Simple gap detection logic
    return appointments.filter((_, index) => {
      if (index === 0) return false;
      const current = new Date(`${appointments[index].date}T${appointments[index].time}`);
      const previous = new Date(`${appointments[index - 1].date}T${appointments[index - 1].time}`);
      const gap = (current.getTime() - previous.getTime()) / (1000 * 60); // minutes
      return gap > 60; // gaps longer than 60 minutes
    });
  };

  const findBackToBackConflicts = (appointments: any[]) => {
    const conflicts: string[] = [];
    for (let i = 0; i < appointments.length - 1; i++) {
      const current = appointments[i];
      const next = appointments[i + 1];
      
      const currentEnd = new Date(`${current.date}T${current.time}`);
      currentEnd.setMinutes(currentEnd.getMinutes() + (current.duration || 60));
      
      const nextStart = new Date(`${next.date}T${next.time}`);
      
      if (nextStart.getTime() - currentEnd.getTime() < 15 * 60 * 1000) { // less than 15 min buffer
        conflicts.push(current.id, next.id);
      }
    }
    return [...new Set(conflicts)]; // Remove duplicates
  };

  const findLowRevenueOpportunities = (appointments: any[]) => {
    // Mock logic for identifying premium time slots
    return appointments.filter(apt => {
      const time = apt.time;
      return time >= '10:00' && time <= '14:00'; // Premium hours
    }).slice(0, 3); // Limit suggestions
  };

  const identifyNoShowRisk = (appointments: any[]) => {
    // Mock no-show risk analysis
    return appointments.filter(apt => {
      // Simple heuristic: appointments more than 7 days out or on Mondays
      const appointmentDate = new Date(apt.date);
      const daysDiff = (appointmentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff > 7 || appointmentDate.getDay() === 1;
    }).slice(0, 2);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="w-4 h-4" />;
      case 'conflict': return <Clock className="w-4 h-4" />;
      case 'efficiency': return <Brain className="w-4 h-4" />;
      case 'revenue': return <Users className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const handleApplySuggestion = (suggestion: SchedulingSuggestion) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    }
    
    // Remove the applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
            <span>Analyzing schedule for optimization opportunities...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Alert>
        <CheckCircle className="w-4 h-4" />
        <AlertDescription>
          Your schedule is well optimized! No suggestions at this time.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">AI Scheduling Suggestions</h3>
        <Badge variant="secondary">{suggestions.length} suggestions</Badge>
      </div>

      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  {getTypeIcon(suggestion.type)}
                </div>
                <div>
                  <CardTitle className="text-base">{suggestion.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority} priority
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {suggestion.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismissSuggestion(suggestion.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-600 mb-3">{suggestion.description}</p>
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium text-green-800">Expected Impact:</p>
              <p className="text-sm text-green-700">{suggestion.impact}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <strong>Recommended Action:</strong> {suggestion.action}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDismissSuggestion(suggestion.id)}
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Apply Suggestion
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
