import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertTriangle, CheckCircle, Clock, Shield, Bell, Settings, Eye, RefreshCw } from 'lucide-react';

export const PlatformAlerts = () => {
  const [alertSettings, setAlertSettings] = useState({
    emailNotifications: true,
    smsAlerts: true,
    slackIntegration: false,
    autoResolution: true
  });

  const [showViewCriticalDialog, setShowViewCriticalDialog] = useState(false);
  const [showViewWarningsDialog, setShowViewWarningsDialog] = useState(false);

  console.log('🔧 [PlatformAlerts] Component rendered');

  const handleToggleSetting = (setting: string) => {
    setAlertSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
    console.log('🔧 [PlatformAlerts] Toggled setting:', setting);
  };

  const handleViewAllCritical = () => {
    console.log('🔧 [PlatformAlerts] Viewing all critical alerts');
    setShowViewCriticalDialog(true);
  };

  const handleViewAllWarnings = () => {
    console.log('🔧 [PlatformAlerts] Viewing all warning alerts');
    setShowViewWarningsDialog(true);
  };

  const handleResolveAlert = (alertType: string) => {
    console.log('🔧 [PlatformAlerts] Resolving alert:', alertType);
    alert(`Resolving ${alertType} alert... (This would resolve the alert in production)`);
  };

  const handleRefreshAlerts = () => {
    console.log('🔧 [PlatformAlerts] Refreshing alerts');
    alert('Refreshing alert status... (This would refresh alerts in production)');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Alerts</h1>
        <p className="text-muted-foreground">Monitor and manage platform alerts and notifications</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 critical, 1 warning
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2min</div>
            <p className="text-xs text-muted-foreground">
              Average resolution time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>High CPU Usage</span>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Critical</Badge>
                <Button size="sm" variant="outline" onClick={() => handleResolveAlert('CPU Usage')}>
                  Resolve
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Database Connection</span>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Critical</Badge>
                <Button size="sm" variant="outline" onClick={() => handleResolveAlert('Database Connection')}>
                  Resolve
                </Button>
              </div>
            </div>
            <Button className="w-full" variant="outline" onClick={handleViewAllCritical}>
              <Eye className="h-4 w-4 mr-2" />
              View All Critical
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Warning Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Memory Usage</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Warning</Badge>
                <Button size="sm" variant="outline" onClick={() => handleResolveAlert('Memory Usage')}>
                  Resolve
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Disk Space</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Warning</Badge>
                <Button size="sm" variant="outline" onClick={() => handleResolveAlert('Disk Space')}>
                  Resolve
                </Button>
              </div>
            </div>
            <Button className="w-full" variant="outline" onClick={handleViewAllWarnings}>
              <Eye className="h-4 w-4 mr-2" />
              View All Warnings
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Alert History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Today</span>
              <Badge variant="secondary">12 alerts</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>This Week</span>
              <Badge variant="secondary">45 alerts</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>This Month</span>
              <Badge variant="secondary">156 alerts</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Average Resolution</span>
              <span className="text-sm text-muted-foreground">5.2 minutes</span>
            </div>
            <Button className="w-full" variant="outline" onClick={handleRefreshAlerts}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Alerts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Switch 
                checked={alertSettings.emailNotifications}
                onCheckedChange={() => handleToggleSetting('emailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>SMS Alerts</span>
              <Switch 
                checked={alertSettings.smsAlerts}
                onCheckedChange={() => handleToggleSetting('smsAlerts')}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Slack Integration</span>
              <Switch 
                checked={alertSettings.slackIntegration}
                onCheckedChange={() => handleToggleSetting('slackIntegration')}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Auto Resolution</span>
              <Switch 
                checked={alertSettings.autoResolution}
                onCheckedChange={() => handleToggleSetting('autoResolution')}
              />
            </div>
            <Button className="w-full" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Alert Preferences
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* View Critical Alerts Dialog */}
      <AlertDialog open={showViewCriticalDialog} onOpenChange={setShowViewCriticalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Critical Alerts</AlertDialogTitle>
            <AlertDialogDescription>
              View all critical system alerts and their details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowViewCriticalDialog(false)}>Export</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Warning Alerts Dialog */}
      <AlertDialog open={showViewWarningsDialog} onOpenChange={setShowViewWarningsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning Alerts</AlertDialogTitle>
            <AlertDialogDescription>
              View all warning system alerts and their details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowViewWarningsDialog(false)}>Export</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};