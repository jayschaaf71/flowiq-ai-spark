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
import { CalendarIntegrationDialog } from '@/components/calendar/CalendarIntegrationDialog';
import { useCalendarIntegrations } from '@/hooks/useCalendarIntegrations';
import { StaffCommunicationCenter } from '@/components/communication/StaffCommunicationCenter';
import { PracticeOverview } from '@/components/practice/PracticeOverview';

export default function StaffDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const { integrations, syncAllCalendars } = useCalendarIntegrations();

  const quickStats = [
    { label: 'Active Patients', value: '247', icon: Users, color: 'text-blue-600' },
    { label: 'Today\'s Appointments', value: '12', icon: Calendar, color: 'text-green-600' },
    { label: 'Pending Messages', value: '8', icon: MessageSquare, color: 'text-orange-600' },
    { label: 'Revenue (MTD)', value: '$24.5K', icon: DollarSign, color: 'text-purple-600' },
  ];

  // Get tenant ID for practice overview
  const tenantId = profile?.tenant_id || '024e36c1-a1bc-44d0-8805-3162ba59a0c2'; // Default to West County Spine

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
          <Button variant="outline" size="sm" onClick={() => setShowCalendarDialog(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Calendar Settings
          </Button>
          <Button variant="outline" size="sm" onClick={() => syncAllCalendars()}>
            <Bell className="h-4 w-4 mr-2" />
            Sync Calendars
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
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

        <TabsContent value="practice">
          <PracticeOverview practiceId={tenantId} />
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">247</div>
                        <div className="text-sm text-muted-foreground">Active Patients</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">38</div>
                        <div className="text-sm text-muted-foreground">New This Month</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <div className="text-sm text-muted-foreground">Need Follow-up</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-muted-foreground">Advanced patient management interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Appointment Management
                <div className="flex gap-2">
                  <Badge variant="outline">{integrations.length} Calendar{integrations.length !== 1 ? 's' : ''} Connected</Badge>
                  <Button size="sm" onClick={() => setShowCalendarDialog(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Calendars
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <div className="text-sm text-muted-foreground">Today</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">45</div>
                        <div className="text-sm text-muted-foreground">This Week</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">8</div>
                        <div className="text-sm text-muted-foreground">Cancellations</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">3</div>
                        <div className="text-sm text-muted-foreground">No Shows</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-muted-foreground">Advanced appointment scheduling interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications">
          <StaffCommunicationCenter />
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">94%</div>
                        <div className="text-sm text-muted-foreground">Patient Satisfaction</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">$24.5K</div>
                        <div className="text-sm text-muted-foreground">Revenue (MTD)</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">15%</div>
                        <div className="text-sm text-muted-foreground">Growth Rate</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-muted-foreground">Detailed analytics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Calendar Integration Dialog */}
      <CalendarIntegrationDialog 
        open={showCalendarDialog} 
        onOpenChange={setShowCalendarDialog} 
      />
    </div>
  );
}

// Component moved to separate file