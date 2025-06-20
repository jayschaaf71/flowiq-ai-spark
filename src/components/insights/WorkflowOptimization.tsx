
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Workflow, ArrowRight, Clock, Zap, CheckCircle, AlertCircle } from "lucide-react";

export const WorkflowOptimization = () => {
  const workflows = [
    {
      name: "Patient Onboarding",
      currentEfficiency: 78,
      optimizedEfficiency: 92,
      timeSaved: "12 minutes per patient",
      status: "ready",
      optimizations: [
        "Automate insurance verification",
        "Smart form pre-population",
        "Parallel appointment scheduling"
      ]
    },
    {
      name: "Claims Processing", 
      currentEfficiency: 83,
      optimizedEfficiency: 95,
      timeSaved: "8 minutes per claim",
      status: "in-progress",
      optimizations: [
        "Automated diagnosis code mapping",
        "Real-time eligibility checks",
        "Smart error detection"
      ]
    },
    {
      name: "Appointment Follow-up",
      currentEfficiency: 65,
      optimizedEfficiency: 88,
      timeSaved: "18 minutes per follow-up",
      status: "recommended",
      optimizations: [
        "Predictive outcome tracking",
        "Automated care plan updates",
        "Smart reminder sequences"
      ]
    }
  ];

  const bottlenecks = [
    {
      process: "Insurance Verification",
      impact: "high",
      avgDelay: "4.2 minutes",
      suggestion: "Implement real-time API integration",
      effort: "medium"
    },
    {
      process: "Patient Check-in",
      impact: "medium", 
      avgDelay: "2.8 minutes",
      suggestion: "Add mobile self-check-in option",
      effort: "low"
    },
    {
      process: "Documentation Review",
      impact: "medium",
      avgDelay: "6.1 minutes",
      suggestion: "AI-powered document classification",
      effort: "high"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'recommended': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
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
            <Workflow className="h-5 w-5" />
            Workflow Optimization Opportunities
          </CardTitle>
          <CardDescription>AI-identified improvements for practice workflows</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.name} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{workflow.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Potential time savings: {workflow.timeSaved}
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(workflow.status)}>
                  {workflow.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Efficiency</span>
                    <span>{workflow.currentEfficiency}%</span>
                  </div>
                  <Progress value={workflow.currentEfficiency} />
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Optimized Efficiency</span>
                    <span>{workflow.optimizedEfficiency}%</span>
                  </div>
                  <Progress value={workflow.optimizedEfficiency} className="[&>div]:bg-green-500" />
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Recommended Optimizations:</div>
                <div className="space-y-1">
                  {workflow.optimizations.map((opt, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
              
              <Button size="sm" className="w-full">
                <Zap className="h-3 w-3 mr-2" />
                Apply Optimization
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Identified Bottlenecks
          </CardTitle>
          <CardDescription>Process inefficiencies that need attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {bottlenecks.map((bottleneck, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm">{bottleneck.process}</div>
                <div className="text-xs text-muted-foreground">{bottleneck.suggestion}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">Avg delay: {bottleneck.avgDelay}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getImpactColor(bottleneck.impact)}>
                  {bottleneck.impact}
                </Badge>
                <Badge variant="outline">
                  {bottleneck.effort} effort
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
