
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, BarChart3 } from "lucide-react";
import { AppointmentManager } from "@/components/schedule/AppointmentManager";
import { RealTimeCalendar } from "@/components/schedule/RealTimeCalendar";
import { EnhancedCalendarView } from "@/components/schedule/EnhancedCalendarView";
import { ScheduleAnalytics } from "@/components/schedule/ScheduleAnalytics";

const Schedule = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleTimeSlotClick = (date: Date, time: string) => {
    console.log("Time slot clicked:", date, time);
    // TODO: Open appointment booking modal
  };

  const handleAppointmentClick = (appointment: any) => {
    console.log("Appointment clicked:", appointment);
    setSelectedAppointment(appointment);
    // TODO: Open appointment details modal
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Schedule Management"
        subtitle="Manage appointments, view today's schedule, and optimize patient flow"
      >
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-700">
            <Calendar className="w-3 h-3 mr-1" />
            Live Calendar
          </Badge>
          <Badge className="bg-green-100 text-green-700">
            Real-time Updates
          </Badge>
        </div>
      </PageHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="enhanced">
            <Users className="w-4 h-4 mr-2" />
            Enhanced View
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Clock className="w-4 h-4 mr-2" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <RealTimeCalendar 
            onTimeSlotClick={handleTimeSlotClick}
            onAppointmentClick={handleAppointmentClick}
          />
        </TabsContent>

        <TabsContent value="enhanced" className="space-y-4">
          <EnhancedCalendarView />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentManager />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <ScheduleAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Schedule;
