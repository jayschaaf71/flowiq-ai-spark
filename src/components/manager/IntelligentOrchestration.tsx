
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Zap, TrendingUp, AlertTriangle, CheckCircle, Settings } from "lucide-react";

interface OptimizationSuggestion {
  id: string;
  type: "efficiency" | "bottleneck" | "cost" | "quality";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  potentialSavings?: string;
}

interface WorkflowInsight {
  workflowId: string;
  name: string;
  currentEfficiency: number;
  predictedEfficiency: number;
  bottlenecks: string[];
  suggestions: OptimizationSuggestion[];
}

export const IntelligentOrchestration = () => {
  const [insights] = useState<WorkflowInsight[]>([
    {
      workflowId: "1",
      name: "Patient Onboarding",
      currentEfficiency: 87,
      predictedEfficiency: 94,
      bottlenecks: ["Insurance verification delay", "Form completion reminders"],
      suggestions: [
        {
          id: "1",
          type: "efficiency",
          title: "Automate Insurance Pre-verification",
          description: "Check insurance eligibility before sending intake forms",
          impact: "high",
          effort: "medium",
          potentialSavings: "45 min per patient"
        },
        {
          id: "2", 
          type: "bottleneck",
          title: "Smart Form Reminders",
          description: "Send targeted reminders based on completion status",
          impact: "medium",
          effort: "low",
          potentialSavings: "20% faster completion"
        }
      ]
    }
  ]);

  const [autoOptimizations] = useState([
    {
      id: "1",
      workflow: "Appointment Scheduling",
      optimization: "Intelligent time slot suggestions",
      status: "active",
      improvement: "+15% efficiency",
      implemented: "2 hours ago"
    },
    {
      id: "2", 
      workflow: "Follow-up Care",
      optimization: "Predictive reminder timing",
      status: "testing",
      improvement: "+8% response rate",
      implemented: "1 day ago"
    }
  ]);

  const [taskPriorities] = useState([
    {
      id: "1",
      task: "Process insurance verification for Sarah Johnson",
      priority: "high",
      assignedAgent: "Claims iQ",
      estimatedTime: "5 min",
      dependencies: ["Intake form submission"]
    },
    {
      id: "2",
      task: "Send appointment reminder to Michael Chen", 
      priority: "medium",
      assignedAgent: "Remind iQ",
      estimatedTime: "2 min",
      dependencies: []
    },
    {
      id: "3",
      task: "Generate invoice for Jennifer Davis",
      priority: "low", 
      assignedAgent: "Billing iQ",
      estimatedTime: "3 min",
      dependencies: ["Appointment completion"]
    }
  ]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700"; 
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <CardTitle>AI Orchestration Intelligence</CardTitle>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure AI
            </Button>
          </div>
          <CardDescription>
            Intelligent workflow optimization and task routing powered by AI
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="optimization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="routing">Smart Routing</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflow Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow Optimization</CardTitle>
                <CardDescription>AI-powered improvement suggestions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.workflowId} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{insight.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {insight.currentEfficiency}% → {insight.predictedEfficiency}%
                        </span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Efficiency</span>
                        <span>{insight.currentEfficiency}%</span>
                      </div>
                      <Progress value={insight.currentEfficiency} />
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Optimization Suggestions</h5>
                      {insight.suggestions.map((suggestion) => (
                        <div key={suggestion.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{suggestion.title}</div>
                            <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                          </div>
                          <div className="flex gap-1">
                            <Badge variant="outline" className={getImpactColor(suggestion.impact)}>
                              {suggestion.impact} impact
                            </Badge>
                            <Button size="sm" variant="outline">Apply</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Auto-Optimizations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Optimizations</CardTitle>
                <CardDescription>AI improvements currently running</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {autoOptimizations.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{opt.workflow}</div>
                      <div className="text-sm text-muted-foreground">{opt.optimization}</div>
                      <div className="text-xs text-muted-foreground">Implemented {opt.implemented}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={opt.status === "active" ? "default" : "secondary"}>
                        {opt.status}
                      </Badge>
                      <div className="text-sm font-medium text-green-600 mt-1">{opt.improvement}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Task Routing</CardTitle>
              <CardDescription>AI-optimized task prioritization and agent assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {taskPriorities.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{task.task}</div>
                    <div className="text-sm text-muted-foreground">
                      Assigned to {task.assignedAgent} • Est. {task.estimatedTime}
                    </div>
                    {task.dependencies.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Dependencies: {task.dependencies.join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority} priority
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Zap className="w-3 h-3 mr-1" />
                      Optimize
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Efficiency Gains</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+23%</div>
                <p className="text-xs text-muted-foreground">This month vs last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">156h</div>
                <p className="text-xs text-muted-foreground">Through AI optimization</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bottlenecks</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <p className="text-xs text-muted-foreground">Identified & resolving</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
