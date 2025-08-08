import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Server, Activity, Database, Cpu, HardDrive, Wifi, Settings, RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react';

export const PlatformInfrastructure = () => {
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);

  console.log('🔧 [PlatformInfrastructure] Component rendered');

  const handleSystemRestart = () => {
    console.log('🔧 [PlatformInfrastructure] Restarting system');
    setShowRestartDialog(true);
  };

  const confirmSystemRestart = () => {
    console.log('🔧 [PlatformInfrastructure] Confirming system restart');
    alert('System restart initiated... (This would restart the infrastructure in production)');
    setShowRestartDialog(false);
  };

  const handleCreateBackup = () => {
    console.log('🔧 [PlatformInfrastructure] Creating backup');
    setShowBackupDialog(true);
  };

  const confirmCreateBackup = () => {
    console.log('🔧 [PlatformInfrastructure] Confirming backup creation');
    alert('Creating system backup... (This would create a full backup in production)');
    setShowBackupDialog(false);
  };

  const handlePerformanceTest = () => {
    console.log('🔧 [PlatformInfrastructure] Running performance test');
    alert('Running performance test... (This would test system performance in production)');
  };

  const handleViewLogs = () => {
    console.log('🔧 [PlatformInfrastructure] Viewing system logs');
    alert('Opening system logs... (This would show detailed system logs in production)');
  };

  const handleScaleResources = () => {
    console.log('🔧 [PlatformInfrastructure] Scaling resources');
    alert('Scaling system resources... (This would adjust infrastructure capacity in production)');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Infrastructure</h1>
        <p className="text-muted-foreground">System infrastructure monitoring and management</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <Progress value={45} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Normal load
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <Progress value={67} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              8.2 GB / 12 GB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <Progress value={23} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              230 GB / 1 TB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12%</div>
            <Progress value={12} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              120 Mbps
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="outline" onClick={handleSystemRestart}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Restart System
            </Button>
            <Button className="w-full" variant="outline" onClick={handleCreateBackup}>
              <Database className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
            <Button className="w-full" variant="outline" onClick={handlePerformanceTest}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance Test
            </Button>
            <Button className="w-full" variant="outline" onClick={handleViewLogs}>
              <Activity className="h-4 w-4 mr-2" />
              View Logs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>System Status</span>
              <Badge variant="default">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Uptime</span>
              <Badge variant="secondary">99.9%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Response Time</span>
              <Badge variant="secondary">125ms</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Active Connections</span>
              <Badge variant="secondary">1,234</Badge>
            </div>
            <Button className="w-full" variant="outline" onClick={handleScaleResources}>
              <Settings className="h-4 w-4 mr-2" />
              Scale Resources
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>High CPU Usage</span>
              <Badge variant="destructive">2 hours ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Memory Warning</span>
              <Badge variant="secondary">4 hours ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Backup Completed</span>
              <Badge variant="default">6 hours ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>System Update</span>
              <Badge variant="default">1 day ago</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Database Status</span>
              <Badge variant="default">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Connection Pool</span>
              <Badge variant="secondary">85%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Query Performance</span>
              <Badge variant="default">Excellent</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Backup</span>
              <Badge variant="default">2 hours ago</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Restart Dialog */}
      <AlertDialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restart System</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restart the system? This will cause a brief service interruption.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSystemRestart}>Restart</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Backup Dialog */}
      <AlertDialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create System Backup</AlertDialogTitle>
            <AlertDialogDescription>
              Create a full system backup? This may take several minutes to complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCreateBackup}>Create Backup</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};