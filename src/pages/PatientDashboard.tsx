import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MessageSquare, 
  FileText, 
  Bell,
  Clock,
  User,
  Heart,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';

export default function PatientDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const quickStats = [
    { label: 'Next Appointment', value: 'Jan 25, 2:00 PM', icon: Calendar, color: 'text-blue-600' },
    { label: 'Unread Messages', value: '2', icon: MessageSquare, color: 'text-green-600' },
    { label: 'Pending Forms', value: '1', icon: FileText, color: 'text-orange-600' },
    { label: 'Health Score', value: '92%', icon: Heart, color: 'text-red-600' },
  ];

  const upcomingAppointments = [
    { id: 1, type: 'Consultation', date: 'Jan 25, 2024', time: '2:00 PM', provider: 'Dr. Smith' },
    { id: 2, type: 'Follow-up', date: 'Feb 8, 2024', time: '10:30 AM', provider: 'Dr. Johnson' },
  ];

  const recentActivities = [
    { id: 1, type: 'appointment', message: 'Appointment confirmed for January 25th', time: '2 hours ago' },
    { id: 2, type: 'message', message: 'New message from Dr. Smith', time: '1 day ago' },
    { id: 3, type: 'form', message: 'Health questionnaire completed', time: '3 days ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Portal</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.first_name || 'Patient'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Profile
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
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="health">Health Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{appointment.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-sm text-muted-foreground">with {appointment.provider}</p>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Appointment management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Secure messaging interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms">
          <Card>
            <CardHeader>
              <CardTitle>Forms & Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Forms and documents interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Health records interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}