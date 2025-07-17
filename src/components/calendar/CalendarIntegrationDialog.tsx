import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Settings, Trash2, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface CalendarIntegration {
  id: string;
  provider: string;
  provider_account_id: string;
  calendar_name: string;
  is_primary: boolean;
  sync_enabled: boolean;
  sync_direction: string;
  last_sync_at: string | null;
  created_at: string;
}

interface CalendarIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CalendarIntegrationDialog = ({ open, onOpenChange }: CalendarIntegrationDialogProps) => {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchIntegrations();
    }
  }, [open]);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast.error('Failed to load calendar integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      // This would normally redirect to Google OAuth
      // For now, we'll simulate the connection
      toast.info('Google Calendar integration coming soon!');
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast.error('Failed to connect to Google Calendar');
    }
  };

  const handleConnectOutlook = async () => {
    try {
      // This would normally redirect to Microsoft OAuth
      // For now, we'll simulate the connection
      toast.info('Outlook Calendar integration coming soon!');
    } catch (error) {
      console.error('Error connecting to Outlook Calendar:', error);
      toast.error('Failed to connect to Outlook Calendar');
    }
  };

  const handleUpdateIntegration = async (integrationId: string, updates: Partial<CalendarIntegration>) => {
    try {
      const { error } = await supabase
        .from('calendar_integrations')
        .update(updates)
        .eq('id', integrationId);

      if (error) throw error;
      
      await fetchIntegrations();
      toast.success('Integration settings updated');
    } catch (error) {
      console.error('Error updating integration:', error);
      toast.error('Failed to update integration settings');
    }
  };

  const handleDeleteIntegration = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('calendar_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;
      
      await fetchIntegrations();
      toast.success('Calendar integration removed');
    } catch (error) {
      console.error('Error deleting integration:', error);
      toast.error('Failed to remove calendar integration');
    }
  };

  const handleManualSync = async (integrationId: string) => {
    try {
      // Call the sync edge function
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId })
      });

      if (!response.ok) throw new Error('Sync failed');
      
      await fetchIntegrations();
      toast.success('Calendar sync completed');
    } catch (error) {
      console.error('Error syncing calendar:', error);
      toast.error('Failed to sync calendar');
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return '🟢';
      case 'outlook':
        return '🔵';
      case 'apple':
        return '⚪';
      default:
        return '📅';
    }
  };

  const getStatusBadge = (integration: CalendarIntegration) => {
    if (!integration.sync_enabled) {
      return <Badge variant="secondary">Disabled</Badge>;
    }
    
    if (integration.last_sync_at) {
      const lastSync = new Date(integration.last_sync_at);
      const now = new Date();
      const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceSync < 1) {
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Synced</Badge>;
      } else if (hoursSinceSync < 24) {
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Recent</Badge>;
      } else {
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Stale</Badge>;
      }
    }
    
    return <Badge variant="outline">Not synced</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendar Integrations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Connect New Calendar Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect Calendar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleConnectGoogle}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    🟢 Google Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Sync with Google Calendar for seamless scheduling
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleConnectOutlook}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    🔵 Outlook Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Connect with Microsoft Outlook Calendar
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="opacity-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    ⚪ Apple Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Coming soon
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Connected Calendars Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connected Calendars</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Loading integrations...
              </div>
            ) : integrations.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No calendar integrations connected yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect a calendar above to start syncing your appointments.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getProviderIcon(integration.provider)}</span>
                          <div>
                            <CardTitle className="text-base capitalize">
                              {integration.provider} Calendar
                            </CardTitle>
                            <CardDescription>
                              {integration.calendar_name}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(integration)}
                          {integration.is_primary && (
                            <Badge variant="outline">Primary</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`sync-${integration.id}`}>Sync enabled</Label>
                          <Switch
                            id={`sync-${integration.id}`}
                            checked={integration.sync_enabled}
                            onCheckedChange={(checked) =>
                              handleUpdateIntegration(integration.id, { sync_enabled: checked })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Sync direction</Label>
                          <Select
                            value={integration.sync_direction}
                            onValueChange={(value) =>
                              handleUpdateIntegration(integration.id, { sync_direction: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bidirectional">Two-way sync</SelectItem>
                              <SelectItem value="import_only">Import only</SelectItem>
                              <SelectItem value="export_only">Export only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor={`primary-${integration.id}`}>Primary calendar</Label>
                          <Switch
                            id={`primary-${integration.id}`}
                            checked={integration.is_primary}
                            onCheckedChange={(checked) =>
                              handleUpdateIntegration(integration.id, { is_primary: checked })
                            }
                          />
                        </div>
                      </div>

                      {integration.last_sync_at && (
                        <div className="text-sm text-muted-foreground">
                          Last synced: {format(new Date(integration.last_sync_at), 'PPp')}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleManualSync(integration.id)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteIntegration(integration.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};