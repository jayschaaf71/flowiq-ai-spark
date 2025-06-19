
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Sync,
  ExternalLink,
  Settings,
  Clock
} from "lucide-react";

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
  
  const calendarServices: CalendarService[] = [
    {
      id: "google",
      name: "Google Calendar",
      icon: "🗓️",
      connected: true,
      lastSync: "2024-01-15T10:30:00Z",
      syncEnabled: true,
      appointmentCount: 45
    },
    {
      id: "outlook",
      name: "Microsoft Outlook",
      icon: "📅",
      connected: false,
      lastSync: "",
      syncEnabled: false,
      appointmentCount: 0
    },
    {
      id: "apple",
      name: "Apple Calendar",
      icon: "🍎",
      connected: true,
      lastSync: "2024-01-14T15:20:00Z",
      syncEnabled: false,
      appointmentCount: 23
    }
  ];

  const handleConnect = (serviceId: string) => {
    console.log("Connecting to:", serviceId);
    // Implement OAuth connection logic
  };

  const handleDisconnect = (serviceId: string) => {
    console.log("Disconnecting from:", serviceId);
    // Implement disconnect logic
  };

  const handleSync = async (serviceId: string) => {
    setSyncing(serviceId);
    console.log("Syncing with:", serviceId);
    
    // Simulate sync process
    setTimeout(() => {
      setSyncing(null);
    }, 2000);
  };

  const toggleSync = (serviceId: string, enabled: boolean) => {
    console.log("Toggle sync for:", serviceId, enabled);
    // Implement sync toggle logic
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
                            <Sync className="h-4 w-4" />
                          </div>
                        ) : (
                          <Sync className="h-4 w-4" />
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
