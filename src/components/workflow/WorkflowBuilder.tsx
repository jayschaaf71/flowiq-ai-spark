
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowExecutionEngine } from "./WorkflowExecutionEngine";
import { DragDropWorkflowBuilder } from "./DragDropWorkflowBuilder";
import { CrossAgentDataFlow } from "./CrossAgentDataFlow";
import { VoiceCallDashboard } from "../voice/VoiceCallDashboard";
import { Play, Settings, Brain } from "lucide-react";

export const WorkflowBuilder = () => {
  const [activeTab, setActiveTab] = useState("builder");
  const [selectedWorkflowId, setSelectedWorkflowId] = useState("1");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Advanced Workflow Builder
              </CardTitle>
              <CardDescription>
                Build, test, and optimize your AI-powered workflows with real-time execution
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Execute
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="builder">Visual Builder</TabsTrigger>
          <TabsTrigger value="execution">Live Execution</TabsTrigger>
          <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
          <TabsTrigger value="voice">Voice Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <DragDropWorkflowBuilder />
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          <WorkflowExecutionEngine 
            workflowId={selectedWorkflowId}
            onExecutionUpdate={(execution) => {
              console.log("Workflow execution update:", execution);
            }}
          />
        </TabsContent>

        <TabsContent value="dataflow" className="space-y-4">
          <CrossAgentDataFlow />
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <VoiceCallDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
