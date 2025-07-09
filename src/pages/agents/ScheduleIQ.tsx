
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, Calendar, Zap } from "lucide-react";
import { ScheduleIQDashboard } from "@/components/schedule/ScheduleIQDashboard";
import { AISchedulingAssistant } from "@/components/schedule/AISchedulingAssistant";
import { ScheduleOptimizer } from "@/components/schedule/ScheduleOptimizer";
import { WaitlistManager } from "@/components/schedule/WaitlistManager";
import { ScheduleAnalytics } from "@/components/schedule/ScheduleAnalytics";
import { ScheduleSettingsTab } from "@/components/schedule/ScheduleSettingsTab";
import { MessageTemplates } from "@/components/remind/MessageTemplates";
import { ScheduledMessages } from "@/components/remind/ScheduledMessages";
import { RemindAutomation } from "@/components/remind/RemindAutomation";
import { RemindAnalytics } from "@/components/remind/RemindAnalytics";
import { RemindSettings } from "@/components/remind/RemindSettings";

const ScheduleIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const practiceId = "default-practice"; // In production, get from auth context

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Appointment iQ"
        subtitle="Complete appointment lifecycle management with AI-powered scheduling, reminders, and follow-up"
      >
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-700">AI Agent</Badge>
          <Badge className="bg-purple-100 text-purple-700">
            <Brain className="w-3 h-3 mr-1" />
            Auto-Booking
          </Badge>
          <Badge className="bg-green-100 text-green-700">
            <Zap className="w-3 h-3 mr-1" />
            Live Optimization
          </Badge>
        </div>
      </PageHeader>
      
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ScheduleIQDashboard practiceId={practiceId} onTabChange={setActiveTab} />
          </TabsContent>

          <TabsContent value="assistant">
            <AISchedulingAssistant />
          </TabsContent>

          <TabsContent value="optimizer">
            <ScheduleOptimizer />
          </TabsContent>

          <TabsContent value="waitlist">
            <WaitlistManager />
          </TabsContent>

          <TabsContent value="reminders">
            <ScheduledMessages />
          </TabsContent>

          <TabsContent value="templates">
            <MessageTemplates />
          </TabsContent>

          <TabsContent value="automation">
            <RemindAutomation />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <ScheduleAnalytics />
              <RemindAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <ScheduleSettingsTab />
              <RemindSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScheduleIQ;
