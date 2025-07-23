import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Apple, 
  Copy, 
  Eye, 
  EyeOff, 
  Settings, 
  Smartphone, 
  Monitor, 
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Calendar
} from 'lucide-react';

interface CalDAVConfig {
  serverUrl: string;
  username: string;
  password: string;
  calendarPath: string;
}

export const CalDAVSetup = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<CalDAVConfig>({
    serverUrl: '',
    username: '',
    password: '',
    calendarPath: '/appointments'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Generate CalDAV URLs based on current domain
  const baseUrl = window.location.origin;
  const caldavBaseUrl = `${baseUrl}/functions/v1/caldav-server/caldav`;
  const userCalendarUrl = `${caldavBaseUrl}/{user-id}/appointments/`;

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('idle');

    try {
      // Validate configuration
      if (!config.username || !config.password) {
        throw new Error('Username and password are required');
      }

      // Test CalDAV connection
      const response = await fetch(`${caldavBaseUrl}/${config.username}/appointments/`, {
        method: 'PROPFIND',
        headers: {
          'Authorization': `Basic ${btoa(`${config.username}:${config.password}`)}`,
          'Depth': '0',
          'Content-Type': 'application/xml',
        },
        body: `<?xml version="1.0" encoding="UTF-8"?>
<D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <D:resourcetype />
    <D:displayname />
    <C:calendar-description />
  </D:prop>
</D:propfind>`
      });

      if (response.ok) {
        setConnectionStatus('success');
        toast({
          title: "CalDAV Connected",
          description: "Successfully connected to CalDAV server. Your appointments are now available in Apple Calendar.",
        });
      } else {
        throw new Error(`Connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error: unknown) {
      setConnectionStatus('error');
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to CalDAV server",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${description} copied to clipboard`,
    });
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Not Connected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Apple className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Apple Calendar (CalDAV)
                  {getStatusIcon()}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sync your appointments with Apple Calendar via CalDAV protocol
                </p>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CalDAV Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure your CalDAV settings to connect Apple Calendar
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  Use your Dental Sleep IQ username and password to authenticate with the CalDAV server.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="server-url">CalDAV Server URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="server-url"
                      value={caldavBaseUrl}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(caldavBaseUrl, 'Server URL')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calendar-path">Calendar Path</Label>
                  <Input
                    id="calendar-path"
                    value={config.calendarPath}
                    onChange={(e) => setConfig({ ...config, calendarPath: e.target.value })}
                    placeholder="/appointments"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={config.username}
                    onChange={(e) => setConfig({ ...config, username: e.target.value })}
                    placeholder="Your user ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={config.password}
                      onChange={(e) => setConfig({ ...config, password: e.target.value })}
                      placeholder="Your password"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleConnect}
                  disabled={isConnecting || !config.username || !config.password}
                  className="flex-1"
                >
                  {isConnecting ? 'Connecting...' : 'Test Connection'}
                </Button>
                
                {connectionStatus === 'success' && (
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(
                      `${caldavBaseUrl}/${config.username}/appointments/`,
                      'Calendar URL'
                    )}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Calendar URL
                  </Button>
                )}
              </div>

              {connectionStatus === 'success' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    CalDAV connection successful! Your calendar URL is ready to use in Apple Calendar.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  iPhone/iPad Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Step 1: Add Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to Settings → Calendar → Accounts → Add Account → Other
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Step 2: Select CalDAV</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose "Add CalDAV Account"
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Step 3: Enter Details</h4>
                  <div className="bg-muted p-3 rounded-lg space-y-1 text-xs">
                    <div><strong>Server:</strong> {caldavBaseUrl}</div>
                    <div><strong>Username:</strong> Your user ID</div>
                    <div><strong>Password:</strong> Your password</div>
                    <div><strong>Description:</strong> Dental Sleep IQ</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Step 4: Save & Sync</h4>
                  <p className="text-sm text-muted-foreground">
                    Tap "Next" to verify and save the account
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Mac Calendar Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Step 1: Add Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Open Calendar → Calendar → Add Account → Other CalDAV Account
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Step 2: Account Type</h4>
                  <p className="text-sm text-muted-foreground">
                    Select "Manual" for account type
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Step 3: Enter Details</h4>
                  <div className="bg-muted p-3 rounded-lg space-y-1 text-xs">
                    <div><strong>Username:</strong> Your user ID</div>
                    <div><strong>Password:</strong> Your password</div>
                    <div><strong>Server Address:</strong> {caldavBaseUrl}</div>
                    <div><strong>Server Path:</strong> /{'{user-id}'}/appointments/</div>
                    <div><strong>Port:</strong> 443</div>
                    <div><strong>Use SSL:</strong> ✓ Checked</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Step 4: Create Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Click "Create" to add the calendar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium">Authentication Failed</h4>
                  <p className="text-sm text-muted-foreground">
                    Verify your username and password. Ensure you're using your Dental Sleep IQ credentials.
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium">Calendar Not Syncing</h4>
                  <p className="text-sm text-muted-foreground">
                    Check your internet connection and try manually refreshing the calendar in your app.
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium">SSL Certificate Errors</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure you're using HTTPS and that your device trusts the server's SSL certificate.
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium">Events Not Appearing</h4>
                  <p className="text-sm text-muted-foreground">
                    Make sure the calendar is enabled in your calendar app settings and that sync is turned on.
                  </p>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  If you're still experiencing issues, contact support with the following information:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Device type and OS version</li>
                  <li>Calendar app version</li>
                  <li>Error messages (if any)</li>
                  <li>Steps you've already tried</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};