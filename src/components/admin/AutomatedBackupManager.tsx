import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Shield, 
  RefreshCw, 
  Clock, 
  HardDrive, 
  CloudDownload,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  Download
} from 'lucide-react';

interface BackupJob {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  source: string;
  schedule: string;
  retention: number;
  compression: boolean;
  encryption: boolean;
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  lastRun: string;
  nextRun: string;
  size: number;
  duration: number;
  successRate: number;
}

interface BackupStorage {
  id: string;
  name: string;
  type: 'local' | 'cloud' | 'hybrid';
  location: string;
  totalCapacity: number;
  usedSpace: number;
  compressionRatio: number;
  encryptionEnabled: boolean;
  replicationEnabled: boolean;
  status: 'healthy' | 'warning' | 'error';
}

interface DisasterRecoveryPlan {
  id: string;
  name: string;
  scope: string;
  rto: number; // Recovery Time Objective (hours)
  rpo: number; // Recovery Point Objective (hours)
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastTested: string;
  testResult: 'passed' | 'failed' | 'partial';
  automatedFailover: boolean;
}

export const AutomatedBackupManager: React.FC = () => {
  const [backupJobs] = useState<BackupJob[]>([
    {
      id: '1',
      name: 'Patient Database Full Backup',
      type: 'full',
      source: 'Primary Database',
      schedule: 'Daily at 2:00 AM',
      retention: 30,
      compression: true,
      encryption: true,
      status: 'completed',
      lastRun: '2024-01-15 02:00',
      nextRun: '2024-01-16 02:00',
      size: 2.4,
      duration: 45,
      successRate: 98.5
    },
    {
      id: '2',
      name: 'Application Files Incremental',
      type: 'incremental',
      source: 'Application Server',
      schedule: 'Every 6 hours',
      retention: 14,
      compression: true,
      encryption: true,
      status: 'running',
      lastRun: '2024-01-15 06:00',
      nextRun: '2024-01-15 12:00',
      size: 0.8,
      duration: 15,
      successRate: 99.2
    },
    {
      id: '3',
      name: 'Configuration Backup',
      type: 'differential',
      source: 'System Configuration',
      schedule: 'Weekly on Sunday',
      retention: 52,
      compression: false,
      encryption: true,
      status: 'scheduled',
      lastRun: '2024-01-14 03:00',
      nextRun: '2024-01-21 03:00',
      size: 0.1,
      duration: 5,
      successRate: 100
    },
    {
      id: '4',
      name: 'File Attachments Backup',
      type: 'incremental',
      source: 'File Storage',
      schedule: 'Daily at 1:00 AM',
      retention: 90,
      compression: true,
      encryption: true,
      status: 'failed',
      lastRun: '2024-01-15 01:00',
      nextRun: '2024-01-16 01:00',
      size: 1.2,
      duration: 30,
      successRate: 95.8
    }
  ]);

  const [storageLocations] = useState<BackupStorage[]>([
    {
      id: '1',
      name: 'Primary Backup Storage',
      type: 'local',
      location: 'On-premise NAS',
      totalCapacity: 10.0,
      usedSpace: 6.2,
      compressionRatio: 2.3,
      encryptionEnabled: true,
      replicationEnabled: false,
      status: 'healthy'
    },
    {
      id: '2',
      name: 'Cloud Backup Archive',
      type: 'cloud',
      location: 'AWS S3 (us-east-1)',
      totalCapacity: 50.0,
      usedSpace: 18.4,
      compressionRatio: 2.1,
      encryptionEnabled: true,
      replicationEnabled: true,
      status: 'healthy'
    },
    {
      id: '3',
      name: 'Disaster Recovery Site',
      type: 'hybrid',
      location: 'Secondary Datacenter',
      totalCapacity: 20.0,
      usedSpace: 4.8,
      compressionRatio: 1.8,
      encryptionEnabled: true,
      replicationEnabled: true,
      status: 'warning'
    }
  ]);

  const [drPlans] = useState<DisasterRecoveryPlan[]>([
    {
      id: '1',
      name: 'Database Recovery Plan',
      scope: 'Patient database and core application',
      rto: 4,
      rpo: 1,
      priority: 'critical',
      lastTested: '2024-01-10',
      testResult: 'passed',
      automatedFailover: true
    },
    {
      id: '2',
      name: 'Application Recovery Plan',
      scope: 'Web application and API services',
      rto: 8,
      rpo: 6,
      priority: 'high',
      lastTested: '2024-01-05',
      testResult: 'passed',
      automatedFailover: true
    },
    {
      id: '3',
      name: 'File Storage Recovery Plan',
      scope: 'Document and attachment storage',
      rto: 24,
      rpo: 12,
      priority: 'medium',
      lastTested: '2023-12-15',
      testResult: 'partial',
      automatedFailover: false
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'running':
        return <Badge variant="warning">Running</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'full':
        return <Badge variant="default">Full</Badge>;
      case 'incremental':
        return <Badge variant="secondary">Incremental</Badge>;
      case 'differential':
        return <Badge variant="outline">Differential</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 text-white">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const getTestResultBadge = (result: string) => {
    switch (result) {
      case 'passed':
        return <Badge variant="success">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'partial':
        return <Badge variant="warning">Partial</Badge>;
      default:
        return <Badge variant="outline">Not Tested</Badge>;
    }
  };

  const totalBackupSize = backupJobs.reduce((sum, job) => sum + job.size, 0);
  const totalStorageUsed = storageLocations.reduce((sum, storage) => sum + storage.usedSpace, 0);
  const averageSuccessRate = backupJobs.reduce((sum, job) => sum + job.successRate, 0) / backupJobs.length;

  return (
    <div className="space-y-6">
      {/* Backup Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Backup Jobs</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backupJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              {backupJobs.filter(j => j.status === 'running').length} running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-success">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStorageUsed.toFixed(1)} GB</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Time</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 hrs</div>
            <p className="text-xs text-muted-foreground">Average RTO</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="jobs">Backup Jobs</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="recovery">Disaster Recovery</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Automated Backup Jobs</CardTitle>
                  <CardDescription>Monitor and manage scheduled backup operations</CardDescription>
                </div>
                <Button onClick={() => console.log('Creating new backup job...')}>
                  <Play className="h-4 w-4 mr-2" />
                  New Backup Job
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{job.name}</div>
                          <div className="text-sm text-muted-foreground">{job.source}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(job.type)}</TableCell>
                      <TableCell className="text-sm">{job.schedule}</TableCell>
                      <TableCell className="text-sm">{job.size} GB</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={job.successRate} className="w-16" />
                          <span className="text-sm">{job.successRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell className="text-sm">{job.nextRun}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => console.log('Running backup job', job.id)}>
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => console.log('Configuring backup job', job.id)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => console.log('Downloading backup', job.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Storage Locations</CardTitle>
              <CardDescription>Monitor backup storage capacity and health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storageLocations.map((storage) => (
                  <div key={storage.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{storage.name}</h4>
                        <p className="text-sm text-muted-foreground">{storage.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{storage.type}</Badge>
                        <Badge variant={storage.status === 'healthy' ? 'success' : 'warning'}>
                          {storage.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs">Storage Usage</Label>
                        <div className="mt-1">
                          <Progress 
                            value={(storage.usedSpace / storage.totalCapacity) * 100} 
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {storage.usedSpace} GB / {storage.totalCapacity} GB
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Compression Ratio</Label>
                        <p className="text-sm font-medium">{storage.compressionRatio}:1</p>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Encryption</Label>
                        <div className="flex items-center gap-1 mt-1">
                          <Shield className={`h-3 w-3 ${storage.encryptionEnabled ? 'text-success' : 'text-muted-foreground'}`} />
                          <span className="text-xs">
                            {storage.encryptionEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Replication</Label>
                        <div className="flex items-center gap-1 mt-1">
                          <RefreshCw className={`h-3 w-3 ${storage.replicationEnabled ? 'text-success' : 'text-muted-foreground'}`} />
                          <span className="text-xs">
                            {storage.replicationEnabled ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recovery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Disaster Recovery Plans</CardTitle>
              <CardDescription>Business continuity and disaster recovery planning</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recovery Plan</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>RTO</TableHead>
                    <TableHead>RPO</TableHead>
                    <TableHead>Last Tested</TableHead>
                    <TableHead>Test Result</TableHead>
                    <TableHead>Auto Failover</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-muted-foreground">{plan.scope}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(plan.priority)}</TableCell>
                      <TableCell className="text-sm">{plan.rto} hrs</TableCell>
                      <TableCell className="text-sm">{plan.rpo} hrs</TableCell>
                      <TableCell className="text-sm">{plan.lastTested}</TableCell>
                      <TableCell>{getTestResultBadge(plan.testResult)}</TableCell>
                      <TableCell>
                        <Badge variant={plan.automatedFailover ? 'success' : 'secondary'}>
                          {plan.automatedFailover ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => console.log('Testing disaster recovery plan', plan.id)}>
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => console.log('Configuring disaster recovery plan', plan.id)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Recovery Settings</CardTitle>
              <CardDescription>Configure global backup and disaster recovery policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Default Retention Period</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Backup Window</Label>
                    <Input defaultValue="02:00 - 06:00" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Compression</Label>
                      <p className="text-sm text-muted-foreground">Reduce backup size by compressing data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Encryption</Label>
                      <p className="text-sm text-muted-foreground">Encrypt backups at rest and in transit</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Automated Testing</Label>
                      <p className="text-sm text-muted-foreground">Regularly test backup integrity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Disaster Recovery Notifications</Label>
                      <p className="text-sm text-muted-foreground">Alert on DR plan execution</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};