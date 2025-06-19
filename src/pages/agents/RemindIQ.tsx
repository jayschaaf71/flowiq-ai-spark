
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RemindDashboard } from "@/components/remind/RemindDashboard";
import { MessageTemplates } from "@/components/remind/MessageTemplates";
import { CampaignManager } from "@/components/remind/CampaignManager";
import { ScheduledMessages } from "@/components/remind/ScheduledMessages";
import { RemindAnalytics } from "@/components/remind/RemindAnalytics";

const RemindIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <PageHeader 
        title="Reminders iQ"
        subtitle="AI-powered patient reminders and messaging automation"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <RemindDashboard />
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <MessageTemplates />
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <CampaignManager />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <ScheduledMessages />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <RemindAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RemindIQ;
