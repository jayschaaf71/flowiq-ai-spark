
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { WorkflowCard } from "@/components/WorkflowCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Workflows = () => {
  const workflows = [
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
  ];

  return (
    <Layout>
      <PageHeader 
        title="Workflows"
        subtitle="Manage your automated practice workflows"
      >
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </PageHeader>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Workflows;
