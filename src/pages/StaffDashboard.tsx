import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Settings,
  Bell,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { StaffIntakeDashboard } from '@/components/intake/StaffIntakeDashboard';

export default function StaffDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const quickStats = [
    { label: 'Active Patients', value: '247', icon: Users, color: 'text-blue-600' },
    { label: 'Today\'s Appointments', value: '12', icon: Calendar, color: 'text-green-600' },
    { label: 'Pending Messages', value: '8', icon: MessageSquare, color: 'text-orange-600' },
    { label: 'Revenue (MTD)', value: '$24.5K', icon: DollarSign, color: 'text-purple-600' },
  ];

  const recentActivities = [
    { id: 1, type: 'appointment', message: 'New appointment scheduled for John Doe', time: '5 minutes ago' },
    { id: 2, type: 'message', message: 'Patient inquiry received', time: '12 minutes ago' },
    { id: 3, type: 'payment', message: 'Payment processed for Sarah Smith', time: '1 hour ago' },
    { id: 4, type: 'form', message: 'Intake form completed by Mike Johnson', time: '2 hours ago' },
  ];

  const upcomingTasks = [
    { id: 1, task: 'Review patient intake forms', priority: 'high', due: '2 hours' },
    { id: 2, task: 'Follow up with insurance verification', priority: 'medium', due: '4 hours' },
    { id: 3, task: 'Schedule team meeting', priority: 'low', due: '1 day' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.first_name || 'Staff Member'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="intake">Intake</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{task.task}</p>
                        <p className="text-xs text-muted-foreground">Due in {task.due}</p>
                      </div>
                      <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Patient management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Appointment management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications">
          <Card>
            <CardHeader>
              <CardTitle>Communication Center</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Communication management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intake">
          <StaffIntakeDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}