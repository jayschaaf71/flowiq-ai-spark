
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarView } from "@/components/schedule/CalendarView";
import { BookingInterface } from "@/components/schedule/BookingInterface";
import { AppointmentsList } from "@/components/schedule/AppointmentsList";
import { ScheduleSettings } from "@/components/schedule/ScheduleSettings";
import { Calendar, Clock, Users, Settings, Plus, Bot } from "lucide-react";

const ScheduleIQ = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  
  // Mock data for demonstration
  const todayStats = {
    totalAppointments: 12,
    confirmed: 10,
    pending: 2,
    cancelled: 0,
    noShows: 0
  };

  return (
    <Layout>
      <PageHeader 
        title="Schedule iQ"
        subtitle="AI-powered appointment scheduling automation"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                {todayStats.confirmed} confirmed, {todayStats.pending} pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{todayStats.confirmed}</div>
              <p className="text-xs text-muted-foreground">
                83% confirmation rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Users className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{todayStats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Actions</CardTitle>
              <Bot className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">15</div>
              <p className="text-xs text-muted-foreground">
                Automated today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="book">Book Appointment</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <Button onClick={() => setActiveTab("book")} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>

          <TabsContent value="calendar" className="space-y-4">
            <CalendarView />
          </TabsContent>

          <TabsContent value="book" className="space-y-4">
            <BookingInterface />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <AppointmentsList />
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
