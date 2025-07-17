
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Settings } from "lucide-react";
import { CalendarIntegrationDialog } from "@/components/calendar/CalendarIntegrationDialog";
import { useCalendarIntegrations } from "@/hooks/useCalendarIntegrations";
import { toast } from "sonner";

export const ScheduleTabsHeader = () => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const { syncAllCalendars, integrations, syncing } = useCalendarIntegrations();

  const handleSyncCalendar = async () => {
    if (integrations.length === 0) {
      toast.info('No calendar integrations configured. Click Configure to set up.');
      setConfigDialogOpen(true);
      return;
    }

    try {
      const results = await syncAllCalendars();
      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;
      
      if (successCount === totalCount) {
        toast.success(`All ${totalCount} calendar(s) synced successfully!`);
      } else {
        toast.warning(`${successCount} out of ${totalCount} calendars synced successfully.`);
      }
    } catch (error) {
      toast.error('Failed to sync calendars');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="book">Book Appointment</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSyncCalendar}
            disabled={!!syncing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Calendar'}
          </Button>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setConfigDialogOpen(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>
      
      <CalendarIntegrationDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
      />
    </>
  );
};
