
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Play, 
  Save, 
  Settings, 
  ArrowDown,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

interface WorkflowStep {
  id: string;
  name: string;
  agent: string;
  action: string;
  conditions?: string[];
  delay?: number;
  status: "pending" | "active" | "completed" | "failed";
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: WorkflowStep[];
  status: "draft" | "active" | "paused";
}

export const WorkflowBuilder = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Patient Onboarding",
      description: "Complete patient registration and first appointment",
      trigger: "new_patient_registration",
      status: "active",
      steps: [
        {
          id: "1",
          name: "Welcome Message",
          agent: "Assist iQ",
          action: "send_welcome_sms",
          status: "completed"
        },
        {
          id: "2",
          name: "Collect Information",
          agent: "Intake iQ",
          action: "send_intake_forms",
          delay: 5,
          status: "active"
        }
      ]
    }
  ]);

  const availableAgents = [
    "Schedule iQ",
    "Intake iQ", 
    "Remind iQ",
    "Billing iQ",
    "Claims iQ",
    "Assist iQ",
    "Scribe iQ"
  ];

  const availableActions = {
    "Schedule iQ": ["book_appointment", "reschedule", "cancel_appointment", "check_availability"],
    "Intake iQ": ["send_forms", "collect_information", "verify_insurance", "process_intake"],
    "Remind iQ": ["send_reminder", "send_confirmation", "follow_up", "send_instructions"],
    "Billing iQ": ["generate_invoice", "process_payment", "send_statement", "update_billing"],
    "Claims iQ": ["submit_claim", "check_status", "appeal_denial", "update_claim"],
    "Assist iQ": ["answer_question", "schedule_callback", "transfer_call", "send_information"],
    "Scribe iQ": ["transcribe_notes", "generate_summary", "update_records", "create_report"]
  };

  const currentWorkflow = workflows.find(w => w.id === selectedWorkflow);

  const addStep = () => {
    if (!currentWorkflow) return;
    
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      name: "New Step",
      agent: "Assist iQ",
      action: "answer_question",
      status: "pending"
    };

    setWorkflows(prev => prev.map(w => 
      w.id === selectedWorkflow 
        ? { ...w, steps: [...w.steps, newStep] }
        : w
    ));
  };

  const removeStep = (stepId: string) => {
    if (!currentWorkflow) return;
    
    setWorkflows(prev => prev.map(w => 
      w.id === selectedWorkflow 
        ? { ...w, steps: w.steps.filter(s => s.id !== stepId) }
        : w
    ));
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    if (!currentWorkflow) return;
    
    setWorkflows(prev => prev.map(w => 
      w.id === selectedWorkflow 
        ? { 
            ...w, 
            steps: w.steps.map(s => 
              s.id === stepId ? { ...s, ...updates } : s
            )
          }
        : w
    ));
  };

  const createNewWorkflow = () => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: "New Workflow",
      description: "Describe your workflow...",
      trigger: "manual",
      status: "draft",
      steps: []
    };
    
    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow.id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "active": return <Clock className="w-4 h-4 text-blue-600" />;
      case "failed": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Workflow List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Workflows</h3>
          <Button onClick={createNewWorkflow} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>
        
        <div className="space-y-2">
          {workflows.map((workflow) => (
            <Card 
              key={workflow.id}
              className={`cursor-pointer transition-colors ${
                selectedWorkflow === workflow.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedWorkflow(workflow.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{workflow.name}</h4>
                  <Badge 
                    variant={workflow.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {workflow.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{workflow.description}</p>
                <div className="text-xs text-muted-foreground">
                  {workflow.steps.length} steps
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Builder */}
      <div className="lg:col-span-3">
        {currentWorkflow ? (
          <div className="space-y-6">
            {/* Workflow Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Input 
                      value={currentWorkflow.name}
                      onChange={(e) => {
                        setWorkflows(prev => prev.map(w => 
                          w.id === selectedWorkflow 
                            ? { ...w, name: e.target.value }
                            : w
                        ));
                      }}
                      className="text-lg font-semibold border-0 p-0 h-auto"
                    />
                    <Textarea 
                      value={currentWorkflow.description}
                      onChange={(e) => {
                        setWorkflows(prev => prev.map(w => 
                          w.id === selectedWorkflow 
                            ? { ...w, description: e.target.value }
                            : w
                        ));
                      }}
                      className="text-sm text-muted-foreground border-0 p-0 resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Workflow Steps */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Workflow Steps</CardTitle>
                  <Button onClick={addStep} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentWorkflow.steps.map((step, index) => (
                  <div key={step.id}>
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        {index < currentWorkflow.steps.length - 1 && (
                          <ArrowDown className="w-4 h-4 text-gray-400 mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label htmlFor={`step-name-${step.id}`} className="text-xs">Step Name</Label>
                            <Input
                              id={`step-name-${step.id}`}
                              value={step.name}
                              onChange={(e) => updateStep(step.id, { name: e.target.value })}
                              className="h-8"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`step-agent-${step.id}`} className="text-xs">Agent</Label>
                            <Select 
                              value={step.agent} 
                              onValueChange={(value) => updateStep(step.id, { agent: value })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableAgents.map(agent => (
                                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor={`step-action-${step.id}`} className="text-xs">Action</Label>
                            <Select 
                              value={step.action} 
                              onValueChange={(value) => updateStep(step.id, { action: value })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableActions[step.agent]?.map(action => (
                                  <SelectItem key={action} value={action}>
                                    {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(step.status)}
                            <span className="text-xs text-muted-foreground capitalize">{step.status}</span>
                            {step.delay && (
                              <Badge variant="outline" className="text-xs">
                                {step.delay}min delay
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeStep(step.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {currentWorkflow.steps.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No steps added yet. Click "Add Step" to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No Workflow Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a workflow from the list or create a new one to get started.
                </p>
                <Button onClick={createNewWorkflow}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
