
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowBuilder } from "@/components/workflow/WorkflowBuilder";
import { WorkflowTemplates } from "@/components/workflow/WorkflowTemplates";
import { WorkflowAnalytics } from "@/components/workflow/WorkflowAnalytics";
import { WorkflowOrchestrationHeader } from "@/components/workflow/WorkflowOrchestrationHeader";

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
      <WorkflowOrchestrationHeader />

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
          <WorkflowTemplates workflows={workflows} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <WorkflowAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
