import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowBuilder } from "@/components/workflow/WorkflowBuilder";
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
  Edit,
  TrendingUp,
  Copy,
  Eye
} from "lucide-react";

export const WorkflowOrchestration = () => {
  const [activeTab, setActiveTab] = useState("builder");

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
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Workflow Orchestration</h3>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
          <Settings className="w-4 h-4 mr-2" />
          Configure
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <WorkflowBuilder />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-purple-600" />
                      <CardTitle className="text-sm">{workflow.name}</CardTitle>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Template</Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {workflow.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {workflow.steps} steps • {workflow.avgTime}
                    </span>
                    <span className="text-muted-foreground">
                      {workflow.successRate}% success
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Copy className="w-3 h-3 mr-1" />
                      Use Template
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
              <CardDescription>Analytics and insights for your workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                <p>Workflow analytics coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
