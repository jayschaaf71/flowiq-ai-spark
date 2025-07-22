import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bell, 
  Brain, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Send,
  MessageCircle,
  Mail,
  Phone,
  Settings,
  TrendingUp,
  Users
} from 'lucide-react';

interface SmartNotification {
  id: string;
  type: 'appointment_reminder' | 'follow_up' | 'insurance_verification' | 'payment_due' | 'care_plan' | 'critical_alert';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  patientName?: string;
  scheduledFor: Date;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'cancelled';
  channel: 'sms' | 'email' | 'call' | 'push';
  aiGenerated: boolean;
  metadata: {
    appointmentId?: string;
    patientId?: string;
    templateUsed?: string;
    confidence?: number;
  };
}

interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: string;
  conditions: string[];
  actions: string[];
  aiOptimized: boolean;
}

export const AINotificationCenter = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [analytics, setAnalytics] = useState({
    totalSent: 0,
    deliveryRate: 0,
    responseRate: 0,
    aiOptimizationRate: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
    loadAutomationRules();
    loadAnalytics();
  }, []);

  const loadNotifications = async () => {
    try {
      // Simulate loading recent notifications
      const mockNotifications: SmartNotification[] = [
        {
          id: '1',
          type: 'appointment_reminder',
          priority: 'medium',
          title: 'Appointment Reminder',
          message: 'Hi John, this is a friendly reminder about your chiropractic appointment tomorrow at 2:00 PM with Dr. Smith.',
          patientName: 'John Doe',
          scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'pending',
          channel: 'sms',
          aiGenerated: true,
          metadata: {
            appointmentId: 'apt_123',
            patientId: 'pat_456',
            templateUsed: 'appointment_reminder_24h',
            confidence: 94
          }
        },
        {
          id: '2',
          type: 'follow_up',
          priority: 'low',
          title: 'Post-Treatment Follow-up',
          message: 'How are you feeling after yesterday\'s treatment? Your feedback helps us provide better care.',
          patientName: 'Sarah Wilson',
          scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
          status: 'sent',
          channel: 'email',
          aiGenerated: true,
          metadata: {
            patientId: 'pat_789',
            confidence: 87
          }
        },
        {
          id: '3',
          type: 'critical_alert',
          priority: 'critical',
          title: 'Insurance Verification Urgent',
          message: 'Patient insurance requires immediate verification before tomorrow\'s procedure.',
          patientName: 'Mike Johnson',
          scheduledFor: new Date(),
          status: 'pending',
          channel: 'push',
          aiGenerated: false,
          metadata: {
            appointmentId: 'apt_789'
          }
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadAutomationRules = () => {
    const mockRules: AutomationRule[] = [
      {
        id: '1',
        name: 'Appointment Reminders',
        enabled: true,
        trigger: '24 hours before appointment',
        conditions: ['Patient has valid contact info', 'Appointment is confirmed'],
        actions: ['Send SMS reminder', 'Update patient record'],
        aiOptimized: true
      },
      {
        id: '2',
        name: 'Post-Treatment Follow-up',
        enabled: true,
        trigger: '24 hours after treatment',
        conditions: ['Treatment completed', 'Patient consent for follow-up'],
        actions: ['Send personalized email', 'Schedule next appointment if needed'],
        aiOptimized: true
      },
      {
        id: '3',
        name: 'Insurance Verification',
        enabled: false,
        trigger: '72 hours before appointment',
        conditions: ['High-cost procedure', 'Insurance requires pre-auth'],
        actions: ['Send verification request', 'Alert staff'],
        aiOptimized: false
      }
    ];
    setAutomationRules(mockRules);
  };

  const loadAnalytics = () => {
    setAnalytics({
      totalSent: 1247,
      deliveryRate: 97.3,
      responseRate: 23.8,
      aiOptimizationRate: 76.2
    });
  };

  const sendNotification = async (notificationId: string) => {
    setIsLoading(true);
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification) return;

      // Call the notification sending edge function
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: {
          type: notification.type,
          channel: notification.channel,
          recipient: notification.patientName,
          message: notification.message,
          metadata: notification.metadata
        }
      });

      if (error) throw error;

      // Update notification status
      setNotifications(prev => prev.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'sent' as const }
          : n
      ));

      toast({
        title: "Notification Sent",
        description: `${notification.channel.toUpperCase()} notification sent successfully`,
      });

    } catch (error: unknown) {
      console.error('Error sending notification:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutomationRule = (ruleId: string, enabled: boolean) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled }
        : rule
    ));

    toast({
      title: enabled ? "Rule Enabled" : "Rule Disabled",
      description: `Automation rule has been ${enabled ? 'enabled' : 'disabled'}`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <MessageCircle className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSent}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.deliveryRate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.responseRate}%</div>
            <p className="text-xs text-muted-foreground">+5.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.aiOptimizationRate}%</div>
            <p className="text-xs text-muted-foreground">AI-optimized messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Smart Notifications Queue
              </CardTitle>
              <CardDescription>
                AI-powered patient communications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(notification.status)}
                        {getChannelIcon(notification.channel)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          {notification.aiGenerated && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              <Brain className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {notification.patientName && `To: ${notification.patientName} • `}
                          {notification.scheduledFor.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {notification.metadata.confidence && (
                        <span className="text-xs text-gray-500">
                          {notification.metadata.confidence}% confidence
                        </span>
                      )}
                      {notification.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => sendNotification(notification.id)}
                          disabled={isLoading}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Automation Rules
              </CardTitle>
              <CardDescription>
                Configure AI-powered notification workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        {rule.aiOptimized && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            <Brain className="w-3 h-3 mr-1" />
                            AI Optimized
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Trigger:</strong> {rule.trigger}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Conditions:</strong> {rule.conditions.join(', ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Actions:</strong> {rule.actions.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(enabled) => toggleAutomationRule(rule.id, enabled)}
                      />
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Communication Analytics
              </CardTitle>
              <CardDescription>
                Performance insights and optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Channel Performance</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>SMS</span>
                        <span>94% delivery rate</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Email</span>
                        <span>87% delivery rate</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Push</span>
                        <span>91% delivery rate</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">AI Insights</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        • Best send time: 10 AM - 2 PM
                      </p>
                      <p className="text-sm text-gray-600">
                        • Personalized messages get 34% more responses
                      </p>
                      <p className="text-sm text-gray-600">
                        • SMS reminders reduce no-shows by 23%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};