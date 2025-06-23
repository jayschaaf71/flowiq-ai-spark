
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Send, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Template } from '@/hooks/useTemplates';

interface TestResult {
  success: boolean;
  message: string;
  timestamp: Date;
  type: 'email';
  recipient: string;
}

interface EmailTestPanelProps {
  templates?: Template[];
  submissionId?: string;
}

export const EmailTestPanel: React.FC<EmailTestPanelProps> = ({ 
  templates = [], 
  submissionId 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const { toast } = useToast();

  const emailTemplates = templates.filter(t => t.type === 'email');

  const getDefaultVariableValue = (variable: string): string => {
    const defaults: Record<string, string> = {
      patientName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      appointmentDate: 'March 25, 2024',
      appointmentTime: '2:00 PM',
      doctorName: 'Dr. Smith',
      practiceName: 'Healthcare Plus',
      phoneNumber: '(555) 123-4567',
      address: '123 Medical Center Dr',
      confirmationLink: 'https://example.com/confirm',
      rescheduleLink: 'https://example.com/reschedule',
      portalLink: 'https://example.com/portal'
    };
    return defaults[variable] || `{${variable}}`;
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCustomSubject(template.subject || '');
      setCustomMessage(template.content);
      
      // Initialize variable values
      const newVariableValues: Record<string, string> = {};
      template.variables.forEach(variable => {
        newVariableValues[variable] = getDefaultVariableValue(variable);
      });
      setVariableValues(newVariableValues);
    }
  };

  const renderPreview = (content: string) => {
    let preview = content;
    Object.entries(variableValues).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return preview;
  };

  const handleVariableValueChange = (variable: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleSendTest = async () => {
    if (!recipientEmail || !customMessage) {
      toast({
        title: "Missing Information",
        description: "Please enter a recipient email and message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    
    try {
      // Simulate API call - replace with actual email service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result: TestResult = {
        success: true,
        message: `Test email sent to ${recipientEmail}`,
        timestamp: new Date(),
        type: 'email',
        recipient: recipientEmail
      };
      
      setTestResults(prev => [result, ...prev.slice(0, 4)]);
      
      toast({
        title: "Test Email Sent",
        description: `Email sent to ${recipientEmail}`,
      });
      
    } catch (error) {
      const errorResult: TestResult = {
        success: false,
        message: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        type: 'email',
        recipient: recipientEmail
      };
      
      setTestResults(prev => [errorResult, ...prev.slice(0, 4)]);
      
      toast({
        title: "Send Failed",
        description: "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const previewSubject = renderPreview(customSubject);
  const previewMessage = renderPreview(customMessage);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Test Panel
            {submissionId && (
              <Badge variant="outline" className="ml-2">
                ID: {submissionId.substring(0, 8)}...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Select Email Template</Label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Recipient Email</Label>
                <Input
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="test@example.com"
                  type="email"
                />
              </div>

              <div>
                <Label>Subject Line</Label>
                <Input
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Enter email subject..."
                />
              </div>

              {selectedTemplate && selectedTemplate.variables.length > 0 && (
                <div className="space-y-3">
                  <Label>Template Variables</Label>
                  {selectedTemplate.variables.map(variable => (
                    <div key={variable}>
                      <Label className="text-xs text-gray-600">{variable}</Label>
                      <Input
                        value={variableValues[variable] || ''}
                        onChange={(e) => handleVariableValueChange(variable, e.target.value)}
                        placeholder={`Enter ${variable}`}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <Label>Message Content</Label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter your email message..."
                  rows={8}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Email Preview
                </Label>
                <div className="border rounded-lg p-4 min-h-48 bg-gray-50">
                  {previewSubject && (
                    <div className="mb-4 pb-2 border-b">
                      <strong>Subject:</strong> {previewSubject}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {previewMessage || 'Start composing to see preview...'}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSendTest}
                disabled={sending || !recipientEmail || !customMessage}
                className="w-full"
              >
                {sending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{result.message}</p>
                      <p className="text-xs text-gray-500">
                        {result.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {result.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
