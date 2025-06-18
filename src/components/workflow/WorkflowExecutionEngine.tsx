
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, Play, Pause } from "lucide-react";

interface ExecutionStep {
  id: string;
  name: string;
  agent: string;
  status: "pending" | "running" | "completed" | "failed";
  startTime?: Date;
  endTime?: Date;
  data?: any;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: "running" | "completed" | "failed" | "paused";
  progress: number;
  steps: ExecutionStep[];
  startTime: Date;
  endTime?: Date;
}

interface WorkflowExecutionEngineProps {
  workflowId: string;
  onExecutionUpdate?: (execution: WorkflowExecution) => void;
}

export const WorkflowExecutionEngine = ({ workflowId, onExecutionUpdate }: WorkflowExecutionEngineProps) => {
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const mockWorkflowSteps = [
    { id: "1", name: "Send Welcome Message", agent: "Assist iQ" },
    { id: "2", name: "Collect Patient Info", agent: "Intake iQ" },
    { id: "3", name: "Schedule Appointment", agent: "Schedule iQ" },
    { id: "4", name: "Send Confirmation", agent: "Remind iQ" }
  ];

  const startExecution = async () => {
    setIsExecuting(true);
    const newExecution: WorkflowExecution = {
      id: Date.now().toString(),
      workflowId,
      status: "running",
      progress: 0,
      steps: mockWorkflowSteps.map(step => ({ ...step, status: "pending" })),
      startTime: new Date()
    };
    
    setExecution(newExecution);
    
    // Simulate step execution
    for (let i = 0; i < mockWorkflowSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setExecution(prev => {
        if (!prev) return null;
        const updatedSteps = [...prev.steps];
        updatedSteps[i] = { 
          ...updatedSteps[i], 
          status: "running",
          startTime: new Date()
        };
        const updated = { ...prev, steps: updatedSteps, progress: ((i + 0.5) / mockWorkflowSteps.length) * 100 };
        onExecutionUpdate?.(updated);
        return updated;
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setExecution(prev => {
        if (!prev) return null;
        const updatedSteps = [...prev.steps];
        updatedSteps[i] = { 
          ...updatedSteps[i], 
          status: "completed",
          endTime: new Date()
        };
        const isComplete = i === mockWorkflowSteps.length - 1;
        const updated = { 
          ...prev, 
          steps: updatedSteps, 
          progress: ((i + 1) / mockWorkflowSteps.length) * 100,
          status: isComplete ? "completed" : "running",
          endTime: isComplete ? new Date() : undefined
        };
        onExecutionUpdate?.(updated);
        return updated;
      });
    }
    
    setIsExecuting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "running": return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case "failed": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Workflow Execution</CardTitle>
            <CardDescription>Real-time workflow execution tracking</CardDescription>
          </div>
          {!isExecuting && !execution && (
            <Button onClick={startExecution} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Execute Workflow
            </Button>
          )}
          {execution && (
            <Badge variant={execution.status === "completed" ? "default" : "secondary"}>
              {execution.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {execution && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(execution.progress)}%</span>
              </div>
              <Progress value={execution.progress} />
            </div>
            
            <div className="space-y-3">
              {execution.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  {getStatusIcon(step.status)}
                  <div className="flex-1">
                    <div className="font-medium">{step.name}</div>
                    <div className="text-sm text-muted-foreground">{step.agent}</div>
                  </div>
                  {step.startTime && (
                    <div className="text-xs text-muted-foreground">
                      {step.startTime.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        
        {!execution && !isExecuting && (
          <div className="text-center py-8 text-muted-foreground">
            <Play className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Click "Execute Workflow" to start real-time execution tracking</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
