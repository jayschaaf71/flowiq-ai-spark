import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Zap,
  Settings,
  CheckCircle,
  AlertTriangle,
  Target
} from "lucide-react";

export const AIScheduleOptimizer = () => {
  const [optimizationEnabled, setOptimizationEnabled] = useState(true);
  const [gapFillEnabled, setGapFillEnabled] = useState(true);
  const [predictiveBooking, setPredictiveBooking] = useState(false);

  const optimizationMetrics = {
    utilizationRate: 87,
    avgGapSize: 23,
    revenueIncrease: 12,
    efficiencyScore: 94
  };

  const scheduleSuggestions = [
    {
      id: 1,
      type: "gap_fill",
      priority: "high",
      suggestion: "Schedule follow-up appointment for Lisa Williams",
      timeSlot: "Today 2:30 PM - 3:00 PM",
      revenue: 180,
      confidence: 92
    },
    {
      id: 2,
      type: "optimization",
      priority: "medium", 
      suggestion: "Move John Smith's consultation to maximize efficiency",
      timeSlot: "Tomorrow 10:00 AM - 11:00 AM",
      revenue: 240,
      confidence: 78
    },
    {
      id: 3,
      type: "predictive",
      priority: "low",
      suggestion: "Block time for likely emergency consultation",
      timeSlot: "Friday 3:00 PM - 4:00 PM",
      revenue: 200,
      confidence: 65
    }
  ];

  const optimizationRules = [
    { name: "Fill 30-minute gaps", enabled: true, impact: "High" },
    { name: "Batch similar procedures", enabled: true, impact: "Medium" },
    { name: "Minimize provider transitions", enabled: false, impact: "Medium" },
    { name: "Optimize travel time", enabled: true, impact: "Low" }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-700">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-700">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "gap_fill":
        return <Target className="w-4 h-4 text-green-600" />;
      case "optimization":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "predictive":
        return <Brain className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Optimizer Status */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-purple-900 mb-2">AI Schedule Optimizer</h2>
              <p className="text-purple-700">
                Intelligent gap-filling and schedule optimization powered by machine learning
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-900">{optimizationMetrics.efficiencyScore}%</div>
              <div className="text-sm text-purple-600">Efficiency Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Optimization Settings
          </CardTitle>
          <CardDescription>
            Configure AI-powered scheduling automation and optimization rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="optimization" className="text-base font-medium">Schedule Optimization</Label>
                <p className="text-sm text-gray-600">Automatically optimize appointment scheduling for maximum efficiency</p>
              </div>
              <Switch
                id="optimization"
                checked={optimizationEnabled}
                onCheckedChange={setOptimizationEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="gapfill" className="text-base font-medium">Intelligent Gap Filling</Label>
                <p className="text-sm text-gray-600">Fill schedule gaps with appropriate appointments automatically</p>
              </div>
              <Switch
                id="gapfill"
                checked={gapFillEnabled}
                onCheckedChange={setGapFillEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="predictive" className="text-base font-medium">Predictive Booking</Label>
                <p className="text-sm text-gray-600">Reserve time slots based on predicted demand patterns</p>
              </div>
              <Switch
                id="predictive"
                checked={predictiveBooking}
                onCheckedChange={setPredictiveBooking}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                <p className="text-2xl font-bold">{optimizationMetrics.utilizationRate}%</p>
                <p className="text-xs text-green-600">+5% vs last month</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Gap Size</p>
                <p className="text-2xl font-bold">{optimizationMetrics.avgGapSize}min</p>
                <p className="text-xs text-green-600">-8min improvement</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Increase</p>
                <p className="text-2xl font-bold">+{optimizationMetrics.revenueIncrease}%</p>
                <p className="text-xs text-green-600">AI optimization</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auto-Filled Slots</p>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-blue-600">this week</p>
              </div>
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Scheduling Suggestions
          </CardTitle>
          <CardDescription>
            Smart recommendations to optimize your schedule and increase revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {getSuggestionIcon(suggestion.type)}
                    <div>
                      <div className="font-medium">{suggestion.suggestion}</div>
                      <div className="text-sm text-gray-600">{suggestion.timeSlot}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPriorityBadge(suggestion.priority)}
                    <div className="text-right text-sm">
                      <div className="font-medium text-green-600">+${suggestion.revenue}</div>
                      <div className="text-gray-600">{suggestion.confidence}% confidence</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>AI Confidence</span>
                    <span>{suggestion.confidence}%</span>
                  </div>
                  <Progress value={suggestion.confidence} className="h-1" />
                </div>

                <div className="flex gap-2">
                  <Button size="sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Apply Suggestion
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Optimization Rules
          </CardTitle>
          <CardDescription>
            Configure specific rules for AI schedule optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationRules.map((rule, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{rule.name}</div>
                  <div className="text-sm text-gray-600">Impact: {rule.impact}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={rule.enabled ? "default" : "secondary"}>
                    {rule.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch checked={rule.enabled} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};