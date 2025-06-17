import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Pause, 
  Settings, 
  GitBranch, 
  Clock, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit
} from "lucide-react";

export const WorkflowOrchestration = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState("patient-onboarding");

  const workflows = [
    {
      id: "patient-onboarding",
      name: "Complete Patient Onboarding",
      description: "End-to-end patient registration and intake process",
      status: "active",
      progress: 85,
      agents: ["Intake iQ", "Schedule iQ", "Remind iQ"],
      steps: 8,
      completedSteps: 7,
      avgTime: "12 minutes",
      successRate: 94,
      lastRun: "5 minutes ago"
    },
    {
      id: "appointment-management",
      name: "Appointment Lifecycle Management",
      description: "From booking to post-visit follow-up",
      status: "active",
      progress: 100,
      agents: ["Schedule iQ", "Remind iQ", "Scribe iQ"],
      steps: 6,
      completedSteps: 6,
      avgTime: "8 minutes",
      successRate: 98,
      lastRun: "2 minutes ago"
    },
    {
      id: "billing-workflow",
      name: "Insurance & Billing Processing",
      description: "Automated billing and claims management",
      status: "paused",
      progress: 0,
      agents: ["Billing iQ", "Claims iQ"],
      steps: 5,
      completedSteps: 0,
      avgTime: "15 minutes",
      successRate: 89,
      lastRun: "2 hours ago"
    },
    {
      id: "emergency-response",
      name: "Emergency Patient Response",
      description: "Rapid response workflow for urgent cases",
      status: "standby",
      progress: 0,
      agents: ["Schedule iQ", "Assist iQ", "Remind iQ"],
      steps: 4,
      completedSteps: 0,
      avgTime: "3 minutes",
      successRate: 96,
      lastRun: "Never"
    }
  ];

  const workflowSteps = {
    "patient-onboarding": [
      { name: "Initial Contact", agent: "Assist iQ", status: "completed", duration: "1 min" },
      { name: "Patient Registration", agent: "Intake iQ", status: "completed", duration: "3 min" },
      { name: "Insurance Verification", agent: "Billing iQ", status: "completed", duration: "2 min" },
      { name: "Medical History Collection", agent: "Intake iQ", status: "completed", duration: "4 min" },
      { name: "Appointment Scheduling", agent: "Schedule iQ", status: "completed", duration: "1 min" },
      { name: "Form Processing", agent: "Intake iQ", status: "completed", duration: "2 min" },
      { name: "Welcome Package Send", agent: "Remind iQ", status: "in-progress", duration: "1 min" },
      { name: "Pre-Visit Reminder", agent: "Remind iQ", status: "pending", duration: "1 min" }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "standby": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress": return <Clock className="w-4 h-4 text-blue-600" />;
      case "failed": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow);
  const steps = workflowSteps[selectedWorkflow] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Workflow Orchestration</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow List */}
        <div className="space-y-4">
          <h4 className="text-base font-medium">Active Workflows</h4>
          {workflows.map((workflow) => (
            <Card 
              key={workflow.id} 
              className={`cursor-pointer transition-colors ${
                selectedWorkflow === workflow.id ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() => setSelectedWorkflow(workflow.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-purple-600" />
                    <CardTitle className="text-sm">{workflow.name}</CardTitle>
                  </div>
                  <Switch checked={workflow.status === "active"} />
                </div>
                <CardDescription className="text-xs">
                  {workflow.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <Badge className={getStatusColor(workflow.status)}>
                    {workflow.status}
                  </Badge>
                  <span className="text-muted-foreground">
                    {workflow.completedSteps}/{workflow.steps} steps
                  </span>
                </div>
                <Progress value={workflow.progress} className="h-1" />
                <div className="text-xs text-muted-foreground">
                  Success Rate: {workflow.successRate}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflow Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedWorkflowData && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedWorkflowData.name}</CardTitle>
                      <CardDescription>{selectedWorkflowData.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        {selectedWorkflowData.status === "active" ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedWorkflowData.successRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {selectedWorkflowData.avgTime}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {selectedWorkflowData.agents.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Agents</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {selectedWorkflowData.steps}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Steps</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Assigned Agents</div>
                    <div className="flex gap-2">
                      {selectedWorkflowData.agents.map((agent) => (
                        <Badge key={agent} variant="outline" className="text-xs">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Workflow Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {getStepStatusIcon(step.status)}
                            <span className="font-medium text-sm">{step.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Handled by {step.agent} • {step.duration}
                          </div>
                        </div>
                        <Badge 
                          className={
                            step.status === "completed" ? "bg-green-100 text-green-800" :
                            step.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {step.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
