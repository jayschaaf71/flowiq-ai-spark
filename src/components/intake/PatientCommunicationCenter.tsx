
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Phone, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { useToast } from '@/hooks/use-toast';

interface CommunicationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms';
}

export const PatientCommunicationCenter: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  
  const { submissions } = useIntakeForms();
  const { toast } = useToast();

  const communicationTemplates: CommunicationTemplate[] = [
    {
      id: 'welcome',
      name: 'Welcome & Confirmation',
      subject: 'Thank you for completing your intake form',
      content: 'Dear {{patient_name}},\n\nThank you for completing your intake form. We have received your information and will review it shortly. We will contact you within 24 hours to schedule your appointment.\n\nBest regards,\nThe Care Team',
      type: 'email'
    },
    {
      id: 'follow_up',
      name: 'Follow-up Reminder',
      subject: 'Additional information needed',
      content: 'Dear {{patient_name}},\n\nWe are reviewing your intake form and need some additional information. Please call us at your earliest convenience.\n\nThank you,\nThe Care Team',
      type: 'email'
    },
    {
      id: 'appointment_ready',
      name: 'Ready to Schedule',
      subject: 'Your intake is complete - Let\'s schedule your appointment',
      content: 'Dear {{patient_name}},\n\nYour intake form has been processed and we are ready to schedule your appointment. Please call us or use our online booking system.\n\nBest regards,\nThe Care Team',
      type: 'email'
    }
  ];

  const incompleteSubmissions = submissions.filter(s => s.status === 'pending' || s.status === 'incomplete');
  const completedSubmissions = submissions.filter(s => s.status === 'completed');

  const handleSendMessage = async () => {
    if (!selectedTemplate && !customMessage) {
      toast({
        title: "Message Required",
        description: "Please select a template or write a custom message.",
        variant: "destructive"
      });
      return;
    }

    if (selectedRecipients.length === 0) {
      toast({
        title: "Recipients Required",
        description: "Please select at least one recipient.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate sending messages
      console.log('Sending messages to:', selectedRecipients);
      
      toast({
        title: "Messages Sent",
        description: `Successfully sent messages to ${selectedRecipients.length} patients.`
      });

      // Reset form
      setSelectedTemplate('');
      setCustomMessage('');
      setCustomSubject('');
      setSelectedRecipients([]);
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send messages. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBulkAction = (action: string, status: string) => {
    const targetSubmissions = submissions.filter(s => s.status === status);
    console.log(`Performing ${action} on ${targetSubmissions.length} submissions`);
    
    toast({
      title: "Action Completed",
      description: `${action} applied to ${targetSubmissions.length} patients.`
    });
  };

  const getSelectedTemplate = () => {
    return communicationTemplates.find(t => t.id === selectedTemplate);
  };

  return (
    <div className="space-y-6">
      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Follow-up</p>
                <p className="text-2xl font-bold text-orange-600">{incompleteSubmissions.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready to Schedule</p>
                <p className="text-2xl font-bold text-green-600">{completedSubmissions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages Sent Today</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-purple-600">87%</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose">Compose Message</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Message History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Patient Communication</CardTitle>
              <CardDescription>
                Send emails or SMS messages to patients about their intake status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Message Template</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template or write custom message" />
                  </SelectTrigger>
                  <SelectContent>
                    {communicationTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Subject (if template selected or custom message) */}
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input
                  value={selectedTemplate ? getSelectedTemplate()?.subject || '' : customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Enter email subject"
                  disabled={!!selectedTemplate}
                />
              </div>

              {/* Message Content */}
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  value={selectedTemplate ? getSelectedTemplate()?.content || '' : customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Write your custom message here..."
                  rows={6}
                  disabled={!!selectedTemplate}
                />
                {selectedTemplate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Template variables: {`{{patient_name}}, {{form_type}}, {{submission_date}}`}
                  </p>
                )}
              </div>

              {/* Recipient Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Recipients</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                  {submissions.slice(0, 10).map(submission => (
                    <label key={submission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(submission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecipients([...selectedRecipients, submission.id]);
                          } else {
                            setSelectedRecipients(selectedRecipients.filter(id => id !== submission.id));
                          }
                        }}
                      />
                      <span className="text-sm">
                        {submission.patient_name} ({submission.patient_email})
                      </span>
                      <Badge variant={submission.status === 'completed' ? 'default' : 'secondary'}>
                        {submission.status}
                      </Badge>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedRecipients.length} recipients selected
                </p>
              </div>

              {/* Send Button */}
              <Button 
                onClick={handleSendMessage} 
                className="w-full"
                disabled={selectedRecipients.length === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Messages ({selectedRecipients.length})
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Pending Submissions ({incompleteSubmissions.length})
                </CardTitle>
                <CardDescription>Actions for incomplete intake forms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => handleBulkAction('Send Reminder', 'pending')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Completion Reminders
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleBulkAction('Schedule Callback', 'pending')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Follow-up Calls
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Completed Submissions ({completedSubmissions.length})
                </CardTitle>
                <CardDescription>Actions for processed intake forms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={() => handleBulkAction('Send Welcome', 'completed')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Send Welcome Messages
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleBulkAction('Schedule Appointment', 'completed')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Send Scheduling Links
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>Pre-configured messages for common communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communicationTemplates.map(template => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                          <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-50 p-2 rounded">
                            {template.content.substring(0, 100)}...
                          </p>
                        </div>
                        <Badge variant={template.type === 'email' ? 'default' : 'secondary'}>
                          {template.type.toUpperCase()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>Recent messages sent to patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Welcome & Confirmation</p>
                    <p className="text-sm text-gray-600">Sent to Sarah Wilson • 2 hours ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Delivered</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Follow-up Reminder</p>
                    <p className="text-sm text-gray-600">Sent to Mike Johnson • 1 day ago</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Read</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Bulk Reminder Campaign</p>
                    <p className="text-sm text-gray-600">Sent to 15 patients • 3 days ago</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700">Campaign</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
