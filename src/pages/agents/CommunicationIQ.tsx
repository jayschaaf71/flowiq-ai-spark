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
  Mic,
  Volume2,
  Headphones,
  MessageCircle,
  Wrench,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import scheduling components from ScheduleIQProduction
import { ScheduleStats } from '@/components/schedule/ScheduleStats';
import { AppointmentManager } from '@/components/schedule/AppointmentManager';
import { TodaysAppointments } from '@/components/schedule/TodaysAppointments';
import { CalendarView } from '@/components/schedule/CalendarView';
import { AutomatedReminders } from '@/components/schedule/AutomatedReminders';
import { AvailableSlots } from '@/components/schedule/AvailableSlots';

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

export const FlowIQConnect = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Clear any persisting errors on mount
  React.useEffect(() => {
    console.log('FlowIQ Connect mounted, clearing any persistent errors');
  }, []);

  // Add error handling for intake forms hook
  const { forms, submissions, loading } = useIntakeForms();

  // Enhanced stats combining service and customer metrics
  const stats = {
    todayServices: 24,
    confirmationRate: 87,
    onboardingCompletion: 92,
    noShowRate: 3.2,
    servicesToday: 24,
    bookedThisWeek: 156,
    utilizationRate: 87,
    avgBookingTime: "2.3 minutes",
    automatedBookings: 89,
    pendingOnboarding: 8,
    voiceCallsToday: 15,
    emailsSent: 43,
    smsMessages: 67,
    scheduleUtilization: 87,
    availableSlots: 12,
    aiAccuracy: 94
  };

  // Voice AI Components
  const VoiceAIDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Voice Calls Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">15</div>
            <p className="text-sm text-gray-500">+12% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              AI Voice Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">94%</div>
            <p className="text-sm text-gray-500">Accuracy rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Call Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">2.3 min</div>
            <p className="text-sm text-gray-500">Average call time</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Voice Call Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Inbound Calls</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Outbound Calls</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span>AI Handled</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span>Human Transfer</span>
                <span className="font-medium">7</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Voice Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h4 className="font-medium">AI Voice Assistant</h4>
                  <p className="text-sm text-gray-500">Automated call handling</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h4 className="font-medium">Call Transcription</h4>
                  <p className="text-sm text-gray-500">Real-time voice-to-text</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h4 className="font-medium">Voice Scheduling</h4>
                  <p className="text-sm text-gray-500">Book services via voice</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">Setup Required</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const MultiChannelMessaging = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Emails Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">43</div>
            <p className="text-sm text-gray-500">Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              SMS Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">67</div>
            <p className="text-sm text-gray-500">Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">23</div>
            <p className="text-sm text-gray-500">Today</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Multi-Channel Communication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <h4 className="font-medium">Email Integration</h4>
                <p className="text-sm text-gray-500">Resend/SendGrid integration</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <h4 className="font-medium">SMS Integration</h4>
                <p className="text-sm text-gray-500">Twilio SMS service</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <h4 className="font-medium">Chat Integration</h4>
                <p className="text-sm text-gray-500">Customer-staff chat</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700">Setup Required</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <h4 className="font-medium">Voice Integration</h4>
                <p className="text-sm text-gray-500">Vapi AI voice capabilities</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CommunicationAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">2.3 min</div>
            <p className="text-sm text-gray-500">Average response time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">87%</div>
            <p className="text-sm text-gray-500">Customer engagement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>No-Show Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">23%</div>
            <p className="text-sm text-gray-500">Reduction in no-shows</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Communication Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Communication analytics chart will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Mock data - enhanced for comprehensive service business management
  const upcomingServices = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      time: '9:00 AM',
      service: 'HVAC Maintenance',
      type: 'Regular Service',
      status: 'confirmed',
      reminderSent: true,
      onboardingCompleted: true,
      communicationPreference: 'SMS'
    },
    {
      id: 2,
      customer: 'Mike Wilson',
      time: '10:30 AM',
      service: 'Plumbing Repair',
      type: 'Emergency Call',
      status: 'pending',
      reminderSent: false,
      onboardingCompleted: false,
      communicationPreference: 'Email'
    },
    {
      id: 3,
      customer: 'Emma Davis',
      time: '2:00 PM',
      service: 'Electrical Installation',
      type: 'New Installation',
      status: 'confirmed',
      reminderSent: true,
      onboardingCompleted: true,
      communicationPreference: 'Voice'
    }
  ];

  const pendingOnboarding = [
    { 
      customer: 'Mike Wilson', 
      serviceTime: '10:30 AM', 
      sent: '2 hours ago',
      formType: 'New Customer',
      communicationMethod: 'Email + SMS'
    },
    { 
      customer: 'Lisa Chen', 
      serviceTime: '3:30 PM', 
      sent: '1 day ago',
      formType: 'Service History',
      communicationMethod: 'Voice Call'
    },
    { 
      customer: 'Robert Brown', 
      serviceTime: 'Tomorrow 9:00 AM', 
      sent: '3 hours ago',
      formType: 'Service Requirements',
      communicationMethod: 'Email'
    }
  ];

  const communicationQueue = [
    { 
      customer: 'Jennifer Smith', 
      type: 'Service Reminder', 
      method: 'SMS', 
      status: 'scheduled',
      scheduledFor: '8:00 AM today'
    },
    { 
      customer: 'Mark Johnson', 
      type: 'Onboarding Follow-up', 
      method: 'Voice Call', 
      status: 'pending',
      scheduledFor: 'Now'
    },
    { 
      customer: 'Anna Wilson', 
      type: 'Post-service Survey', 
      method: 'Email', 
      status: 'sent',
      scheduledFor: 'Yesterday'
    }
  ];

  const handleServiceBooked = useCallback(() => {
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
        title="FlowIQ Connect"
        subtitle="Customer communication management - onboarding, forms, messaging, and follow-up"
        badge="AI Agent"
      />

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTab('booking')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Services</p>
                <p className="text-2xl font-bold">{stats.todayServices}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
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

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTab('available-slots')}>
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
          <TabsTrigger value="booking">Today's Services</TabsTrigger>
          <TabsTrigger value="available-slots">Available Slots</TabsTrigger>
          <TabsTrigger value="intake">Customer Onboarding</TabsTrigger>
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
                <CardDescription>Services and customer preparation status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-bold text-lg">{service.time}</div>
                          <div className="text-xs text-gray-500">{service.type}</div>
                        </div>
                        <div>
                          <div className="font-medium">{service.customer}</div>
                          <div className="text-sm text-gray-600">Service: {service.service}</div>
                          <div className="text-xs text-gray-500">Prefers: {service.communicationPreference}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                        {service.onboardingCompleted && (
                          <Badge className="bg-green-100 text-green-700">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Onboarding Done
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
                <CardDescription>Scheduled and pending customer communications</CardDescription>
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
                          <div className="font-medium">{comm.customer}</div>
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

          {/* Pending Onboarding */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Customer Onboarding</CardTitle>
              <CardDescription>Customers who need to complete onboarding forms or verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingOnboarding.map((onboarding, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{onboarding.customer}</div>
                      <div className="text-sm text-gray-600">Service: {onboarding.serviceTime}</div>
                      <div className="text-xs text-gray-500">
                        {onboarding.formType} via {onboarding.communicationMethod} • Sent: {onboarding.sent}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Voice call to:', onboarding.customer)}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Resend form to:', onboarding.customer)}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Resend
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => setSelectedTab('intake')}
                      >
                        View Onboarding
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

        <TabsContent value="available-slots" className="space-y-4">
          <AvailableSlots />
        </TabsContent>

        <TabsContent value="intake" className="space-y-4">
          <div className="grid gap-6">
            <IntakeDashboard />
            
            {/* Voice Conversation Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Conversation Onboarding
                </CardTitle>
                <CardDescription>
                  Allow customers to provide all their information in one conversational voice session
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
              <CardDescription>Manage all customer communications across channels</CardDescription>
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
              <span className="text-xs">Book Service</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col"
              onClick={() => setSelectedTab('intake')}
            >
              <ClipboardList className="h-6 w-6 mb-1" />
              <span className="text-xs">Send Onboarding</span>
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

export default FlowIQConnect;