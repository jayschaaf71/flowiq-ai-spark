
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  metric?: string;
  change?: number;
  actionable: boolean;
}

export const SmartInsightsWidget: React.FC = () => {
  const insights: Insight[] = [
    {
      id: '1',
      type: 'opportunity',
      title: 'Appointment Slot Optimization',
      description: 'You could increase revenue by 12% by optimizing Thursday afternoon slots',
      impact: 'high',
      metric: '+$2,400/month',
      actionable: true
    },
    {
      id: '2',
      type: 'warning',
      title: 'No-Show Rate Increasing',
      description: 'No-show rates have increased 15% this month, affecting 8 appointments',
      impact: 'medium',
      change: 15,
      actionable: true
    },
    {
      id: '3',
      type: 'success',
      title: 'Patient Satisfaction Up',
      description: 'Patient satisfaction scores improved by 8% after implementing AI scribing',
      impact: 'high',
      change: 8,
      actionable: false
    },
    {
      id: '4',
      type: 'trend',
      title: 'Peak Hours Identified',
      description: 'Tuesdays 10-12 PM show highest patient engagement and completion rates',
      impact: 'medium',
      actionable: true
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default: return <Brain className="w-5 h-5 text-purple-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Smart recommendations powered by practice data
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All Insights
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                      {insight.impact} impact
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {insight.metric && (
                        <span className="text-sm font-medium text-green-600">{insight.metric}</span>
                      )}
                      {insight.change && (
                        <div className="flex items-center gap-1">
                          {insight.change > 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600" />
                          )}
                          <span className={`text-xs ${insight.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(insight.change)}%
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {insight.actionable && (
                      <Button variant="ghost" size="sm" className="text-xs">
                        Take Action
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
