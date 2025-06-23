
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Workflow, 
  Calendar, 
  MessageSquare, 
  Bell, 
  CreditCard, 
  FileText,
  Users,
  Activity,
  ArrowRight,
  Play,
  Settings,
  CheckCircle
} from "lucide-react";

interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  isActive: boolean;
  lastRun?: string;
  executions: number;
}

export const EHRWorkflowIntegration = () => {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([
    {
      id: "1",
      name: "New Patient Onboarding",
      trigger: "Patient Record Created",
      actions: ["Schedule Welcome Call", "Send Intake Forms", "Create Treatment Plan"],
      isActive: true,
      lastRun: "2 hours ago",
      executions: 47
    },
    {
      id: "2", 
      name: "Appointment Reminder Chain",
      trigger: "Appointment Scheduled",
      actions: ["Send 24h SMS Reminder", "Send 2h Email Reminder", "Log Communication"],
      isActive: true,
      lastRun: "15 minutes ago",
      executions: 124
    },
    {
      id: "3",
      name: "Post-Visit Follow-up",
      trigger: "SOAP Note Completed",
      actions: ["Generate Invoice", "Schedule Follow-up", "Send Care Instructions"],
      isActive: false,
      lastRun: "1 day ago",
      executions: 89
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowRule | null>(null);
  const { toast } = useToast();

  const agentIntegrations = [
    { name: "Schedule iQ", icon: Calendar, status: "connected", lastSync: "5 min ago" },
    { name: "Intake iQ", icon: FileText, status: "connected", lastSync: "12 min ago" },
    { name: "Remind iQ", icon: Bell, status: "connected", lastSync: "3 min ago" },
    { name: "Billing iQ", icon: CreditCard, status: "error", lastSync: "2 hours ago" },
    { name: "Follow-up iQ", icon: MessageSquare, status: "connected", lastSync: "8 min ago" }
  ];

  const handleToggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, isActive: !w.isActive } : w
    ));
    toast({
      title: "Workflow Updated",
      description: "Workflow status has been changed successfully.",
    });
  };

  const handleRunWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    toast({
      title: "Workflow Executed",
      description: `${workflow?.name} has been manually triggered.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            EHR Workflow Integration
          </h3>
          <p className="text-gray-600">
            Automate patient care workflows across all AI agents
          </p>
        </div>
        <Button>
          <Play className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Workflows</TabsTrigger>
          <TabsTrigger value="integrations">Agent Integrations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={workflow.isActive}
                        onCheckedChange={() => handleToggleWorkflow(workflow.id)}
                      />
                      <Badge variant={workflow.isActive ? "default" : "secondary"}>
                        {workflow.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Trigger: {workflow.trigger}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Actions</Label>
                    <div className="mt-2 space-y-2">
                      {workflow.actions.map((action, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Executions: {workflow.executions}</span>
                    <span>Last run: {workflow.lastRun}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRunWorkflow(workflow.id)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Run Now
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Agent Integrations</CardTitle>
              <CardDescription>
                Monitor and manage connections to other AI agents in your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agentIntegrations.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <agent.icon className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-gray-500">Last sync: {agent.lastSync}</p>
                      </div>
                    </div>
                    <Badge variant={agent.status === 'connected' ? 'default' : 'destructive'}>
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Templates</CardTitle>
                <CardDescription>Pre-built workflows for common scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Patient Registration to First Visit",
                  "Preventive Care Reminders",
                  "Insurance Verification Process",
                  "Treatment Plan Approval",
                  "Post-Procedure Follow-up"
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">{template}</span>
                    <Button variant="outline" size="sm">
                      Use Template
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Builder</CardTitle>
                <CardDescription>Create custom workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Workflow Name</Label>
                  <Input placeholder="Enter workflow name..." />
                </div>
                <div>
                  <Label>Trigger Event</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient_created">New Patient Created</SelectItem>
                      <SelectItem value="appointment_scheduled">Appointment Scheduled</SelectItem>
                      <SelectItem value="soap_completed">SOAP Note Completed</SelectItem>
                      <SelectItem value="payment_received">Payment Received</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Describe what this workflow does..." />
                </div>
                <Button>
                  <Play className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Settings</CardTitle>
              <CardDescription>Configure global workflow behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Automatic Workflows</Label>
                  <p className="text-sm text-gray-500">Allow workflows to run automatically based on triggers</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Workflow Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications when workflows execute</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Error Retry Attempts</Label>
                  <p className="text-sm text-gray-500">Number of times to retry failed workflow actions</p>
                </div>
                <Select defaultValue="3">
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
