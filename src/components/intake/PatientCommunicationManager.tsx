
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Send, Clock, Loader2 } from 'lucide-react';
import { IntakeSubmission } from '@/types/intake';

interface CommunicationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'sms';
}

const COMMUNICATION_TEMPLATES: CommunicationTemplate[] = [
  {
    id: 'incomplete-form',
    name: 'Incomplete Form Reminder',
    subject: 'Complete Your Patient Intake Form',
    body: 'Hi {patient_name}, we noticed your intake form is incomplete. Please complete it at your earliest convenience.',
    type: 'email'
  },
  {
    id: 'appointment-follow-up',
    name: 'Appointment Follow-up',
    subject: 'Follow-up on Your Recent Submission',
    body: 'Thank you for submitting your intake form. We will review it and contact you within 24 hours.',
    type: 'email'
  },
  {
    id: 'high-priority-alert',
    name: 'High Priority Alert',
    subject: 'Urgent: Please Contact Our Office',
    body: 'Based on your submission, please contact our office immediately at (555) 123-4567.',
    type: 'email'
  },
  {
    id: 'welcome-sms',
    name: 'Welcome SMS',
    subject: '',
    body: 'Welcome {patient_name}! Your intake form has been received. We will contact you soon.',
    type: 'sms'
  }
];

interface PatientCommunicationManagerProps {
  submission: IntakeSubmission & {
    currentAssignment?: any;
  };
  onSendCommunication: (
    submissionId: string,
    templateId: string,
    recipient: string,
    patientName: string,
    customMessage?: string,
    type?: 'email' | 'sms'
  ) => void;
  isSending?: boolean;
}

export const PatientCommunicationManager: React.FC<PatientCommunicationManagerProps> = ({
  submission,
  onSendCommunication,
  isSending = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [communicationType, setCommunicationType] = useState<'email' | 'sms'>('email');

  const handleSendCommunication = () => {
    const template = COMMUNICATION_TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return;

    const recipient = communicationType === 'email' ? submission.patient_email : submission.patient_phone;
    if (!recipient) {
      // Handle missing contact info
      return;
    }

    onSendCommunication(
      submission.id,
      selectedTemplate,
      recipient,
      submission.patient_name,
      customMessage || template.body,
      communicationType
    );

    // Reset form
    setCustomMessage('');
    setSelectedTemplate('');
  };

  const selectedTemplateData = COMMUNICATION_TEMPLATES.find(t => t.id === selectedTemplate);
  const canSend = selectedTemplate && 
    (communicationType === 'email' ? submission.patient_email : submission.patient_phone);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Send Communication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            {communicationType === 'email' && !submission.patient_email && (
              <p className="text-xs text-red-600 mt-1">No email address available</p>
            )}
            {communicationType === 'sms' && !submission.patient_phone && (
              <p className="text-xs text-red-600 mt-1">No phone number available</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Template</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select template..." />
              </SelectTrigger>
              <SelectContent>
                {COMMUNICATION_TEMPLATES
                  .filter(t => t.type === communicationType)
                  .map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedTemplateData && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="mb-2">
              {selectedTemplateData.subject && (
                <Badge variant="outline" className="mb-2">
                  {selectedTemplateData.subject}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-700">
              {selectedTemplateData.body.replace('{patient_name}', submission.patient_name)}
            </p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Custom Message (Optional)</label>
          <Textarea
            placeholder={selectedTemplateData ? "Override template message..." : "Add a custom message..."}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="mt-1"
          />
        </div>

        <Button 
          onClick={handleSendCommunication}
          disabled={!canSend || isSending}
          className="w-full"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send {communicationType === 'email' ? 'Email' : 'SMS'}
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Communications are typically delivered within 2-5 minutes
        </div>
      </CardContent>
    </Card>
  );
};
