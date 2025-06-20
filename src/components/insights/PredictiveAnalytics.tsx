
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, AlertTriangle, TrendingUp, Users, Calendar } from "lucide-react";

export const PredictiveAnalytics = () => {
  const predictions = [
    {
      title: "Appointment No-Show Risk",
      description: "Patients likely to miss upcoming appointments",
      risk: "medium",
      accuracy: 87,
      count: 12,
      action: "Send targeted reminders",
      icon: Calendar
    },
    {
      title: "Patient Churn Prediction",
      description: "Patients at risk of discontinuing care", 
      risk: "high",
      accuracy: 92,
      count: 8,
      action: "Schedule follow-up consultation",
      icon: Users
    },
    {
      title: "Revenue Forecast",
      description: "Expected monthly revenue based on trends",
      risk: "low",
      accuracy: 89,
      amount: "$52,300",
      action: "On track to exceed target",
      icon: TrendingUp
    }
  ];

  const insights = [
    {
      category: "Scheduling Optimization",
      insight: "Tuesday 2-4 PM shows highest no-show rate (23%). Consider double-booking this slot.",
      confidence: 91,
      impact: "medium"
    },
    {
      category: "Patient Care",
      insight: "Patients with 3+ cancelled appointments have 67% higher churn risk.",
      confidence: 94,
      impact: "high"
    },
    {
      category: "Resource Planning",
      insight: "Current appointment volume suggests need for additional provider on Thursdays.",
      confidence: 88,
      impact: "medium"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Predictive Analytics
          </CardTitle>
          <CardDescription>AI-powered predictions and risk assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictions.map((prediction) => {
              const Icon = prediction.icon;
              return (
                <div key={prediction.title} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <Badge variant="outline" className={getRiskColor(prediction.risk)}>
                      {prediction.risk} risk
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="font-medium text-sm">{prediction.title}</div>
                    <div className="text-xs text-muted-foreground">{prediction.description}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy</span>
                      <span>{prediction.accuracy}%</span>
                    </div>
                    <Progress value={prediction.accuracy} />
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium">
                      {prediction.count ? `${prediction.count} patients` : prediction.amount}
                    </div>
                    <div className="text-xs text-muted-foreground">{prediction.action}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Insights</CardTitle>
          <CardDescription>Actionable recommendations based on data analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{insight.category}</Badge>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="font-medium">{insight.confidence}%</span>
                  <Badge 
                    variant={insight.impact === 'high' ? 'default' : 'secondary'}
                    className={insight.impact === 'high' ? 'bg-orange-100 text-orange-700' : ''}
                  >
                    {insight.impact} impact
                  </Badge>
                </div>
              </div>
              <p className="text-sm">{insight.insight}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
