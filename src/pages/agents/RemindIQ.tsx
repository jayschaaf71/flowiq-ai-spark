
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RemindDashboard } from "@/components/remind/RemindDashboard";
import { MessageTemplates } from "@/components/remind/MessageTemplates";
import { TrendingUp } from "lucide-react";

const RemindIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <PageHeader 
        title="Remind iQ"
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
            <Card>
              <CardHeader>
                <CardTitle>Message Campaigns</CardTitle>
                <CardDescription>Manage your messaging campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Campaign management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Messages</CardTitle>
                <CardDescription>View and manage scheduled reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Schedule management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Messaging Analytics</CardTitle>
                <CardDescription>Performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RemindIQ;
