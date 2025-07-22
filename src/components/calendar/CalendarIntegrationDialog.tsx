import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Settings, Trash2, RefreshCw } from 'lucide-react';
import { useCalendarIntegrations } from '@/hooks/useCalendarIntegrations';
import { toast } from 'sonner';

interface CalendarIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CalendarIntegrationDialog: React.FC<CalendarIntegrationDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { 
    integrations, 
    loading, 
    syncing, 
    connectCalendar, 
    updateIntegration, 
    deleteIntegration,
    syncCalendar 
  } = useCalendarIntegrations();

  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnectGoogle = async () => {
    setConnecting('google');
    try {
      await connectCalendar('google');
      toast.success('Google Calendar connected successfully!');
    } catch (error) {
      console.error('Failed to connect Google Calendar:', error);
      toast.error('Failed to connect Google Calendar');
    } finally {
      setConnecting(null);
    }
  };

  const handleConnectOutlook = async () => {
    setConnecting('microsoft');
    try {
      await connectCalendar('microsoft');
      toast.success('Outlook Calendar connected successfully!');
    } catch (error) {
      console.error('Failed to connect Outlook Calendar:', error);
      toast.error('Failed to connect Outlook Calendar');
    } finally {
      setConnecting(null);
    }
  };

  const handleToggleSync = async (integrationId: string, currentState: boolean) => {
    try {
      await updateIntegration(integrationId, { sync_enabled: !currentState });
    } catch (error) {
      console.error('Failed to toggle sync:', error);
    }
  };

  const handleDeleteIntegration = async (integrationId: string) => {
    if (confirm('Are you sure you want to remove this calendar integration?')) {
      try {
        await deleteIntegration(integrationId);
      } catch (error) {
        console.error('Failed to delete integration:', error);
      }
    }
  };

  const handleSyncCalendar = async (integrationId: string) => {
    try {
      await syncCalendar(integrationId);
    } catch (error) {
      console.error('Failed to sync calendar:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Calendar Integrations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Integration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect New Calendar</h3>
            <div className="grid gap-3">
              <Button
                onClick={handleConnectGoogle}
                disabled={connecting === 'google' || loading}
                className="w-full justify-start gap-3 h-12"
                variant="outline"
              >
                <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-sm font-bold">
                  G
                </div>
                {connecting === 'google' ? 'Connecting...' : 'Connect Google Calendar'}
              </Button>

              <Button
                onClick={handleConnectOutlook}
                disabled={connecting === 'microsoft' || loading}
                className="w-full justify-start gap-3 h-12"
                variant="outline"
              >
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-bold">
                  O
                </div>
                {connecting === 'microsoft' ? 'Connecting...' : 'Connect Outlook Calendar'}
              </Button>
            </div>
          </div>

          {/* Existing Integrations */}
          {integrations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connected Calendars</h3>
              <div className="space-y-3">
                {integrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${
                            integration.provider === 'google' ? 'bg-red-500' : 'bg-blue-500'
                          }`} />
                          {integration.calendar_name || `${integration.provider} Calendar`}
                          {integration.is_primary && (
                            <Badge variant="secondary" className="text-xs">Primary</Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSyncCalendar(integration.id)}
                            disabled={syncing === integration.id}
                          >
                            <RefreshCw className={`w-4 h-4 ${syncing === integration.id ? 'animate-spin' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteIntegration(integration.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        Provider: {integration.provider} • 
                        Sync: {integration.sync_direction} • 
                        {integration.last_sync_at 
                          ? `Last synced: ${new Date(integration.last_sync_at).toLocaleDateString()}`
                          : 'Never synced'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={integration.sync_enabled}
                            onCheckedChange={() => handleToggleSync(integration.id, integration.sync_enabled)}
                          />
                          <span className="text-sm">
                            {integration.sync_enabled ? 'Sync enabled' : 'Sync disabled'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Integration Info */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Note:</strong> Calendar integration allows two-way sync between FlowIQ and your external calendars.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Appointments created in FlowIQ will appear in your external calendar</li>
              <li>Events from your external calendar can be imported as blocked time</li>
              <li>Changes are synced automatically every few minutes</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
