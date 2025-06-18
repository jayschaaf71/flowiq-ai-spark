
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScheduleStats } from "@/components/schedule/ScheduleStats";
import { ScheduleDashboard } from "@/components/schedule/ScheduleDashboard";
import { ScheduleTabsHeader } from "@/components/schedule/ScheduleTabsHeader";
import { BookingInterface } from "@/components/schedule/BookingInterface";
import { CalendarView } from "@/components/schedule/CalendarView";
import { AppointmentsList } from "@/components/schedule/AppointmentsList";
import { TrendingUp } from "lucide-react";

const ScheduleIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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

  return (
    <Layout>
      <PageHeader 
        title="Schedule iQ"
        subtitle="AI-powered appointment scheduling and calendar optimization"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        <ScheduleStats stats={stats} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <ScheduleTabsHeader />

          <TabsContent value="dashboard" className="space-y-4">
            <ScheduleDashboard recentActivity={recentActivity} upcomingTasks={upcomingTasks} />
          </TabsContent>

          <TabsContent value="book" className="space-y-4">
            <BookingInterface />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <CalendarView />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <AppointmentsList />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Analytics</CardTitle>
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

export default ScheduleIQ;
