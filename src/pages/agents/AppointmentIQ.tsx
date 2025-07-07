import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Clock,
  MessageSquare,
  Users,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  ArrowRight,
  Bell,
  UserCheck,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AppointmentIQ = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('upcoming');

  // Mock data - in production this would come from your API
  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      time: '9:00 AM',
      provider: 'Dr. Smith',
      type: 'Cleaning',
      status: 'confirmed',
      reminderSent: true,
      intakeCompleted: true
    },
    {
      id: 2,
      patient: 'Mike Wilson',
      time: '10:30 AM',
      provider: 'Dr. Jones',
      type: 'Consultation',
      status: 'pending',
      reminderSent: false,
      intakeCompleted: false
    },
    {
      id: 3,
      patient: 'Emma Davis',
      time: '2:00 PM',
      provider: 'Dr. Smith',
      type: 'Follow-up',
      status: 'confirmed',
      reminderSent: true,
      intakeCompleted: true
    }
  ];

  const pendingIntakes = [
    { patient: 'Mike Wilson', appointmentTime: '10:30 AM', sent: '2 hours ago' },
    { patient: 'Lisa Chen', appointmentTime: '3:30 PM', sent: '1 day ago' },
    { patient: 'Robert Brown', appointmentTime: 'Tomorrow 9:00 AM', sent: '3 hours ago' }
  ];

  const activeReminders = [
    { patient: 'Sarah Johnson', type: '24hr reminder', status: 'sent', time: '8:00 AM today' },
    { patient: 'Emma Davis', type: '1hr reminder', status: 'scheduled', time: '1:00 PM today' },
    { patient: 'Tom Anderson', type: 'Confirmation', status: 'pending', time: 'Tomorrow 8:00 AM' }
  ];

  const followUpQueue = [
    { patient: 'Jennifer Smith', type: 'Post-visit care', lastVisit: '3 days ago', status: 'pending' },
    { patient: 'Mark Johnson', type: 'Recall reminder', lastVisit: '5 months ago', status: 'scheduled' },
    { patient: 'Anna Wilson', type: 'Review request', lastVisit: '1 week ago', status: 'sent' }
  ];

  const stats = {
    todayAppointments: 12,
    confirmationRate: 87,
    intakeCompletion: 92,
    noShowRate: 3.2
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Appointment IQ"
        subtitle="Complete appointment lifecycle management - from booking to follow-up"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <p className="text-2xl font-bold">{stats.todayAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmation Rate</p>
                <p className="text-2xl font-bold">{stats.confirmationRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Intake Completion</p>
                <p className="text-2xl font-bold">{stats.intakeCompletion}%</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">No-Show Rate</p>
                <p className="text-2xl font-bold">{stats.noShowRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
          <TabsTrigger value="intake">Pending Intake</TabsTrigger>
          <TabsTrigger value="reminders">Active Reminders</TabsTrigger>
          <TabsTrigger value="followup">Follow-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Manage appointments and patient preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-bold text-lg">{appointment.time}</div>
                        <div className="text-xs text-gray-500">{appointment.type}</div>
                      </div>
                      <div>
                        <div className="font-medium">{appointment.patient}</div>
                        <div className="text-sm text-gray-600">with {appointment.provider}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      {appointment.reminderSent && (
                        <Badge className="bg-blue-100 text-blue-700">
                          <Bell className="w-3 h-3 mr-1" />
                          Reminded
                        </Badge>
                      )}
                      {appointment.intakeCompleted && (
                        <Badge className="bg-green-100 text-green-700">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Intake Done
                        </Badge>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/agents/scribe')}
                      >
                        Start Visit
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intake" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Patient Intake</CardTitle>
              <CardDescription>Patients who need to complete intake forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingIntakes.map((intake, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{intake.patient}</div>
                      <div className="text-sm text-gray-600">Appointment: {intake.appointmentTime}</div>
                      <div className="text-xs text-gray-500">Form sent: {intake.sent}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(intake.patient);
                          console.log('Call initiated for:', intake.patient);
                        }}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Resend form to:', intake.patient)}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Resend
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => navigate('/agents/intake')}
                      >
                        View Intake
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Queue</CardTitle>
              <CardDescription>Automated reminder status and scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeReminders.map((reminder, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{reminder.patient}</div>
                        <div className="text-sm text-gray-600">{reminder.type}</div>
                        <div className="text-xs text-gray-500">{reminder.time}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(reminder.status)}>
                      {reminder.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Queue</CardTitle>
              <CardDescription>Post-visit care and recall management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {followUpQueue.map((followup, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">{followup.patient}</div>
                        <div className="text-sm text-gray-600">{followup.type}</div>
                        <div className="text-xs text-gray-500">Last visit: {followup.lastVisit}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(followup.status)}>
                        {followup.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/agents/remind')}
                      >
                        Send Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common appointment management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => navigate('/schedule')}
            >
              <Calendar className="h-6 w-6 mb-1" />
              <span className="text-xs">Book Appointment</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => navigate('/agents/remind')}
            >
              <Bell className="h-6 w-6 mb-1" />
              <span className="text-xs">Send Reminder</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => navigate('/agents/intake')}
            >
              <UserCheck className="h-6 w-6 mb-1" />
              <span className="text-xs">Check Intake</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => navigate('/integrations')}
            >
              <Activity className="h-6 w-6 mb-1" />
              <span className="text-xs">External Integrations</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => navigate('/analytics')}
            >
              <Activity className="h-6 w-6 mb-1" />
              <span className="text-xs">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentIQ;