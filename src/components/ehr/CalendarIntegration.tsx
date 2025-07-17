
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  Settings,
  Clock
} from "lucide-react";
import { useCalendarIntegrations } from "@/hooks/useCalendarIntegrations";
import { toast } from "sonner";

interface CalendarService {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSync: string;
  syncEnabled: boolean;
  appointmentCount: number;
}

export const CalendarIntegration = () => {
  const [syncing, setSyncing] = useState<string | null>(null);
  const {
    integrations,
    loading,
    connectCalendar,
    deleteIntegration,
    syncCalendar,
    updateIntegration,
    fetchIntegrations
  } = useCalendarIntegrations();

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  // Map integrations to calendar services format
  const calendarServices: CalendarService[] = [
    {
      id: "google",
      name: "Google Calendar",
      icon: "🗓️",
      connected: integrations.some(int => int.provider === 'google' && int.sync_enabled),
      lastSync: integrations.find(int => int.provider === 'google')?.last_sync_at || "",
      syncEnabled: integrations.find(int => int.provider === 'google')?.sync_enabled || false,
      appointmentCount: integrations.filter(int => int.provider === 'google').length
    },
    {
      id: "microsoft",
      name: "Microsoft Outlook",
      icon: "📅",
      connected: integrations.some(int => int.provider === 'microsoft' && int.sync_enabled),
      lastSync: integrations.find(int => int.provider === 'microsoft')?.last_sync_at || "",
      syncEnabled: integrations.find(int => int.provider === 'microsoft')?.sync_enabled || false,
      appointmentCount: integrations.filter(int => int.provider === 'microsoft').length
    }
  ];

  const handleConnect = async (serviceId: string) => {
    try {
      if (serviceId === 'google' || serviceId === 'microsoft') {
        await connectCalendar(serviceId);
        toast.success(`Successfully connected to ${serviceId === 'google' ? 'Google Calendar' : 'Microsoft Outlook'}`);
        // Refresh integrations after successful connection
        fetchIntegrations();
      } else {
        toast.error('This calendar provider is not yet supported');
      }
    } catch (error) {
      console.error('Failed to connect calendar:', error);
      toast.error('Failed to connect calendar. Please try again.');
    }
  };

  const handleDisconnect = async (serviceId: string) => {
    try {
      const integration = integrations.find(int => int.provider === serviceId);
      if (integration) {
        await deleteIntegration(integration.id);
        toast.success(`Disconnected from ${serviceId === 'google' ? 'Google Calendar' : 'Microsoft Outlook'}`);
      }
    } catch (error) {
      console.error('Failed to disconnect calendar:', error);
      toast.error('Failed to disconnect calendar. Please try again.');
    }
  };

  const handleSync = async (serviceId: string) => {
    try {
      setSyncing(serviceId);
      const integration = integrations.find(int => int.provider === serviceId);
      if (integration) {
        const result = await syncCalendar(integration.id);
        if (result.success) {
          toast.success(`Successfully synced ${serviceId === 'google' ? 'Google Calendar' : 'Microsoft Outlook'}`);
        } else {
          toast.error(result.error || 'Sync failed');
        }
      }
    } catch (error) {
      console.error('Failed to sync calendar:', error);
      toast.error('Failed to sync calendar. Please try again.');
    } finally {
      setSyncing(null);
    }
  };

  const toggleSync = async (serviceId: string, enabled: boolean) => {
    try {
      const integration = integrations.find(int => int.provider === serviceId);
      if (integration) {
        await updateIntegration(integration.id, { sync_enabled: enabled });
        toast.success(`Auto-sync ${enabled ? 'enabled' : 'disabled'} for ${serviceId === 'google' ? 'Google Calendar' : 'Microsoft Outlook'}`);
      }
    } catch (error) {
      console.error('Failed to toggle sync:', error);
      toast.error('Failed to update sync settings. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Calendar Integration</h3>
        <p className="text-sm text-muted-foreground">
          Sync appointments with external calendar services
        </p>
      </div>

      <div className="grid gap-4">
        {calendarServices.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{service.icon}</div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {service.name}
                      {service.connected ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Not Connected
                        </Badge>
                      )}
                    </h4>
                    {service.connected && (
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{service.appointmentCount} appointments synced</p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last sync: {new Date(service.lastSync).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {service.connected && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Auto-sync</span>
                        <Switch
                          checked={service.syncEnabled}
                          onCheckedChange={(checked) => toggleSync(service.id, checked)}
                        />
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(service.id)}
                        disabled={syncing === service.id}
                      >
                        {syncing === service.id ? (
                          <div className="animate-spin">
                            <RefreshCw className="h-4 w-4" />
                          </div>
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Sync Now
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(service.id)}
                      >
                        Disconnect
                      </Button>
                    </>
                  )}
                  
                  {!service.connected && (
                    <Button onClick={() => handleConnect(service.id)}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Sync Settings
          </CardTitle>
          <CardDescription>
            Configure how appointments are synchronized
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Two-way sync</h4>
              <p className="text-sm text-muted-foreground">
                Sync changes both ways between EHR and external calendars
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Include patient names</h4>
              <p className="text-sm text-muted-foreground">
                Include patient names in calendar events (may affect privacy)
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Real-time sync</h4>
              <p className="text-sm text-muted-foreground">
                Immediately sync changes as they happen
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
