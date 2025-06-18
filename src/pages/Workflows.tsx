import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { WorkflowCard } from "@/components/WorkflowCard";
import { CreateWorkflowDialog } from "@/components/workflow/CreateWorkflowDialog";
import { WorkflowDetailsDialog } from "@/components/workflow/WorkflowDetailsDialog";
import { WorkflowTemplatesExpanded } from "@/components/workflow/WorkflowTemplatesExpanded";
import { WorkflowExecutionEngine } from "@/components/workflow/WorkflowExecutionEngine";
import { PerformanceDashboard } from "@/components/analytics/PerformanceDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Workflows = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("workflows");
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState({});
  
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: "Patient Appointment Scheduling",
      status: "active",
      efficiency: 94,
      lastRun: "2 hours ago",
      description: "Automated scheduling with SMS confirmations"
    },
    {
      id: 2,
      name: "Insurance Verification",
      status: "optimization",
      efficiency: 87,
      lastRun: "1 day ago",
      description: "Real-time insurance eligibility checking"
    },
    {
      id: 3,
      name: "Patient Intake Forms",
      status: "active",
      efficiency: 91,
      lastRun: "30 minutes ago",
      description: "Digital intake with e-signature collection"
    },
    {
      id: 4,
      name: "Follow-up Reminders",
      status: "active",
      efficiency: 96,
      lastRun: "1 hour ago",
      description: "Automated post-visit care reminders"
    }
  ]);

  const handleCreateWorkflow = (newWorkflow) => {
    setWorkflows(prev => [...prev, newWorkflow]);
    toast({
      title: "Workflow Created",
      description: `${newWorkflow.name} has been created successfully.`,
    });
  };

  const handleWorkflowClick = (workflow) => {
    setSelectedWorkflow(workflow);
    setDetailsOpen(true);
  };

  const handleEditWorkflow = (workflow) => {
    toast({
      title: "Edit Workflow",
      description: "Opening workflow builder...",
    });
    setDetailsOpen(false);
  };

  const handleDeleteWorkflow = (workflowId) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    setDetailsOpen(false);
    toast({
      title: "Workflow Deleted",
      description: "The workflow has been permanently deleted.",
      variant: "destructive"
    });
  };

  const handleToggleStatus = (workflowId) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: w.status === "active" ? "paused" : "active" }
        : w
    ));
    const workflow = workflows.find(w => w.id === workflowId);
    toast({
      title: `Workflow ${workflow?.status === "active" ? "Paused" : "Started"}`,
      description: `${workflow?.name} is now ${workflow?.status === "active" ? "paused" : "running"}.`,
    });
  };

  const handleExecuteWorkflow = async (workflowId) => {
    setIsExecuting(prev => ({ ...prev, [workflowId]: true }));
    
    toast({
      title: "Workflow Executing",
      description: "Real-time execution started. Check the execution tab for details.",
    });

    // Simulate execution time
    setTimeout(() => {
      setIsExecuting(prev => ({ ...prev, [workflowId]: false }));
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { ...w, lastRun: "Just now", efficiency: Math.min(100, w.efficiency + Math.floor(Math.random() * 3)) }
          : w
      ));
      
      toast({
        title: "Workflow Completed",
        description: "Execution finished successfully with improved efficiency.",
      });
    }, 5000);
  };

  const handleUseTemplate = (template) => {
    const newWorkflow = {
      id: Date.now(),
      name: template.name,
      status: "draft",
      efficiency: template.successRate,
      lastRun: "Never",
      description: template.description
    };
    
    setWorkflows(prev => [...prev, newWorkflow]);
    toast({
      title: "Template Applied",
      description: `${template.name} workflow has been created from template.`,
    });
    setActiveTab("workflows");
  };

  return (
    <Layout>
      <PageHeader 
        title="Workflows"
        subtitle="Manage your automated practice workflows with AI-powered optimization"
      >
        <CreateWorkflowDialog onCreateWorkflow={handleCreateWorkflow} />
      </PageHeader>
      
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="workflows">My Workflows</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="execution">Live Execution</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <div 
                  key={workflow.id} 
                  onClick={() => handleWorkflowClick(workflow)}
                  className="relative"
                >
                  <WorkflowCard 
                    workflow={workflow} 
                    isExecuting={isExecuting[workflow.id]}
                    onExecute={() => handleExecuteWorkflow(workflow.id)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <WorkflowTemplatesExpanded onUseTemplate={handleUseTemplate} />
          </TabsContent>

          <TabsContent value="execution">
            <WorkflowExecutionEngine 
              workflowId={selectedWorkflow?.id?.toString() || "1"}
              onExecutionUpdate={(execution) => {
                console.log("Execution update:", execution);
              }}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <PerformanceDashboard />
          </TabsContent>
        </Tabs>

        <WorkflowDetailsDialog
          workflow={selectedWorkflow}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          onEdit={handleEditWorkflow}
          onDelete={handleDeleteWorkflow}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </Layout>
  );
};

export default Workflows;
