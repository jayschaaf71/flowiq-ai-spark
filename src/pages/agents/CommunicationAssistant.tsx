import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
  Monitor,
  Zap,
  Bell,
  Video,
  Camera,
  Link,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Receipt,
  Shield,
  Target,
  Award,
  UserPlus,
  PhoneCall,
  MailOpen,
  BarChart3,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Clock4,
  AlertCircle
} from 'lucide-react';

// Import calendar integration hook
import { useCalendarIntegrations } from '@/hooks/useCalendarIntegrations';
import { VoiceCallManager } from '@/components/communications/VoiceCallManager';
import { AIVoiceIntegration } from '@/components/communications/AIVoiceIntegration';
import { NotificationCenter } from '@/components/ui/NotificationCenter';

// Calendar Integration Component
const CalendarIntegrationSection = () => {
  const {
    integrations,
    loading,
    error,
    connectCalendar,
    disconnectCalendar,
    isConnected
  } = useCalendarIntegrations();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Calendar Integrations</h3>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="font-medium mb-1">Connection Error</div>
            <div>{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => connectCalendar('google')}
            disabled={loading}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Connect Google</span>
          </Button>

          <Button
            onClick={() => connectCalendar('microsoft')}
            disabled={loading}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Connect Outlook</span>
          </Button>

          <Button
            onClick={() => connectCalendar('apple')}
            disabled={loading}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Connect Apple</span>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Connection Status</h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Google Calendar</div>
                <div className="text-sm text-gray-600">
                  {isConnected('google') ? 'Connected and syncing' : 'Not connected'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected('google') ? 'default' : 'secondary'}>
                {isConnected('google') ? 'Connected' : 'Not Connected'}
              </Badge>
              {isConnected('google') && (
                <Button
                  onClick={() => disconnectCalendar(integrations.find(i => i.provider === 'google')?.id || '')}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  Disconnect
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Microsoft Outlook</div>
                <div className="text-sm text-gray-600">
                  {isConnected('microsoft') ? 'Connected and syncing' : 'Not connected'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected('microsoft') ? 'default' : 'secondary'}>
                {isConnected('microsoft') ? 'Connected' : 'Not Connected'}
              </Badge>
              {isConnected('microsoft') && (
                <Button
                  onClick={() => disconnectCalendar(integrations.find(i => i.provider === 'microsoft')?.id || '')}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  Disconnect
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium">Apple Calendar</div>
                <div className="text-sm text-gray-600">
                  {isConnected('apple') ? 'Connected and syncing' : 'Not connected'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected('apple') ? 'default' : 'secondary'}>
                {isConnected('apple') ? 'Connected' : 'Not Connected'}
              </Badge>
              {isConnected('apple') && (
                <Button
                  onClick={() => disconnectCalendar(integrations.find(i => i.provider === 'apple')?.id || '')}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


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

interface CommunicationStats {
  totalMessages: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  averageResponseTime: number;
  activeCampaigns: number;
}

export const CommunicationAssistant = () => {
  const [selectedTab, setSelectedTab] = useState('patient-outreach');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    type: 'sms',
    content: '',
    scheduledTime: ''
  });

  const { toast } = useToast();

  // Mock data for demonstration
  const communicationStats = {
    totalMessages: 1247,
    successfulDeliveries: 1189,
    failedDeliveries: 58,
    averageResponseTime: 2.3,
    activeCampaigns: 8
  };

  const recentMessages = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      type: 'sms',
      status: 'delivered',
      content: 'Your appointment reminder for tomorrow at 2:00 PM',
      timestamp: '2024-01-15T10:30:00Z',
      channel: 'SMS'
    },
    {
      id: '2',
      patientName: 'Mike Wilson',
      type: 'email',
      status: 'read',
      content: 'Welcome to our practice! Here\'s your new patient packet.',
      timestamp: '2024-01-15T09:15:00Z',
      channel: 'Email'
    },
    {
      id: '3',
      patientName: 'Emma Davis',
      type: 'voice',
      status: 'sent',
      content: 'Follow-up call regarding your treatment plan',
      timestamp: '2024-01-15T08:45:00Z',
      channel: 'Voice'
    }
  ];

  const upcomingAppointments = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      date: '2024-01-16',
      time: '14:00',
      type: 'Consultation',
      status: 'confirmed',
      reminderSent: true
    },
    {
      id: '2',
      patientName: 'Mike Wilson',
      date: '2024-01-17',
      time: '10:30',
      type: 'Follow-up',
      status: 'pending',
      reminderSent: false
    },
    {
      id: '3',
      patientName: 'Emma Davis',
      date: '2024-01-18',
      time: '15:45',
      type: 'Treatment',
      status: 'confirmed',
      reminderSent: true
    }
  ];

  const intakeForms = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      formType: 'New Patient',
      status: 'submitted',
      completion: 100,
      lastUpdated: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      patientName: 'Mike Wilson',
      formType: 'Medical History',
      status: 'draft',
      completion: 65,
      lastUpdated: '2024-01-15T09:30:00Z'
    },
    {
      id: '3',
      patientName: 'Emma Davis',
      formType: 'Insurance Update',
      status: 'reviewed',
      completion: 100,
      lastUpdated: '2024-01-15T08:15:00Z'
    }
  ];

  // Helper functions
  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'read': return 'text-blue-600';
      case 'sent': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      case 'rescheduled': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getIntakeStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-green-600';
      case 'draft': return 'text-yellow-600';
      case 'reviewed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const handleStartRecording = () => {
    toast({
      title: "Recording Started",
      description: "Voice recording is now active",
    });
  };

  const handleStopRecording = () => {
    toast({
      title: "Recording Stopped",
      description: "Voice recording has been saved",
    });
  };

  // Check integrations on component mount
  useEffect(() => {
    const checkIntegrations = async () => {
      // This would check actual integration status
      console.log('Checking communication integrations...');
    };

    checkIntegrations();
  }, []);

  const handleSendReminder = (appointment: any) => {
    toast({
      title: "Reminder Sent",
      description: `Reminder sent to ${appointment.patientName}`,
    });
  };

  const handleSendNewMessage = () => {
    setShowNewMessageDialog(true);
  };

  const handleSendMessage = async () => {
    // This would actually send the message
    toast({
      title: "Message Sent",
      description: `Message sent to ${newMessage.recipient}`,
    });
    setShowNewMessageDialog(false);
    setNewMessage({ recipient: '', type: 'sms', content: '', scheduledTime: '' });
  };

  const handleMessageTemplates = () => {
    setShowTemplatesDialog(true);
  };

  const handleCommunicationHistory = () => {
    setShowHistoryDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication Assistant</h1>
          <p className="text-gray-600">AI-powered multi-channel communication and patient engagement</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationCenter />
          <Badge className="bg-purple-100 text-purple-800">
            AI Assistant
          </Badge>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">{communicationStats.totalMessages.toLocaleString()}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{Math.round((communicationStats.successfulDeliveries / communicationStats.totalMessages) * 100)}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">{communicationStats.averageResponseTime}h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold">{communicationStats.activeCampaigns}</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs - Workflow-Based Organization */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patient-outreach" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Patient Outreach
          </TabsTrigger>
          <TabsTrigger value="appointment-management" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Appointment Management
          </TabsTrigger>
          <TabsTrigger value="communication-hub" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Communication Hub
          </TabsTrigger>
          <TabsTrigger value="analytics-optimization" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics & Optimization
          </TabsTrigger>
        </TabsList>

        {/* Patient Outreach Tab */}
        <TabsContent value="patient-outreach" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* New Patient Onboarding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  New Patient Onboarding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Welcome Campaign</div>
                        <div className="text-sm text-gray-600">Automated 3-step onboarding</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Step 1: Welcome SMS</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Step 2: Email Packet</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Step 3: Pre-appointment Call</span>
                      <Clock4 className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                  
                  <Button className="w-full" onClick={handleSendNewMessage}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Patient
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Patient Education Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Education Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Treatment Education</div>
                        <div className="text-sm text-gray-600">Post-appointment follow-up</div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Preventive Care</div>
                        <div className="text-sm text-gray-600">Monthly health tips</div>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appointment Management Tab */}
        <TabsContent value="appointment-management" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointment Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Appointment Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Upcoming Appointments</span>
                    <Badge variant="secondary">{upcomingAppointments.length}</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-gray-600">
                            {appointment.date} at {appointment.time} - {appointment.type}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={appointment.reminderSent ? "default" : "secondary"}
                            className={getAppointmentStatusColor(appointment.status)}
                          >
                            {appointment.reminderSent ? 'Reminder Sent' : 'Send Reminder'}
                          </Badge>
                          {!appointment.reminderSent && (
                            <Button size="sm" onClick={() => handleSendReminder(appointment)}>
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intake Form Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Intake Form Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Form Status</span>
                    <Badge variant="secondary">{intakeForms.length} Forms</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {intakeForms.map((form) => (
                      <div key={form.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{form.patientName}</div>
                          <div className="text-sm text-gray-600">{form.formType}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={form.status === 'submitted' ? "default" : "secondary"}
                            className={getIntakeStatusColor(form.status)}
                          >
                            {form.completion}% Complete
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Communication Hub Tab */}
        <TabsContent value="communication-hub" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Multi-Channel Messaging */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Multi-Channel Messaging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">SMS</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Mail className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Email</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Phone className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium">Voice</span>
                    </Button>
                  </div>
                  
                  <Button className="w-full" onClick={handleSendNewMessage}>
                    <Plus className="w-4 h-4 mr-2" />
                    Send New Message
                  </Button>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Recent Messages</span>
                      <Button variant="ghost" size="sm" onClick={handleCommunicationHistory}>
                        View All
                      </Button>
                    </div>
                    
                    {recentMessages.slice(0, 3).map((message) => (
                      <div key={message.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          {message.type === 'sms' && <Smartphone className="w-4 h-4 text-blue-600" />}
                          {message.type === 'email' && <Mail className="w-4 h-4 text-green-600" />}
                          {message.type === 'voice' && <Phone className="w-4 h-4 text-purple-600" />}
                          <div>
                            <div className="text-sm font-medium">{message.patientName}</div>
                            <div className="text-xs text-gray-600">{message.content.substring(0, 30)}...</div>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={getMessageStatusColor(message.status)}
                        >
                          {message.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Voice Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  AI Voice Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium">AI Voice Assistant</div>
                        <div className="text-sm text-gray-600">Automated patient calls</div>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Appointment Confirmations</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Reminder Calls</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Follow-up Surveys</span>
                      <Clock4 className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Voice Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics & Optimization Tab */}
        <TabsContent value="analytics-optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">95.3%</div>
                      <div className="text-sm text-gray-600">Delivery Rate</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">2.3h</div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">87%</div>
                      <div className="text-sm text-gray-600">Engagement Rate</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">12%</div>
                      <div className="text-sm text-gray-600">No-Show Reduction</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Optimization Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  AI Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Optimize Send Times</div>
                        <div className="text-xs text-gray-600">Messages sent at 2 PM have 23% higher open rates</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Personalize Content</div>
                        <div className="text-xs text-gray-600">Use patient's first name for 15% better engagement</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">A/B Test Subject Lines</div>
                        <div className="text-xs text-gray-600">Test different approaches for appointment reminders</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Apply AI Suggestions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Send New Message Dialog */}
      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={newMessage.recipient}
                onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                placeholder="Patient name or phone/email"
              />
            </div>
            <div>
              <Label htmlFor="type">Message Type</Label>
              <Select value={newMessage.type} onValueChange={(value) => setNewMessage({...newMessage, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="voice">Voice Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Message Content</Label>
              <Textarea
                id="content"
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                placeholder="Enter your message..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 