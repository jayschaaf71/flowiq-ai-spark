import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  TrendingUp,
  Settings,
  Download,
  Upload,
  Search,
  Filter,
  User,
  Database,
  Mic,
  Play,
  Square,
  Volume2,
  FileText,
  Smartphone,
  Monitor
} from 'lucide-react';

interface Message {
  id: string;
  patientName: string;
  type: 'sms' | 'email' | 'voice' | 'app';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  content: string;
  timestamp: string;
  channel: string;
}

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'rescheduled';
  reminderSent: boolean;
}

interface IntakeForm {
  id: string;
  patientName: string;
  formType: string;
  status: 'draft' | 'submitted' | 'reviewed';
  completion: number;
  lastUpdated: string;
}

export const CommunicationAssistant = () => {
  const [selectedTab, setSelectedTab] = useState('messaging');
  const [isRecording, setIsRecording] = useState(false);

  // Mock data
  const messages: Message[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      type: 'sms',
      status: 'delivered',
      content: 'Your appointment reminder: Tomorrow at 9:00 AM',
      timestamp: '2024-01-15 10:30 AM',
      channel: 'SMS'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      type: 'email',
      status: 'read',
      content: 'Welcome to Midwest Dental Sleep Medicine Institute',
      timestamp: '2024-01-15 09:15 AM',
      channel: 'Email'
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      type: 'voice',
      status: 'sent',
      content: 'Voice message: CPAP follow-up reminder',
      timestamp: '2024-01-15 08:45 AM',
      channel: 'Voice'
    }
  ];

  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      date: '2024-01-16',
      time: '9:00 AM',
      type: 'Sleep Study Review',
      status: 'confirmed',
      reminderSent: true
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      date: '2024-01-17',
      time: '2:30 PM',
      type: 'CPAP Fitting',
      status: 'pending',
      reminderSent: false
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      date: '2024-01-18',
      time: '11:00 AM',
      type: 'Follow-up',
      status: 'confirmed',
      reminderSent: true
    }
  ];

  const intakeForms: IntakeForm[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      formType: 'New Patient Intake',
      status: 'submitted',
      completion: 100,
      lastUpdated: '2024-01-15 10:30 AM'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      formType: 'Medical History',
      status: 'draft',
      completion: 65,
      lastUpdated: '2024-01-15 09:15 AM'
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      formType: 'Insurance Information',
      status: 'reviewed',
      completion: 100,
      lastUpdated: '2024-01-15 08:45 AM'
    }
  ];

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-500 text-white';
      case 'delivered':
        return 'bg-yellow-500 text-white';
      case 'read':
        return 'bg-green-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      case 'rescheduled':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getIntakeStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-500 text-white';
      case 'draft':
        return 'bg-yellow-500 text-white';
      case 'reviewed':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication Assistant</h1>
          <p className="text-gray-600">AI-powered multi-channel communication and patient engagement</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            AI Assistant
          </Badge>
        </div>
      </div>

      {/* Communication Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Messages Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">1,247</div>
            <div className="text-xs text-blue-700 mt-2">+12% from last week</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">98.5%</div>
            <div className="text-xs text-green-700 mt-2">Excellent performance</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">87%</div>
            <div className="text-xs text-purple-700 mt-2">High engagement</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Active Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">4</div>
            <div className="text-xs text-orange-700 mt-2">SMS, Email, Voice, App</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messaging" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messaging
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduling
          </TabsTrigger>
          <TabsTrigger value="intake" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Patient Intake
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice AI
          </TabsTrigger>
        </TabsList>

        {/* Messaging Tab */}
        <TabsContent value="messaging" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Messages */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getMessageStatusColor(message.status)}`}>
                          {message.type === 'sms' && <Smartphone className="h-4 w-4" />}
                          {message.type === 'email' && <Mail className="h-4 w-4" />}
                          {message.type === 'voice' && <Phone className="h-4 w-4" />}
                          {message.type === 'app' && <Monitor className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{message.patientName}</div>
                          <div className="text-sm text-gray-600">{message.content}</div>
                          <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getMessageStatusColor(message.status)}>
                          {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {message.channel}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Message Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">SMS</div>
                      <div className="text-sm text-blue-700">Primary channel</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">65%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Email</div>
                      <div className="text-sm text-green-700">Detailed info</div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">25%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium text-purple-900">Voice</div>
                      <div className="text-sm text-purple-700">Personal touch</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">8%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <div className="font-medium text-orange-900">App</div>
                      <div className="text-sm text-orange-700">In-app notifications</div>
                    </div>
                    <div className="text-2xl font-bold text-orange-900">2%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scheduling Tab */}
        <TabsContent value="scheduling" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointment Communications */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Appointment Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getAppointmentStatusColor(appointment.status)}`}>
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-600">{appointment.type} • {appointment.date} at {appointment.time}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Reminder: {appointment.reminderSent ? 'Sent' : 'Pending'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getAppointmentStatusColor(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Communication Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Communication Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Appointment Reminder
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Welcome Message
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  Follow-up Reminder
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmation Message
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Cancellation Notice
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Patient Intake Tab */}
        <TabsContent value="intake" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Intake Forms */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patient Intake Forms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intakeForms.map((form) => (
                    <div key={form.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getIntakeStatusColor(form.status)}`}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{form.patientName}</div>
                          <div className="text-sm text-gray-600">{form.formType}</div>
                          <div className="text-xs text-gray-500 mt-1">Last updated: {form.lastUpdated}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{form.completion}%</div>
                          <div className="text-sm text-gray-600">Complete</div>
                        </div>
                        <Badge className={getIntakeStatusColor(form.status)}>
                          {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Intake Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Intake Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Completed</div>
                      <div className="text-sm text-green-700">Forms submitted</div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">24</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium text-yellow-900">In Progress</div>
                      <div className="text-sm text-yellow-700">Draft forms</div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">8</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">Reviewed</div>
                      <div className="text-sm text-blue-700">Forms processed</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">18</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice AI Tab */}
        <TabsContent value="voice" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voice Recorder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Click to start voice interaction</p>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={handleStartRecording}
                        disabled={isRecording}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Voice AI
                      </Button>
                      <Button 
                        disabled={!isRecording}
                        variant="outline"
                      >
                        <Square className="mr-2 h-4 w-4" />
                        Stop
                      </Button>
                    </div>
                  </div>
                </div>
                
                {isRecording && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Voice AI Active</h4>
                    <p className="text-sm text-blue-700">Listening for voice commands...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Voice Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Voice Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Appointment Scheduling</h4>
                    <p className="text-sm text-green-700">"Schedule an appointment for next Tuesday at 2 PM"</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Patient Information</h4>
                    <p className="text-sm text-blue-700">"What's the status of Sarah Johnson's sleep study?"</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Voice Notes</h4>
                    <p className="text-sm text-purple-700">"Create a SOAP note for today's consultation"</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Quick Actions</h4>
                    <p className="text-sm text-orange-700">"Send a reminder to all patients with appointments tomorrow"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 