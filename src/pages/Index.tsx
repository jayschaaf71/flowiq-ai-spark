
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { WorkflowCard } from "@/components/WorkflowCard";
import { AIAssistant } from "@/components/AIAssistant";
import { MetricsOverview } from "@/components/MetricsOverview";
import { QuickActions } from "@/components/QuickActions";
import { ActivityFeed } from "@/components/ActivityFeed";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const recentWorkflows = [
    {
      id: 1,
      name: "Customer Onboarding Flow",
      status: "active",
      efficiency: 94,
      lastRun: "2 hours ago",
      description: "Automated customer onboarding with AI-powered personalization"
    },
    {
      id: 2,
      name: "Lead Qualification Pipeline",
      status: "optimization",
      efficiency: 87,
      lastRun: "1 day ago",
      description: "AI-enhanced lead scoring and routing system"
    },
    {
      id: 3,
      name: "Content Review Workflow",
      status: "active",
      efficiency: 91,
      lastRun: "30 minutes ago",
      description: "Intelligent content moderation and approval process"
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Welcome back, Lauren"
        subtitle="Let's optimize your workflows with AI intelligence"
      />
      
      <div className="space-y-6">
        <MetricsOverview />
        <QuickActions />
        
        {/* Recent Workflows */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Workflows</h2>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              View all
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </div>

        <ActivityFeed />
      </div>

      {/* AI Chat Assistant */}
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
        size="icon"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      <AIAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </Layout>
  );
};

export default Index;
