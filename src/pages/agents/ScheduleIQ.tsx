
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScheduleStats } from "@/components/schedule/ScheduleStats";
import { ScheduleAgentDashboard } from "@/components/schedule/ScheduleAgentDashboard";
import { AppointmentManager } from "@/components/schedule/AppointmentManager";
import { ProductionBookingInterface } from "@/components/schedule/ProductionBookingInterface";
import { EnhancedCalendarView } from "@/components/schedule/EnhancedCalendarView";
import { AIScheduleChat } from "@/components/schedule/AIScheduleChat";
import { ScheduleAnalytics } from "@/components/schedule/ScheduleAnalytics";
import { AutomatedReminders } from "@/components/schedule/AutomatedReminders";
import { ScheduleSettings } from "@/components/schedule/ScheduleSettings";
import { SetupWizard } from "@/components/schedule/SetupWizard";
import { Settings, Zap, Brain, BarChart3, MessageCircle, Calendar, Users, Bell } from "lucide-react";

const ScheduleIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [aiOptimizing, setAiOptimizing] = useState(false);

  const stats = {
    appointmentsToday: 24,
    bookedThisWeek: 156,
    utilizationRate: 87,
    noShowRate: 5,
    avgBookingTime: "2.3 minutes",
    automatedBookings: 89
  };

  const recentActivity = [
    { time: "2 min ago", action: "Scheduled appointment for Sarah Wilson", type: "booking" },
    { time: "5 min ago", action: "Optimized Dr. Smith's calendar for better flow", type: "optimization" },
    { time: "8 min ago", action: "Sent availability to 3 patients", type: "communication" },
    { time: "12 min ago", action: "Rescheduled conflicting appointment", type: "modification" },
    { time: "15 min ago", action: "Blocked emergency slot for urgent care", type: "emergency" }
  ];

  const upcomingTasks = [
    { task: "Process 5 rescheduling requests", priority: "high" as const, eta: "10 min" },
    { task: "Optimize tomorrow's schedule", priority: "medium" as const, eta: "30 min" },
    { task: "Send weekly availability report", priority: "low" as const, eta: "2 hours" },
    { task: "Update provider preferences", priority: "medium" as const, eta: "1 hour" }
  ];

  const handleAppointmentBooked = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab("appointments");
  };

  const handleConfigureClick = () => {
    setActiveTab("settings");
  };

  const handleAiOptimize = async () => {
    setAiOptimizing(true);
    // Simulate AI optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAiOptimizing(false);
    
    // Refresh data after optimization
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Layout>
      <PageHeader 
        title="Schedule iQ"
        subtitle="Advanced AI-powered appointment scheduling and calendar optimization agent"
      >
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Brain className="w-3 h-3 mr-1" />
            AI Active
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Production Ready
          </Badge>
          <Button variant="outline" size="sm" onClick={handleConfigureClick}>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleAiOptimize}
            disabled={aiOptimizing}
          >
            {aiOptimizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Optimize Now
              </>
            )}
          </Button>
        </div>
      </PageHeader>
      
      <div className="p-6 space-y-6">
        <ScheduleStats stats={stats} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                AI Dashboard
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="book" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Book new appointment
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reminders" className="flex items-center gap-1">
                <Bell className="w-4 h-4" />
                Reminders
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <ScheduleAgentDashboard 
              stats={stats}
              recentActivity={recentActivity}
              upcomingTasks={upcomingTasks}
            />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <AIScheduleChat />
          </TabsContent>

          <TabsContent value="book" className="space-y-4">
            <ProductionBookingInterface onAppointmentBooked={handleAppointmentBooked} />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <AppointmentManager 
              key={refreshKey}
              onAppointmentUpdate={(appointment) => {
                console.log("Appointment updated:", appointment);
              }}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <EnhancedCalendarView />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <ScheduleAnalytics />
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            <AutomatedReminders />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <ScheduleSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ScheduleIQ;
