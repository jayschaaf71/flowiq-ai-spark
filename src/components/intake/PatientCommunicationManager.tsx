
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  MessageSquare, 
  User, 
  Phone, 
  Calendar,
  Send,
  AlertCircle 
} from 'lucide-react';

interface PatientCommunicationManagerProps {
  submission: any;
  onSendCommunication: (
    submissionId: string,
    templateId: string,
    recipient: string,
    patientName: string,
    customMessage?: string,
    type?: 'email' | 'sms'
  ) => void;
}

export const PatientCommunicationManager: React.FC<PatientCommunicationManagerProps> = ({
  submission,
  onSendCommunication
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');
  const [customMessage, setCustomMessage] = useState('');
  const [communicationType, setCommunicationType] = useState<'email' | 'sms'>('email');
  const [customRecipient, setCustomRecipient] = useState('');

  const templates = [
    {
      id: 'welcome',
      name: 'Welcome Message',
      description: 'Welcome new patients and confirm receipt of intake form',
      defaultMessage: 'Welcome! We\'ve received your intake form and will contact you within 24 hours.'
    },
    {
      id: 'appointment-reminder',
      name: 'Appointment Reminder',
      description: 'Remind patients of upcoming appointments',
      defaultMessage: 'This is a reminder about your upcoming appointment. Please arrive 15 minutes early.'
    },
    {
      id: 'follow-up',
      name: 'Follow-up Message',
      description: 'Follow up after appointments or treatments',
      defaultMessage: 'Thank you for your recent visit. Please contact us if you have any questions.'
    },
    {
      id: 'test-template',
      name: 'Test Message',
      description: 'General test message for system testing',
      defaultMessage: 'This is a test message from the intake system.'
    }
  ];

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const handleSend = () => {
    const recipient = customRecipient || submission?.patient_email || '';
    const patientName = submission?.patient_name || 'Patient';
    const message = customMessage || selectedTemplateData?.defaultMessage || '';

    if (!recipient) {
      alert('Please provide a recipient email or phone number');
      return;
    }

    onSendCommunication(
      submission?.id || 'test-submission',
      selectedTemplate,
      recipient,
      patientName,
      message,
      communicationType
    );

    // Reset form
    setCustomMessage('');
    setCustomRecipient('');
  };

  return (
    <div className="space-y-6">
      {/* Patient Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Name:</span>
              <span>{submission?.patient_name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Email:</span>
              <span>{submission?.patient_email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Phone:</span>
              <span>{submission?.patient_phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Status:</span>
              <Badge variant="outline">{submission?.status || 'pending'}</Badge>
            </div>
          </div>

          {submission?.currentAssignment && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">
                  Assigned to: {submission.currentAssignment.staff_name}
                </span>
                <Badge variant="secondary">{submission.currentAssignment.status}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Communication Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Communication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Communication Type</label>
              <Select value={communicationType} onValueChange={(value: 'email' | 'sms') => setCommunicationType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      SMS
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Template</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedTemplateData && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">{selectedTemplateData.description}</p>
              <p className="text-sm font-mono bg-white p-2 rounded border">
                {selectedTemplateData.defaultMessage}
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">
              Recipient ({communicationType === 'email' ? 'Email' : 'Phone'})
            </label>
            <Input
              placeholder={
                communicationType === 'email' 
                  ? submission?.patient_email || 'Enter email address'
                  : submission?.patient_phone || 'Enter phone number'
              }
              value={customRecipient}
              onChange={(e) => setCustomRecipient(e.target.value)}
            />
            {!customRecipient && (
              <p className="text-xs text-gray-500 mt-1">
                Will use patient's {communicationType === 'email' ? 'email' : 'phone'} from submission
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Custom Message (Optional)</label>
            <Textarea
              placeholder="Enter custom message or leave blank to use template default..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4" />
              <span>
                {communicationType === 'email' ? 'Email will be sent via Resend' : 'SMS is currently simulated'}
              </span>
            </div>
            <Button onClick={handleSend} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send {communicationType === 'email' ? 'Email' : 'SMS'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
