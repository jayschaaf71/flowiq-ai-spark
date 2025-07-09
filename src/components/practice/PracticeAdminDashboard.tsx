import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  UserCheck,
  AlertCircle,
  Activity
} from 'lucide-react';

export const PracticeAdminDashboard = () => {
  const todayStats = {
    appointments: 24,
    patients: 18,
    revenue: 4850,
    staffOnDuty: 6
  };

  const quickActions = [
    { title: "Schedule Appointment", icon: Calendar, action: "/practice-admin/scheduling" },
    { title: "Add Patient", icon: Users, action: "/practice-admin/patients" },
    { title: "Staff Schedule", icon: UserCheck, action: "/practice-admin/staff" },
    { title: "View Reports", icon: TrendingUp, action: "/practice-admin/reports" }
  ];

  const alerts = [
    { message: "3 appointment confirmations pending", type: "warning" },
    { message: "Insurance verification needed for 2 patients", type: "info" },
    { message: "Staff meeting at 3 PM today", type: "info" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Practice Administration</h1>
        <p className="text-muted-foreground">Manage your practice operations and staff</p>
      </div>

      {/* Today's Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.appointments}</div>
            <p className="text-xs text-muted-foreground">
              6 pending confirmations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.patients}</div>
            <p className="text-xs text-muted-foreground">
              +2 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff On Duty</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.staffOnDuty}</div>
            <p className="text-xs text-muted-foreground">
              2 providers, 4 staff
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto flex-col items-center gap-2 p-4"
                onClick={() => window.location.href = action.action}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-sm">{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{alert.message}</span>
              </div>
              <Badge variant={alert.type === 'warning' ? 'destructive' : 'secondary'}>
                {alert.type}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>New patient registration: Sarah Johnson</span>
              <Badge variant="outline">2 min ago</Badge>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Appointment rescheduled: Mike Chen</span>
              <Badge variant="outline">5 min ago</Badge>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Payment received: $250 from Lisa Rodriguez</span>
              <Badge variant="outline">15 min ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};