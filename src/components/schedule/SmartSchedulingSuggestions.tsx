
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Clock, Users, Zap } from "lucide-react";

interface Suggestion {
  id: string;
  type: 'optimization' | 'efficiency' | 'revenue' | 'patient-satisfaction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'moderate' | 'complex';
  estimatedImprovement: string;
  action: string;
}

interface SmartSchedulingSuggestionsProps {
  appointments: any[];
  onApplySuggestion: (suggestion: Suggestion) => void;
}

export const SmartSchedulingSuggestions = ({ 
  appointments, 
  onApplySuggestion 
}: SmartSchedulingSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = () => {
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const aiSuggestions: Suggestion[] = [
        {
          id: 'gap-optimization',
          type: 'efficiency',
          title: 'Optimize Schedule Gaps',
          description: 'Detected 12 minutes average gap between appointments. Tightening by 5 minutes would allow 2 more appointments per day.',
          impact: 'high',
          effort: 'easy',
          estimatedImprovement: '+15% capacity',
          action: 'Reduce buffer time from 15 to 10 minutes'
        },
        {
          id: 'peak-hour-optimization',
          type: 'revenue',
          title: 'Peak Hour Revenue Optimization',
          description: 'Schedule high-value procedures during 10 AM - 2 PM when patient attendance is 95% vs 78% in other slots.',
          impact: 'high',
          effort: 'moderate',
          estimatedImprovement: '+22% revenue',
          action: 'Prioritize premium services in peak hours'
        },
        {
          id: 'no-show-prediction',
          type: 'efficiency',
          title: 'No-Show Pattern Detected',
          description: 'Tuesday 2-4 PM shows 40% higher no-show rate. Double-booking strategy could improve utilization.',
          impact: 'medium',
          effort: 'moderate',
          estimatedImprovement: '+12% utilization',
          action: 'Implement selective double-booking'
        },
        {
          id: 'appointment-clustering',
          type: 'optimization',
          title: 'Appointment Type Clustering',
          description: 'Grouping similar appointment types together reduces setup time by 8 minutes per transition.',
          impact: 'medium',
          effort: 'easy',
          estimatedImprovement: '+8% efficiency',
          action: 'Cluster similar procedures in blocks'
        },
        {
          id: 'patient-preference-matching',
          type: 'patient-satisfaction',
          title: 'Patient Preference Matching',
          description: 'VIP patients prefer morning slots. 87% satisfaction vs 71% for afternoon appointments.',
          impact: 'medium',
          effort: 'easy',
          estimatedImprovement: '+20% satisfaction',
          action: 'Reserve morning slots for VIP patients'
        },
        {
          id: 'weekend-demand',
          type: 'revenue',
          title: 'Weekend Demand Analysis',
          description: 'Saturday morning shows 35% unmet demand. Adding weekend hours could capture significant revenue.',
          impact: 'high',
          effort: 'complex',
          estimatedImprovement: '+18% revenue',
          action: 'Open Saturday morning slots'
        }
      ];

      setSuggestions(aiSuggestions);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateSuggestions();
  }, [appointments]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'moderate': return 'bg-yellow-100 text-yellow-700';
      case 'complex': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'efficiency': return <Clock className="w-4 h-4" />;
      case 'revenue': return <TrendingUp className="w-4 h-4" />;
      case 'patient-satisfaction': return <Users className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI-Powered Scheduling Suggestions
            {loading && <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin ml-2" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {suggestions.map(suggestion => (
              <div key={suggestion.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(suggestion.type)}
                    <h3 className="font-semibold">{suggestion.title}</h3>
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
                    onClick={() => onApplySuggestion(suggestion)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
