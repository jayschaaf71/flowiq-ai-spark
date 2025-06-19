
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { ClinicMetrics } from "@/components/clinic/ClinicMetrics";
import { ProviderSummary } from "@/components/clinic/ProviderSummary";
import { RecentActivity } from "@/components/clinic/RecentActivity";
import { QuickStats } from "@/components/clinic/QuickStats";
import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Layout>
      <PageHeader 
        title="Clinic Dashboard"
        subtitle="Daily operations overview and key performance indicators"
      />
      
      <div className="space-y-6">
        {/* Quick Stats Overview */}
        <QuickStats />
        
        {/* Key Performance Indicators */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
          <ClinicMetrics />
        </div>

        {/* Provider Summary and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProviderSummary />
          <RecentActivity />
        </div>
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
