import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Database, Activity, Shield, Settings, RefreshCw, AlertTriangle, TrendingUp, Download } from 'lucide-react';

export const PlatformDatabase = () => {
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showOptimizeDialog, setShowOptimizeDialog] = useState(false);

  console.log('🔧 [PlatformDatabase] Component rendered');

  const handleDatabaseMonitor = () => {
    console.log('🔧 [PlatformDatabase] Opening database monitor');
    alert('Opening database monitoring dashboard... (This would show real-time database metrics in production)');
  };

  const handlePerformanceReport = () => {
    console.log('🔧 [PlatformDatabase] Generating performance report');
    alert('Generating database performance report... (This would create a detailed report in production)');
  };

  const handleCreateBackup = () => {
    console.log('🔧 [PlatformDatabase] Creating database backup');
    setShowBackupDialog(true);
  };

  const confirmCreateBackup = () => {
    console.log('🔧 [PlatformDatabase] Confirming backup creation');
    alert('Creating database backup... (This would create a full backup in production)');
    setShowBackupDialog(false);
  };

  const handleOptimizeDatabase = () => {
    console.log('🔧 [PlatformDatabase] Optimizing database');
    setShowOptimizeDialog(true);
  };

  const confirmOptimizeDatabase = () => {
    console.log('🔧 [PlatformDatabase] Confirming database optimization');
    alert('Optimizing database... (This would run optimization tasks in production)');
    setShowOptimizeDialog(false);
  };

  const handleViewLogs = () => {
    console.log('🔧 [PlatformDatabase] Viewing database logs');
    alert('Opening database logs... (This would show detailed database logs in production)');
  };

  const handleExportData = () => {
    console.log('🔧 [PlatformDatabase] Exporting database data');
    alert('Exporting database data... (This would export data in production)');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Database Management</h1>
        <p className="text-muted-foreground">Database performance monitoring and administration</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Pool</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              17/20 connections active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Query Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125ms</div>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <Progress value={23} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              230 GB of 1 TB used
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
            <Progress value={99.9} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Primary Database</span>
              <Badge variant="default">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Replica Database</span>
              <Badge variant="default">Synced</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Backup Status</span>
              <Badge variant="default">Up to Date</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>SSL Connection</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <Button className="w-full" variant="outline" onClick={handleDatabaseMonitor}>
              <Database className="h-4 w-4 mr-2" />
              Database Monitor
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Queries/Second</span>
              <Badge variant="default">2,450</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Slow Queries</span>
              <Badge variant="secondary">12</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Cache Hit Rate</span>
              <Badge variant="default">94.2%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Index Usage</span>
              <Badge variant="default">Optimal</Badge>
            </div>
            <Button className="w-full" variant="outline" onClick={handlePerformanceReport}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Encryption</span>
              <Badge variant="default">AES-256</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Access Control</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Audit Logging</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Vulnerability Scan</span>
              <Badge variant="default">Clean</Badge>
            </div>
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
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Last Backup</span>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Next Maintenance</span>
              <span className="text-sm text-muted-foreground">Sunday 2 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Auto Optimization</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Version</span>
              <span className="text-sm text-muted-foreground">PostgreSQL 15.2</span>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" variant="outline" onClick={handleCreateBackup}>
                <Database className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
              <Button className="flex-1" variant="outline" onClick={handleOptimizeDatabase}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Optimize
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Backup Dialog */}
      <AlertDialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Database Backup</AlertDialogTitle>
            <AlertDialogDescription>
              Create a full database backup? This may take several minutes to complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCreateBackup}>Create Backup</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Optimize Database Dialog */}
      <AlertDialog open={showOptimizeDialog} onOpenChange={setShowOptimizeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Optimize Database</AlertDialogTitle>
            <AlertDialogDescription>
              Run database optimization tasks? This may temporarily impact performance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmOptimizeDatabase}>Optimize</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};