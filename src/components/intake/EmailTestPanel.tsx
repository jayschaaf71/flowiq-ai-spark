
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Send, Eye, CheckCircle, AlertCircle, Settings, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Template } from '@/hooks/useTemplates';
import { supabase } from '@/integrations/supabase/client';

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
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [emailIntegration, setEmailIntegration] = useState<any>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const { toast } = useToast();

  // Load email templates and integration status on component mount
  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    try {
      setLoadingTemplates(true);
      
      // Load email templates from database
      const { data: templates, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setEmailTemplates(templates || []);

      // Check email integration status - Use direct query since types aren't updated yet
      const { data: integrations } = await (supabase as any)
        .from('integrations')
        .select('*')
        .eq('type', 'email')
        .eq('enabled', true)
        .single();
      
      setEmailIntegration(integrations);
      
    } catch (error) {
      console.error('Error loading email data:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load email templates and configuration",
        variant: "destructive",
      });
    } finally {
      setLoadingTemplates(false);
    }
  };

  const getDefaultVariableValue = (variable: string): string => {
    const defaults: Record<string, string> = {
      patientName: 'John Doe',
      patient_name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      appointmentDate: 'March 25, 2024',
      appointment_date: 'March 25, 2024',
      appointmentTime: '2:00 PM',
      appointment_time: '2:00 PM',
      doctorName: 'Dr. Smith',
      practiceName: 'Healthcare Plus',
      practice_name: 'Healthcare Plus',
      practice_phone: '(555) 123-4567',
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
      setCustomMessage(template.body || '');
      
      // Initialize variable values
      const newVariableValues: Record<string, string> = {};
      (template.variables || []).forEach((variable: string) => {
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

  const testEmailConnection = async () => {
    if (!emailIntegration) {
      toast({
        title: "No Email Integration",
        description: "Email integration is not configured",
        variant: "destructive",
      });
      return;
    }

    setTestingConnection(true);
    try {
      // Test by attempting to send to the send-scheduled-email function
      const { error } = await supabase.functions.invoke('send-scheduled-email', {
        body: { test: true }
      });
      
      const success = !error?.message?.includes('API key');
      
      if (success) {
        toast({
          title: "Connection Test Successful",
          description: "Email integration is working correctly",
        });
      } else {
        toast({
          title: "Connection Test Failed", 
          description: error?.message || "Email configuration issue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to test email connection",
        variant: "destructive",
      });
    } finally {
      setTestingConnection(false);
    }
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

    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select an email template",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    
    try {
      // Use the actual send-scheduled-email edge function
      const { error } = await supabase.functions.invoke('send-scheduled-email', {
        body: {
          templateId: selectedTemplate.id,
          recipient: recipientEmail,
          variables: variableValues
        }
      });

      if (error) throw error;
      
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
      {/* Integration Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Email System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {emailIntegration ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <div>
                <p className="font-medium">
                  {emailIntegration ? 'Email Integration Active' : 'Email Integration Not Configured'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {emailIntegration 
                    ? `Provider: ${emailIntegration.settings?.provider || 'Resend'} | Status: ${emailIntegration.enabled ? 'Enabled' : 'Disabled'}`
                    : 'Configure email integration in Settings to send emails'
                  }
                </p>
              </div>
            </div>
            {emailIntegration && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={testEmailConnection}
                disabled={testingConnection}
              >
                {testingConnection ? (
                  <>Testing...</>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Testing Card */}
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
                <Select onValueChange={handleTemplateSelect} disabled={loadingTemplates}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingTemplates ? "Loading templates..." : "Choose a template..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {emailTemplates.length === 0 && !loadingTemplates && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No email templates found. Create templates in the settings.
                  </p>
                )}
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

              {selectedTemplate && selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                <div className="space-y-3">
                  <Label>Template Variables</Label>
                  {selectedTemplate.variables.map((variable: string) => (
                    <div key={variable}>
                      <Label className="text-xs text-muted-foreground">{variable}</Label>
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
                disabled={sending || !recipientEmail || !customMessage || !selectedTemplate || !emailIntegration}
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
              
              {!emailIntegration && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Email integration is not configured. Please set up email integration in Settings first.
                  </AlertDescription>
                </Alert>
              )}
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
