
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Settings } from "lucide-react";

export const ScheduleTabsHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="book">Book Appointment</TabsTrigger>
        <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync Calendar
        </Button>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Settings className="w-4 h-4 mr-2" />
          Configure
        </Button>
      </div>
    </div>
  );
};
