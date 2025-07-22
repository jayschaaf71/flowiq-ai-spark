import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  Calendar,
  Clock,
  User,
  FileText,
  Bell
} from 'lucide-react';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
}

interface CommunicationLog {
  id: string;
  type: string;
  recipient: string;
  message: string;
  status: string;
  created_at: string;
  sent_at?: string;
  delivered_at?: string;
}

interface PatientCommunicationHubProps {
  patient: Patient;
}

export const PatientCommunicationHub = ({ patient }: PatientCommunicationHubProps) => {
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'sms' | 'email'>('sms');
  const { toast } = useToast();

  useEffect(() => {
    fetchCommunicationLogs();
  }, [patient.id]);

  const fetchCommunicationLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communication_logs')
        .select('*')
        .eq('patient_id', patient.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setCommunicationLogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load communication history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    const recipient = messageType === 'sms' ? patient.phone : patient.email;
    if (!recipient) {
      toast({
        title: "Error",
        description: `No ${messageType === 'sms' ? 'phone number' : 'email address'} on file`,
        variant: "destructive",
      });
      return;
    }

    setSendingMessage(true);
    try {
      const { error } = await supabase
        .from('communication_logs')
        .insert([{
          patient_id: patient.id,
          type: messageType,
          recipient,
          message,
          status: 'sent'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${messageType.toUpperCase()} sent successfully`,
      });

      setMessage('');
      fetchCommunicationLogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to send ${messageType}`,
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const scheduleAppointmentReminder = async () => {
    try {
      // Get upcoming appointments for this patient
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patient.id)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(1);

      if (error) throw error;

      if (!appointments || appointments.length === 0) {
        toast({
          title: "No Appointments",
          description: "No upcoming appointments found for this patient",
          variant: "destructive",
        });
        return;
      }

      const appointment = appointments[0];
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
      const reminderTime = new Date(appointmentDate.getTime() - (24 * 60 * 60 * 1000)); // 24 hours before

      const { error: reminderError } = await supabase
        .from('appointment_reminders')
        .insert([{
          appointment_id: appointment.id,
          reminder_type: patient.phone ? 'sms' : 'email',
          scheduled_for: reminderTime.toISOString(),
          message_template: `Hi ${patient.first_name}, this is a reminder about your appointment tomorrow at ${appointment.time}. Please let us know if you need to reschedule.`
        }]);

      if (reminderError) throw reminderError;

      toast({
        title: "Success",
        description: "Appointment reminder scheduled",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to schedule reminder",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Hub - {patient.first_name} {patient.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="send" className="space-y-4">
            <TabsList>
              <TabsTrigger value="send">Send Message</TabsTrigger>
              <TabsTrigger value="history">Communication History</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
            </TabsList>

            <TabsContent value="send" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select value={messageType} onValueChange={(value: 'sms' | 'email') => setMessageType(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          SMS
                        </div>
                      </SelectItem>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="text-sm text-muted-foreground">
                    To: {messageType === 'sms' 
                      ? (patient.phone || 'No phone number on file')
                      : (patient.email || 'No email address on file')
                    }
                  </div>
                </div>

                <Textarea
                  placeholder={`Enter your ${messageType} message...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Character count: {message.length}
                    {messageType === 'sms' && message.length > 160 && (
                      <span className="text-amber-600"> (Multiple SMS)</span>
                    )}
                  </div>
                  
                  <Button 
                    onClick={sendMessage} 
                    disabled={sendingMessage || !message.trim() || (!patient.phone && messageType === 'sms') || (!patient.email && messageType === 'email')}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sendingMessage ? 'Sending...' : `Send ${messageType.toUpperCase()}`}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : communicationLogs.length > 0 ? (
                <div className="space-y-3">
                  {communicationLogs.map((log) => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {log.type === 'sms' ? (
                                <Phone className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Mail className="h-4 w-4 text-green-600" />
                              )}
                              <span className="text-sm font-medium capitalize">{log.type}</span>
                              <Badge className={getStatusColor(log.status)}>
                                {log.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(log.created_at)}
                              </span>
                            </div>
                            
                            <div className="text-sm text-muted-foreground mb-2">
                              To: {log.recipient}
                            </div>
                            
                            <div className="text-sm bg-muted p-3 rounded">
                              {log.message}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No communication history</h3>
                  <p className="text-muted-foreground">
                    Start by sending a message to this patient
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reminders" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Appointment Reminder</h3>
                        <p className="text-sm text-muted-foreground">
                          Send reminder 24 hours before next appointment
                        </p>
                      </div>
                      <Button onClick={scheduleAppointmentReminder}>
                        <Bell className="w-4 h-4 mr-2" />
                        Schedule Reminder
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Follow-up Message</h3>
                        <p className="text-sm text-muted-foreground">
                          Send follow-up message after recent appointment
                        </p>
                      </div>
                      <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Follow-up
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Form Completion Reminder</h3>
                        <p className="text-sm text-muted-foreground">
                          Remind patient to complete outstanding forms
                        </p>
                      </div>
                      <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Send Form Reminder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};