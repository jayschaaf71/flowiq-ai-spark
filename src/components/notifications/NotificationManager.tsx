
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, MessageSquare, Calendar, Send, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, addHours, addDays } from "date-fns";

interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject?: string;
  message_template: string;
  variables: string[];
  is_active: boolean;
}

interface ScheduledNotification {
  id: string;
  appointment_id: string;
  template_id: string;
  recipient_email?: string;
  recipient_phone?: string;
  scheduled_for: string;
  sent_at?: string;
  status: string;
  appointments?: {
    title: string;
    date: string;
    time: string;
  };
}

export const NotificationManager = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
    loadScheduledNotifications();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load notification templates",
        variant: "destructive",
      });
    }
  };

  const loadScheduledNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('scheduled_notifications')
        .select(`
          *,
          appointments (
            title,
            date,
            time
          )
        `)
        .order('scheduled_for', { ascending: true })
        .limit(50);

      if (error) throw error;
      setScheduledNotifications(data || []);
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load scheduled notifications",
        variant: "destructive",
      });
    }
  };

  const scheduleAppointmentReminders = async () => {
    setLoading(true);
    try {
      // Get confirmed appointments for the next 7 days
      const today = new Date();
      const nextWeek = addDays(today, 7);
      
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', 'confirmed')
        .gte('date', format(today, 'yyyy-MM-dd'))
        .lte('date', format(nextWeek, 'yyyy-MM-dd'));

      if (error) throw error;

      let scheduledCount = 0;
      
      for (const appointment of appointments || []) {
        const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
        
        // Schedule 24-hour email reminder
        const emailReminderTime = addHours(appointmentDateTime, -24);
        if (emailReminderTime > today && appointment.email) {
          const emailTemplate = templates.find(t => t.name === 'Appointment Reminder 24h');
          if (emailTemplate) {
            await supabase.from('scheduled_notifications').insert({
              appointment_id: appointment.id,
              template_id: emailTemplate.id,
              recipient_email: appointment.email,
              scheduled_for: emailReminderTime.toISOString()
            });
            scheduledCount++;
          }
        }

        // Schedule 2-hour SMS reminder
        const smsReminderTime = addHours(appointmentDateTime, -2);
        if (smsReminderTime > today && appointment.phone) {
          const smsTemplate = templates.find(t => t.name === 'SMS Reminder');
          if (smsTemplate) {
            await supabase.from('scheduled_notifications').insert({
              appointment_id: appointment.id,
              template_id: smsTemplate.id,
              recipient_phone: appointment.phone,
              scheduled_for: smsReminderTime.toISOString()
            });
            scheduledCount++;
          }
        }
      }

      toast({
        title: "Reminders Scheduled",
        description: `Successfully scheduled ${scheduledCount} appointment reminders`,
      });

      loadScheduledNotifications();
    } catch (error) {
      console.error('Error scheduling reminders:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment reminders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendNotificationNow = async (notificationId: string) => {
    try {
      // Here you would call your edge function to send the notification
      await supabase.functions.invoke('send-notification', {
        body: { notificationId }
      });

      await supabase
        .from('scheduled_notifications')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      toast({
        title: "Notification Sent",
        description: "Notification sent successfully",
      });

      loadScheduledNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      sent: 'default',
      failed: 'destructive',
      cancelled: 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notification Management</h2>
          <p className="text-gray-600">Manage appointment reminders and notifications</p>
        </div>
        <Button onClick={scheduleAppointmentReminders} disabled={loading}>
          <Calendar className="w-4 h-4 mr-2" />
          {loading ? 'Scheduling...' : 'Schedule Reminders'}
        </Button>
      </div>

      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">
            <Clock className="w-4 h-4 mr-2" />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Bell className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No notifications scheduled
                </div>
              ) : (
                <div className="space-y-4">
                  {scheduledNotifications.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">
                              {notification.appointments?.title || 'Appointment'}
                            </h4>
                            {getStatusBadge(notification.status)}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <strong>Scheduled for:</strong> {format(new Date(notification.scheduled_for), 'MMM d, yyyy h:mm a')}
                            </p>
                            <p>
                              <strong>Recipient:</strong> {notification.recipient_email || notification.recipient_phone}
                            </p>
                            {notification.appointments && (
                              <p>
                                <strong>Appointment:</strong> {format(new Date(notification.appointments.date), 'MMM d, yyyy')} at {notification.appointments.time}
                              </p>
                            )}
                            {notification.sent_at && (
                              <p>
                                <strong>Sent:</strong> {format(new Date(notification.sent_at), 'MMM d, yyyy h:mm a')}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {notification.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendNotificationNow(notification.id)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Send Now
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {template.type === 'email' ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                    {template.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline">{template.type}</Badge>
                    {template.subject && (
                      <p className="text-sm font-medium">{template.subject}</p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {template.message_template}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="secondary" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
