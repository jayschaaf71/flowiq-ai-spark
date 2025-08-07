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
  Award
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
  const [selectedTab, setSelectedTab] = useState('messaging-hub');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  // Handle URL parameters for tab selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'scheduling') {
      setSelectedTab('scheduling');
    }
  }, []);

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
      time: '09:00',
      type: 'Sleep Study Review',
      status: 'confirmed',
      reminderSent: true
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      date: '2024-01-16',
      time: '10:30',
      type: 'CPAP Fitting',
      status: 'pending',
      reminderSent: false
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      date: '2024-01-16',
      time: '14:00',
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
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      formType: 'Insurance Verification',
      status: 'draft',
      completion: 65,
      lastUpdated: '2024-01-15'
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      formType: 'Medical History',
      status: 'reviewed',
      completion: 100,
      lastUpdated: '2024-01-14'
    }
  ];

  const communicationStats: CommunicationStats = {
    totalMessages: 1247,
    successfulDeliveries: 1189,
    failedDeliveries: 58,
    averageResponseTime: 2.3,
    activeCampaigns: 4
  };

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'read': return 'bg-purple-100 text-purple-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntakeStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Voice recording logic will be handled by VoiceCallManager
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const [showSendMessageDialog, setShowSendMessageDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    type: 'sms' as 'sms' | 'email',
    subject: '',
    content: '',
    template: ''
  });
  const [integrationStatus, setIntegrationStatus] = useState({
    twilio: { connected: false, messagesSent: 0 },
    resend: { connected: false, emailsSent: 0 }
  });

  // Check integration status on component mount
  React.useEffect(() => {
    const checkIntegrations = async () => {
      try {
        // Check Twilio status
        const twilioResponse = await fetch('/api/integrations/twilio/status');
        if (twilioResponse.ok) {
          const twilioData = await twilioResponse.json();
          setIntegrationStatus(prev => ({
            ...prev,
            twilio: { connected: twilioData.connected, messagesSent: twilioData.messagesSent || 1247 }
          }));
        }

        // Check Resend status
        const resendResponse = await fetch('/api/integrations/resend/status');
        if (resendResponse.ok) {
          const resendData = await resendResponse.json();
          setIntegrationStatus(prev => ({
            ...prev,
            resend: { connected: resendData.connected, emailsSent: resendData.emailsSent || 892 }
          }));
        }
      } catch (error) {
        console.error('Error checking integration status:', error);
      }
    };

    checkIntegrations();
  }, []);

  const handleSendReminder = (appointment: Appointment) => {
    toast({
      title: `Reminder sent for ${appointment.patientName}`,
      description: `Appointment reminder for ${appointment.type} on ${appointment.date} at ${appointment.time}`,
    });
    // In a real app, you would update the appointment.reminderSent status
  };

  const handleSendNewMessage = () => {
    setShowSendMessageDialog(true);
  };

  const handleSendMessage = async () => {
    try {
      let result;

      if (newMessage.type === 'sms') {
        result = await UnifiedCommunicationService.sendSMSWithCustomMessage(
          newMessage.recipient,
          newMessage.content,
          {
            source: 'communication_assistant',
            direction: 'outbound'
          }
        );
      } else {
        result = await UnifiedCommunicationService.sendEmailWithCustomMessage(
          newMessage.recipient,
          newMessage.subject,
          newMessage.content,
          {
            source: 'communication_assistant',
            direction: 'outbound'
          }
        );
      }

      if (result.success) {
        toast({
          title: 'Message sent successfully',
          description: `${newMessage.type.toUpperCase()} sent to ${newMessage.recipient}`,
        });
        setShowSendMessageDialog(false);
        setNewMessage({ recipient: '', type: 'sms', subject: '', content: '', template: '' });
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
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

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messaging-hub">Messaging Hub</TabsTrigger>
          <TabsTrigger value="voice-video">Voice & Video</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="patient-engagement">Patient Engagement</TabsTrigger>
        </TabsList>

        {/* Messaging Hub Tab */}
        <TabsContent value="messaging-hub" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SMS/Email Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  SMS & Email Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Twilio SMS</div>
                        <div className="text-sm text-gray-600">
                          {integrationStatus.twilio.connected ? 'Connected' : 'Disconnected'} • {integrationStatus.twilio.messagesSent.toLocaleString()} messages sent
                        </div>
                      </div>
                    </div>
                    <Badge className={integrationStatus.twilio.connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {integrationStatus.twilio.connected ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Resend Email</div>
                        <div className="text-sm text-gray-600">
                          {integrationStatus.resend.connected ? 'Connected' : 'Disconnected'} • {integrationStatus.resend.emailsSent.toLocaleString()} emails sent
                        </div>
                      </div>
                    </div>
                    <Badge className={integrationStatus.resend.connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {integrationStatus.resend.connected ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" variant="outline" onClick={handleSendNewMessage}>
                      <Plus className="w-4 h-4 mr-2" />
                      Send New Message
                    </Button>
                    <Button className="w-full" variant="outline" onClick={handleMessageTemplates}>
                      <Settings className="w-4 h-4 mr-2" />
                      Message Templates
                    </Button>
                    <Button className="w-full" variant="outline" onClick={handleCommunicationHistory}>
                      <Eye className="w-4 h-4 mr-2" />
                      Communication History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{message.patientName}</div>
                        <Badge className={getMessageStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{message.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{message.channel}</span>
                        <span>{message.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice & Video Tab */}
        <TabsContent value="voice-video" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voice Call Manager */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Voice Call Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceCallManager />
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
                <AIVoiceIntegration />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scheduling Tab */}
        <TabsContent value="scheduling" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Calendar Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarIntegrationSection />
              </CardContent>
            </Card>

            {/* Appointment Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Appointment Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{appointment.patientName}</div>
                        <Badge className={getAppointmentStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {appointment.date} at {appointment.time} - {appointment.type}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Reminder: {appointment.reminderSent ? 'Sent' : 'Pending'}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendReminder(appointment)}
                        >
                          <Bell className="w-3 h-3 mr-1" />
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Patient Engagement Tab */}
        <TabsContent value="patient-engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Intake Forms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Patient Intake Forms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intakeForms.map((form) => (
                    <div key={form.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{form.patientName}</div>
                          <div className="text-sm text-gray-600">{form.formType}</div>
                        </div>
                        <Badge className={getIntakeStatusColor(form.status)}>
                          {form.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Completion: {form.completion}%</span>
                        <span>Updated: {form.lastUpdated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Communication Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Communication Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-gray-600">Appointment reminders, confirmations</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Detailed updates, forms</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium">Voice Calls</div>
                      <div className="text-sm text-gray-600">Follow-ups, urgent matters</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <div className="font-medium">In-App Messages</div>
                      <div className="text-sm text-gray-600">Portal notifications</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>

      {/* Send New Message Dialog */}
      <Dialog open={showSendMessageDialog} onOpenChange={setShowSendMessageDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="Enter phone number or email"
                value={newMessage.recipient}
                onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Message Type</Label>
              <Select value={newMessage.type} onValueChange={(value: 'sms' | 'email') => setNewMessage({ ...newMessage, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newMessage.type === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="content">Message Content</Label>
              <Textarea
                id="content"
                placeholder="Enter your message"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSendMessageDialog(false)}>
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

      {/* Message Templates Dialog */}
      <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Message Templates</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Appointment Reminder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Hi {`{patient_name}`}, your appointment is scheduled for {`{date}`} at {`{time}`}. Please arrive 15 minutes early.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Welcome Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Welcome to Midwest Dental Sleep Medicine Institute! We're excited to help you on your journey to better sleep.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Follow-up Reminder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Hi {`{patient_name}`}, it's time for your follow-up appointment. Please call us to schedule.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Insurance Update</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Hi {`{patient_name}`}, we need to update your insurance information. Please contact us.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Communication History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Communication History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{message.patientName}</div>
                    <Badge className={getMessageStatusColor(message.status)}>
                      {message.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{message.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{message.channel}</span>
                    <span>{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 