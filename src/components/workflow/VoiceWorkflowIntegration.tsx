import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Phone, MessageSquare, Workflow, ArrowRight } from "lucide-react";

interface VoiceWorkflowTrigger {
  id: string;
  trigger_type: string;
  outcome_types: string[];
  workflow_id: string;
  workflow_name: string;
  is_active: boolean;
  created_at: string;
}

interface VoiceWorkflowIntegrationProps {
  onTriggerCreated?: () => void;
}

export const VoiceWorkflowIntegration = ({ onTriggerCreated }: VoiceWorkflowIntegrationProps) => {
  const { toast } = useToast();
  const [triggers, setTriggers] = useState<VoiceWorkflowTrigger[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState("");

  // Mock workflows for demo - in real implementation, these would come from your workflow system
  const mockWorkflows = [
    { id: "wf_1", name: "Qualified Lead Follow-up", description: "Automated follow-up sequence for qualified leads" },
    { id: "wf_2", name: "Appointment Booking", description: "Schedule appointment and send confirmations" },
    { id: "wf_3", name: "Not Interested Nurture", description: "Long-term nurture sequence for non-qualified leads" },
    { id: "wf_4", name: "Callback Request Handler", description: "Process callback requests and schedule follow-ups" },
  ];

  const outcomeTypes = [
    { value: "qualified", label: "Qualified Lead" },
    { value: "not_qualified", label: "Not Qualified" },
    { value: "callback_requested", label: "Callback Requested" },
    { value: "appointment_scheduled", label: "Appointment Scheduled" },
    { value: "information_only", label: "Information Only" },
  ];

  useEffect(() => {
    fetchTriggers();
  }, []);

  const fetchTriggers = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, you'd fetch from a voice_workflow_triggers table
      // For now, we'll use mock data
      const mockTriggers: VoiceWorkflowTrigger[] = [
        {
          id: "1",
          trigger_type: "voice_call_outcome",
          outcome_types: ["qualified"],
          workflow_id: "wf_1",
          workflow_name: "Qualified Lead Follow-up",
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          trigger_type: "voice_call_outcome",
          outcome_types: ["callback_requested"],
          workflow_id: "wf_4",
          workflow_name: "Callback Request Handler",
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
      
      setTriggers(mockTriggers);
    } catch (error) {
      console.error('Error fetching triggers:', error);
      toast({
        title: "Error",
        description: "Failed to load workflow triggers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTrigger = async () => {
    if (!selectedOutcome || !selectedWorkflow) {
      toast({
        title: "Error",
        description: "Please select both an outcome type and a workflow",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedWorkflowData = mockWorkflows.find(w => w.id === selectedWorkflow);
      
      const newTrigger: VoiceWorkflowTrigger = {
        id: Date.now().toString(),
        trigger_type: "voice_call_outcome",
        outcome_types: [selectedOutcome],
        workflow_id: selectedWorkflow,
        workflow_name: selectedWorkflowData?.name || "Unknown Workflow",
        is_active: true,
        created_at: new Date().toISOString()
      };

      setTriggers(prev => [...prev, newTrigger]);
      
      toast({
        title: "Success",
        description: "Voice workflow trigger created successfully",
      });

      // Reset form
      setSelectedOutcome("");
      setSelectedWorkflow("");
      
      onTriggerCreated?.();
    } catch (error) {
      console.error('Error creating trigger:', error);
      toast({
        title: "Error",
        description: "Failed to create workflow trigger",
        variant: "destructive",
      });
    }
  };

  const toggleTrigger = async (triggerId: string) => {
    try {
      setTriggers(prev => prev.map(trigger => 
        trigger.id === triggerId 
          ? { ...trigger, is_active: !trigger.is_active }
          : trigger
      ));
      
      toast({
        title: "Success",
        description: "Trigger status updated",
      });
    } catch (error) {
      console.error('Error toggling trigger:', error);
      toast({
        title: "Error",
        description: "Failed to update trigger status",
        variant: "destructive",
      });
    }
  };

  const deleteTrigger = async (triggerId: string) => {
    try {
      setTriggers(prev => prev.filter(trigger => trigger.id !== triggerId));
      
      toast({
        title: "Success",
        description: "Trigger deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting trigger:', error);
      toast({
        title: "Error",
        description: "Failed to delete trigger",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Trigger */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Create Voice-to-Workflow Trigger
          </CardTitle>
          <CardDescription>
            Automatically trigger workflows based on voice call outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Call Outcome</label>
              <Select value={selectedOutcome} onValueChange={setSelectedOutcome}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome type" />
                </SelectTrigger>
                <SelectContent>
                  {outcomeTypes.map((outcome) => (
                    <SelectItem key={outcome.value} value={outcome.value}>
                      {outcome.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Workflow</label>
              <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
                <SelectTrigger>
                  <SelectValue placeholder="Select workflow" />
                </SelectTrigger>
                <SelectContent>
                  {mockWorkflows.map((workflow) => (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={createTrigger} className="w-full">
                Create Trigger
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Triggers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-purple-600" />
            Active Voice Triggers
          </CardTitle>
          <CardDescription>
            Manage your voice call to workflow triggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading triggers...</div>
          ) : triggers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Workflow className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No triggers configured</h3>
              <p>Create your first voice-to-workflow trigger above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {triggers.map((trigger) => (
                <div
                  key={trigger.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Voice Call</span>
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    
                    <div className="flex items-center gap-2">
                      {trigger.outcome_types.map((outcome) => (
                        <Badge key={outcome} variant="outline" className="text-xs">
                          {outcome.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    
                    <div className="flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">{trigger.workflow_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={trigger.is_active ? "default" : "secondary"}
                      className={trigger.is_active ? "bg-green-100 text-green-800" : ""}
                    >
                      {trigger.is_active ? "Active" : "Inactive"}
                    </Badge>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleTrigger(trigger.id)}
                    >
                      {trigger.is_active ? "Disable" : "Enable"}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTrigger(trigger.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{triggers.filter(t => t.is_active).length}</div>
              <div className="text-sm text-muted-foreground">Active Triggers</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-muted-foreground">Workflows Triggered Today</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};