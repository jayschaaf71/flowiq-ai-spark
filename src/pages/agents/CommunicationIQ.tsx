import React, { useState, useCallback } from 'react';
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
  Activity,
  ClipboardList,
  FileText,
  Bot,
  Mic
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import scheduling components from ScheduleIQProduction
import { ScheduleStats } from '@/components/schedule/ScheduleStats';
import { AppointmentManager } from '@/components/schedule/AppointmentManager';
import { TodaysAppointments } from '@/components/schedule/TodaysAppointments';
import { CalendarView } from '@/components/schedule/CalendarView';
import { AutomatedReminders } from '@/components/schedule/AutomatedReminders';

// Import intake components from IntakeIQ
import { IntakeDashboard } from '@/components/intake/IntakeDashboard';
import { FormBuilder } from '@/components/intake/FormBuilder';
import { FormSubmissionsList } from '@/components/intake/FormSubmissionsList';
import { ConversationalVoiceIntake } from '@/components/intake/ConversationalVoiceIntake';
import { MobileVoiceIntake } from '@/components/intake/MobileVoiceIntake';
import { StaffIntakeDashboard } from '@/components/intake/StaffIntakeDashboard';

// Import hooks
import { useIntakeForms } from '@/hooks/useIntakeForms';

// Import waitlist components
import { WaitlistManagement } from '@/components/waitlist/WaitlistManagement';

export const CommunicationIQ = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Clear any persisting errors on mount
  React.useEffect(() => {
    console.log('CommunicationIQ mounted, clearing any persistent errors');
  }, []);

  // Add error handling for intake forms hook
  const { forms, submissions, loading } = useIntakeForms();

  // Enhanced stats combining appointment and intake metrics
  const stats = {
    todayAppointments: 24,
    confirmationRate: 87,
    intakeCompletion: 92,
    noShowRate: 3.2,
    appointmentsToday: 24,
    bookedThisWeek: 156,
    utilizationRate: 87,
    avgBookingTime: "2.3 minutes",
    automatedBookings: 89,
    pendingIntakes: 8,
    voiceCallsToday: 15,
    emailsSent: 43,
    smsMessages: 67,
    scheduleUtilization: 87,
    availableSlots: 12,
    aiAccuracy: 94
  };

  // Mock data - enhanced for comprehensive communication management
  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      time: '9:00 AM',
      provider: 'Dr. Smith',
      type: 'Cleaning',
      status: 'confirmed',
      reminderSent: true,
      intakeCompleted: true,
      communicationPreference: 'SMS'
    },
    {
      id: 2,
      patient: 'Mike Wilson',
      time: '10:30 AM',
      provider: 'Dr. Jones',
      type: 'Consultation',
      status: 'pending',
      reminderSent: false,
      intakeCompleted: false,
      communicationPreference: 'Email'
    },
    {
      id: 3,
      patient: 'Emma Davis',
      time: '2:00 PM',
      provider: 'Dr. Smith',
      type: 'Follow-up',
      status: 'confirmed',
      reminderSent: true,
      intakeCompleted: true,
      communicationPreference: 'Voice'
    }
  ];

  const pendingIntakes = [
    { 
      patient: 'Mike Wilson', 
      appointmentTime: '10:30 AM', 
      sent: '2 hours ago',
      formType: 'New Patient',
      communicationMethod: 'Email + SMS'
    },
    { 
      patient: 'Lisa Chen', 
      appointmentTime: '3:30 PM', 
      sent: '1 day ago',
      formType: 'Medical History',
      communicationMethod: 'Voice Call'
    },
    { 
      patient: 'Robert Brown', 
      appointmentTime: 'Tomorrow 9:00 AM', 
      sent: '3 hours ago',
      formType: 'Insurance Verification',
      communicationMethod: 'Email'
    }
  ];

  const communicationQueue = [
    { 
      patient: 'Jennifer Smith', 
      type: 'Appointment Reminder', 
      method: 'SMS', 
      status: 'scheduled',
      scheduledFor: '8:00 AM today'
    },
    { 
      patient: 'Mark Johnson', 
      type: 'Intake Form Follow-up', 
      method: 'Voice Call', 
      status: 'pending',
      scheduledFor: 'Now'
    },
    { 
      patient: 'Anna Wilson', 
      type: 'Post-visit Survey', 
      method: 'Email', 
      status: 'sent',
      scheduledFor: 'Yesterday'
    }
  ];

  const handleAppointmentBooked = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setSelectedTab("dashboard");
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'sent': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Communication IQ"
        subtitle="Patient communication management - intake, forms, messaging, and follow-up"
        badge="AI Agent"
      />

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTab('booking')}>
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

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTab('booking')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Schedule Utilization</p>
                <p className="text-2xl font-bold">{stats.scheduleUtilization}%</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTab('booking')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Slots</p>
                <p className="text-2xl font-bold">{stats.availableSlots}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTab('booking')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Accuracy</p>
                <p className="text-2xl font-bold">{stats.aiAccuracy}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="booking">Book Appointment</TabsTrigger>
          <TabsTrigger value="intake">Patient Intake</TabsTrigger>
          <TabsTrigger value="forms">Form Builder</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="reminders">Auto Reminders</TabsTrigger>
          <TabsTrigger value="waitlist">Waiting List</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Appointments and patient preparation status</CardDescription>
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
                          <div className="text-xs text-gray-500">Prefers: {appointment.communicationPreference}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        {appointment.intakeCompleted && (
                          <Badge className="bg-green-100 text-green-700">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Intake Done
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Communication Queue */}
            <Card>
              <CardHeader>
                <CardTitle>Active Communications</CardTitle>
                <CardDescription>Scheduled and pending patient communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communicationQueue.map((comm, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          {comm.method === 'SMS' && <MessageSquare className="h-5 w-5 text-blue-600" />}
                          {comm.method === 'Voice Call' && <Phone className="h-5 w-5 text-green-600" />}
                          {comm.method === 'Email' && <Mail className="h-5 w-5 text-purple-600" />}
                        </div>
                        <div>
                          <div className="font-medium">{comm.patient}</div>
                          <div className="text-sm text-gray-600">{comm.type}</div>
                          <div className="text-xs text-gray-500">{comm.scheduledFor}</div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(comm.status)}>
                        {comm.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Intakes */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Patient Intake</CardTitle>
              <CardDescription>Patients who need to complete intake forms or verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingIntakes.map((intake, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{intake.patient}</div>
                      <div className="text-sm text-gray-600">Appointment: {intake.appointmentTime}</div>
                      <div className="text-xs text-gray-500">
                        {intake.formType} via {intake.communicationMethod} • Sent: {intake.sent}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Voice call to:', intake.patient)}
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
                        onClick={() => setSelectedTab('intake')}
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

        <TabsContent value="booking" className="space-y-4">
          <TodaysAppointments />
        </TabsContent>

        <TabsContent value="intake" className="space-y-4">
          <div className="grid gap-6">
            <IntakeDashboard />
            
            {/* Voice Conversation Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Conversation Intake
                </CardTitle>
                <CardDescription>
                  Allow patients to provide all their information in one conversational voice session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConversationalVoiceIntake />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <FormBuilder />
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Management</CardTitle>
              <CardDescription>Manage all patient communications across channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold">SMS Messages</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{stats.smsMessages}</p>
                  <p className="text-sm text-gray-600">sent today</p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="h-6 w-6 text-purple-600" />
                    <h3 className="font-semibold">Email Messages</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{stats.emailsSent}</p>
                  <p className="text-sm text-gray-600">sent today</p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="h-6 w-6 text-green-600" />
                    <h3 className="font-semibold">Voice Calls</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{stats.voiceCallsToday}</p>
                  <p className="text-sm text-gray-600">calls today</p>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <StaffIntakeDashboard />
        </TabsContent>


        <TabsContent value="reminders" className="space-y-4">
          <AutomatedReminders />
        </TabsContent>

        <TabsContent value="waitlist" className="space-y-4">
          <WaitlistManagement />
        </TabsContent>
      </Tabs>

      {/* Enhanced Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common communication and scheduling tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => setSelectedTab('booking')}
            >
              <Calendar className="h-6 w-6 mb-1" />
              <span className="text-xs">Book Appointment</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => setSelectedTab('intake')}
            >
              <ClipboardList className="h-6 w-6 mb-1" />
              <span className="text-xs">Send Intake</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => setSelectedTab('communications')}
            >
              <Phone className="h-6 w-6 mb-1" />
              <span className="text-xs">Voice Call</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => setSelectedTab('reminders')}
            >
              <Bell className="h-6 w-6 mb-1" />
              <span className="text-xs">Send Reminder</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => setSelectedTab('forms')}
            >
              <FileText className="h-6 w-6 mb-1" />
              <span className="text-xs">Create Form</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => setSelectedTab('waitlist')}
            >
              <Users className="h-6 w-6 mb-1" />
              <span className="text-xs">Waitlist</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationIQ;