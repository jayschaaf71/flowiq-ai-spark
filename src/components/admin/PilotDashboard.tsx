import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PilotSetupWizard } from '@/components/pilot/PilotSetupWizard';
import { UserInviteDialog } from '@/components/admin/UserInviteDialog';
import { SpecialtyWorkflowTester } from '@/components/specialty/SpecialtyWorkflowTester';
import { 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useTenantManagement } from '@/hooks/useTenantManagement';

export const PilotDashboard: React.FC = () => {
  const { tenants } = useTenantManagement();

  const pilotMetrics = [
    {
      title: 'Total Pilot Practices',
      value: tenants?.length || 0,
      icon: Users,
      change: '+2 this month',
      changeType: 'positive' as const
    },
    {
      title: 'Active Users',
      value: '8',
      icon: Activity,
      change: '+3 this week',
      changeType: 'positive' as const
    },
    {
      title: 'Scheduled Appointments',
      value: '24',
      icon: Calendar,
      change: '+12 today',
      changeType: 'positive' as const
    },
    {
      title: 'Form Submissions',
      value: '45',
      icon: FileText,
      change: '+8 today',
      changeType: 'positive' as const
    }
  ];

  const pilotStatus = [
    {
      practice: 'West County Spine & Joint',
      specialty: 'Chiropractic',
      status: 'setup_required',
      lastActivity: '2 hours ago',
      users: 0
    },
    {
      practice: 'Midwest Dental Sleep Medicine',
      specialty: 'Dental Sleep',
      status: 'ready',
      lastActivity: '1 hour ago',
      users: 2
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'testing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'setup_required':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="default">Ready</Badge>;
      case 'testing':
        return <Badge variant="secondary">Testing</Badge>;
      case 'setup_required':
        return <Badge variant="destructive">Setup Required</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pilot Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage pilot practice implementations</p>
        </div>
        <UserInviteDialog />
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pilotMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </div>
                <metric.icon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">{metric.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pilot Practices Status */}
      <Card>
        <CardHeader>
          <CardTitle>Pilot Practices Status</CardTitle>
          <CardDescription>Current status of pilot implementations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pilotStatus.map((practice) => (
              <div key={practice.practice} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(practice.status)}
                  <div>
                    <h3 className="font-medium">{practice.practice}</h3>
                    <p className="text-sm text-muted-foreground">{practice.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{practice.users} users</span>
                  <span className="text-muted-foreground">Active {practice.lastActivity}</span>
                  {getStatusBadge(practice.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Wizard */}
      <PilotSetupWizard />

      {/* Workflow Testing */}
      <SpecialtyWorkflowTester />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common pilot management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>View All Users</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Export Reports</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Activity className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};