import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Plus, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  usageCount: number;
}

const builtInTemplates: Template[] = [
  {
    id: 'welcome-email',
    name: 'New Patient Welcome',
    type: 'email',
    category: 'welcome',
    subject: 'Welcome to {{practiceName}}, {{patientName}}!',
    content: `Dear {{patientName}},

Welcome to {{practiceName}}! We're excited to help you on your journey to better health.

Your intake forms have been received. Our team will review them and contact you within 24 hours to schedule your initial consultation.

What to expect:
• Comprehensive chiropractic evaluation
• Personalized treatment plan
• Education on your condition and recovery

If you have any questions, please call us at {{phoneNumber}}.

Best regards,
The {{practiceName}} Team`,
    variables: ['patientName', 'practiceName', 'phoneNumber'],
    usageCount: 45
  },
  {
    id: 'appointment-reminder',
    name: 'Appointment Reminder',
    type: 'sms',
    category: 'reminder',
    content: 'Hi {{firstName}}, reminder: you have a chiropractic appointment tomorrow at {{appointmentTime}} with Dr. {{doctorName}}. Reply CONFIRM to confirm. {{practiceName}}',
    variables: ['firstName', 'appointmentTime', 'doctorName', 'practiceName'],
    usageCount: 128
  },
  {
    id: 'follow-up-care',
    name: 'Post-Visit Care Instructions',
    type: 'email',
    category: 'follow-up',
    subject: 'Your Treatment Plan - {{patientName}}',
    content: `Dear {{patientName}},

Thank you for visiting {{practiceName}} today. Here are your post-visit care instructions:

Treatment Summary:
• {{treatmentSummary}}

Home Care Instructions:
• Apply ice for 15-20 minutes, 3-4 times daily
• Gentle stretching as demonstrated
• Avoid heavy lifting for 48 hours

Your next appointment: {{nextAppointment}}

Questions? Call us at {{phoneNumber}}

Recovery Team,
{{practiceName}}`,
    variables: ['patientName', 'practiceName', 'treatmentSummary', 'nextAppointment', 'phoneNumber'],
    usageCount: 67
  }
];

interface CommunicationTemplatesDialogProps {
  trigger: React.ReactNode;
}

export const CommunicationTemplatesDialog = ({ trigger }: CommunicationTemplatesDialogProps) => {
  const [activeTab, setActiveTab] = useState("send");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [recipientType, setRecipientType] = useState<'individual' | 'group' | 'status'>('individual');
  const [recipientInput, setRecipientInput] = useState('');
  const { toast } = useToast();

  const handleSendTemplate = () => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select a template to send.",
        variant: "destructive"
      });
      return;
    }

    if (!recipientInput.trim()) {
      toast({
        title: "No Recipients",
        description: "Please specify recipients for the message.",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending
    toast({
      title: "Message Sent Successfully",
      description: `${selectedTemplate.name} sent to ${recipientInput}`,
    });

    // Reset form
    setSelectedTemplate(null);
    setRecipientInput('');
  };

  const getTemplateIcon = (type: string) => {
    return type === 'email' ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'welcome': return 'bg-blue-100 text-blue-800';
      case 'reminder': return 'bg-green-100 text-green-800';
      case 'follow-up': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Communication Templates
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send">Send Templates</TabsTrigger>
            <TabsTrigger value="manage">Manage Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Template Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold">Select Template</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {builtInTemplates.map((template) => (
                    <Card 
                      key={template.id}
                      className={`cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getTemplateIcon(template.type)}
                            <span className="font-medium">{template.name}</span>
                          </div>
                          <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {template.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Used {template.usageCount} times
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {template.type.toUpperCase()}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Send Configuration */}
              <div className="space-y-4">
                <h3 className="font-semibold">Configure & Send</h3>
                
                {selectedTemplate && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getTemplateIcon(selectedTemplate.type)}
                        {selectedTemplate.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedTemplate.subject && (
                        <div>
                          <label className="text-sm font-medium">Subject</label>
                          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {selectedTemplate.subject}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm font-medium">Preview</label>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                          {selectedTemplate.content}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Variables</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTemplate.variables.map((variable) => (
                            <Badge key={variable} variant="outline" className="text-xs">
                              {`{{${variable}}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-3">
                  <label className="text-sm font-medium">Recipients</label>
                  <Select value={recipientType} onValueChange={(value: 'individual' | 'group' | 'status') => setRecipientType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Patient</SelectItem>
                      <SelectItem value="group">Patient Group</SelectItem>
                      <SelectItem value="status">By Status</SelectItem>
                    </SelectContent>
                  </Select>

                  {recipientType === 'individual' && (
                    <Input
                      placeholder="Enter patient email or phone"
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                    />
                  )}

                  {recipientType === 'group' && (
                    <Select value={recipientInput} onValueChange={setRecipientInput}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-patients">New Patients (This Week)</SelectItem>
                        <SelectItem value="pending-appointments">Pending Appointments</SelectItem>
                        <SelectItem value="follow-up-due">Follow-up Due</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {recipientType === 'status' && (
                    <Select value={recipientInput} onValueChange={setRecipientInput}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intake-completed">Intake Completed</SelectItem>
                        <SelectItem value="appointment-scheduled">Appointment Scheduled</SelectItem>
                        <SelectItem value="treatment-active">Active Treatment</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <Button 
                  onClick={handleSendTemplate} 
                  className="w-full"
                  disabled={!selectedTemplate || !recipientInput.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Template
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Template Library</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {builtInTemplates.map((template) => (
                <Card key={template.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTemplateIcon(template.type)}
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.content.substring(0, 80)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        {template.usageCount} sends
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};