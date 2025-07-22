import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageSquare, 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Loader2
} from 'lucide-react';

interface CommunicationLog {
  id: string;
  type: string;
  recipient: string;
  message: string;
  status: string;
  sent_at: string;
  patient_id?: string;
}

export const StaffCommunicationCenter: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('send');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  
  // SMS Form
  const [smsForm, setSmsForm] = useState({
    phone: '',
    message: ''
  });
  
  // Email Form
  const [emailForm, setEmailForm] = useState({
    email: '',
    subject: '',
    message: ''
  });

  const handleSendSMS = async () => {
    if (!smsForm.phone || !smsForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in both phone number and message.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          to: smsForm.phone,
          message: smsForm.message
        }
      });

      if (error) throw error;

      toast({
        title: "SMS Sent",
        description: "Your message has been sent successfully.",
      });

      setSmsForm({ phone: '', message: '' });
      fetchCommunicationLogs();
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: "Failed to Send SMS",
        description: error.message || "An error occurred while sending the message.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailForm.email || !emailForm.subject || !emailForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all email fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: emailForm.email,
          subject: emailForm.subject,
          message: emailForm.message
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully.",
      });

      setEmailForm({ email: '', subject: '', message: '' });
      fetchCommunicationLogs();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to Send Email",
        description: error.message || "An error occurred while sending the email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunicationLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching communication logs:', error);
    }
  };

  React.useEffect(() => {
    fetchCommunicationLogs();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-muted-foreground">Messages Today</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-muted-foreground">Delivery Rate</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">247</div>
              <div className="text-sm text-muted-foreground">Active Recipients</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">34%</div>
              <div className="text-sm text-muted-foreground">Response Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">Send Messages</TabsTrigger>
          <TabsTrigger value="history">Communication History</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Messaging</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SMS Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Send SMS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sms-phone">Phone Number</Label>
                  <Input
                    id="sms-phone"
                    placeholder="+1 (555) 123-4567"
                    value={smsForm.phone}
                    onChange={(e) => setSmsForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="sms-message">Message</Label>
                  <Textarea
                    id="sms-message"
                    placeholder="Type your message here..."
                    rows={4}
                    value={smsForm.message}
                    onChange={(e) => setSmsForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {smsForm.message.length}/160 characters
                  </div>
                </div>
                <Button onClick={handleSendSMS} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Send SMS
                </Button>
              </CardContent>
            </Card>

            {/* Email Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email-to">Email Address</Label>
                  <Input
                    id="email-to"
                    placeholder="patient@example.com"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    placeholder="Subject line"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email-message">Message</Label>
                  <Textarea
                    id="email-message"
                    placeholder="Type your email message here..."
                    rows={4}
                    value={emailForm.message}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSendEmail} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {log.type === 'sms' ? 
                        <MessageSquare className="h-4 w-4 text-blue-600" /> : 
                        <Mail className="h-4 w-4 text-green-600" />
                      }
                      {getStatusIcon(log.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{log.recipient}</span>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                        <Badge variant="outline">
                          {log.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {log.message.length > 100 ? `${log.message.substring(0, 100)}...` : log.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.sent_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {logs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No communication history found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Bulk Messaging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Bulk messaging interface coming soon...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Send messages to multiple patients at once, schedule campaigns, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};