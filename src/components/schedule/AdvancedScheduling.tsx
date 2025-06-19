
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Clock, Users, Zap, Calendar, AlertTriangle } from "lucide-react";

export const AdvancedScheduling = () => {
  const [optimizationMode, setOptimizationMode] = useState("efficiency");

  const optimizationMetrics = {
    efficiency: {
      currentScore: 94,
      suggestions: [
        "Reduce 15-minute gaps between appointments",
        "Group similar appointment types together",
        "Optimize lunch break placement"
      ]
    },
    revenue: {
      currentScore: 87,
      suggestions: [
        "Schedule high-value appointments during peak hours",
        "Fill cancellation slots with premium services",
        "Optimize provider utilization rates"
      ]
    },
    patient: {
      currentScore: 92,
      suggestions: [
        "Reduce wait times by 8 minutes average",
        "Offer preferred time slots to VIP patients",
        "Send proactive scheduling options"
      ]
    }
  };

  const aiInsights = [
    {
      type: "pattern",
      title: "Booking Pattern Detected",
      description: "Tuesday 2-4 PM shows 40% higher no-show rate",
      action: "Implement double-booking strategy",
      priority: "high"
    },
    {
      type: "optimization",
      title: "Schedule Gap Analysis",
      description: "12 minutes average gap between appointments",
      action: "Tighten scheduling by 5 minutes",
      priority: "medium"
    },
    {
      type: "prediction",
      title: "Demand Forecast",
      description: "25% increase expected next week",
      action: "Open additional evening slots",
      priority: "low"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(optimizationMetrics).map(([key, metrics]) => (
          <Card key={key} className={optimizationMode === key ? "ring-2 ring-blue-500" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm capitalize">{key} Optimization</CardTitle>
                <Button
                  variant={optimizationMode === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOptimizationMode(key)}
                >
                  {optimizationMode === key && <Zap className="w-3 h-3 mr-1" />}
                  Activate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {metrics.currentScore}%
              </div>
              <div className="space-y-1">
                {metrics.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground">
                    • {suggestion}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI-Powered Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={insight.priority === "high" ? "destructive" : 
                                 insight.priority === "medium" ? "default" : "secondary"}>
                      {insight.priority} priority
                    </Badge>
                    <span className="text-sm font-medium">{insight.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.description}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    Recommended: {insight.action}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Smart Scheduling Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Buffer time between appointments</span>
              <Badge>15 minutes</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-reschedule cancellations</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Double-booking threshold</span>
              <Badge>30% no-show rate</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Peak hour optimization</span>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Provider Load Balancing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Dr. Smith</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: "85%"}}></div>
                  </div>
                  <span className="text-xs">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dr. Johnson</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: "92%"}}></div>
                  </div>
                  <span className="text-xs">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dr. Brown</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: "78%"}}></div>
                  </div>
                  <span className="text-xs">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
