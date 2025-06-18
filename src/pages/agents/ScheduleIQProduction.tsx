
import { useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScheduleStats } from "@/components/schedule/ScheduleStats";
import { AppointmentManager } from "@/components/schedule/AppointmentManager";
import { ProductionBookingInterface } from "@/components/schedule/ProductionBookingInterface";
import { CalendarView } from "@/components/schedule/CalendarView";
import { AutomatedReminders } from "@/components/schedule/AutomatedReminders";
import { Settings, Zap, Users, Calendar } from "lucide-react";

const ScheduleIQProduction = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);

  const stats = {
    appointmentsToday: 24,
    bookedThisWeek: 156,
    utilizationRate: 87,
    noShowRate: 5,
    avgBookingTime: "2.3 minutes",
    automatedBookings: 89
  };

  const handleAppointmentBooked = useCallback(() => {
    // Refresh the appointment manager when a new appointment is booked
    setRefreshKey(prev => prev + 1);
    // Switch to dashboard to show the new appointment
    setActiveTab("dashboard");
  }, []);

  return (
    <Layout>
      <PageHeader 
        title="Schedule iQ Production"
        subtitle="Production-ready AI scheduling agent with full automation"
      >
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700">Production Ready</Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      </PageHeader>
      
      <div className="p-6 space-y-6">
        <ScheduleStats stats={stats} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="dashboard">
                <Users className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="book">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="reminders">Auto Reminders</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <AppointmentManager 
              key={refreshKey}
              onAppointmentUpdate={(appointment) => {
                console.log("Appointment updated:", appointment);
              }}
            />
          </TabsContent>

          <TabsContent value="book" className="space-y-4">
            <ProductionBookingInterface onAppointmentBooked={handleAppointmentBooked} />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <CalendarView />
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            <AutomatedReminders />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ScheduleIQProduction;
