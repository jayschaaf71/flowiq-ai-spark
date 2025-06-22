
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SMSTemplateSelector } from './SMSTemplateSelector';
import { SMSTestForm } from './SMSTestForm';
import { SMSMessagePreview } from './SMSMessagePreview';
import { SMSTestResults } from './SMSTestResults';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  content: string;
  variables: string[];
}

interface TestResult {
  success: boolean;
  message: string;
  timestamp: Date;
  characterCount: number;
  segmentCount: number;
  estimatedCost: number;
}

interface EnhancedSMSTestPanelProps {
  templates?: Template[];
  submissionId?: string;
}

export const EnhancedSMSTestPanel: React.FC<EnhancedSMSTestPanelProps> = ({ 
  templates = [], 
  submissionId 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const { toast } = useToast();

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId && t.type === 'sms');
    if (template) {
      setSelectedTemplate(template);
      setCustomMessage(template.content);
      // Initialize variable values
      const newVariableValues: Record<string, string> = {};
      template.variables.forEach(variable => {
        newVariableValues[variable] = getDefaultVariableValue(variable);
      });
      setVariableValues(newVariableValues);
    }
  };

  const getDefaultVariableValue = (variable: string): string => {
    const defaults: Record<string, string> = {
      patientName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      appointmentDate: 'March 25, 2024',
      appointmentTime: '2:00 PM',
      doctorName: 'Dr. Smith',
      practiceName: 'Healthcare Plus',
      phoneNumber: '(555) 123-4567'
    };
    return defaults[variable] || `{${variable}}`;
  };

  const renderPreview = () => {
    let preview = customMessage;
    Object.entries(variableValues).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return preview;
  };

  const getMessageStats = () => {
    const preview = renderPreview();
    const characterCount = preview.length;
    const segmentCount = Math.ceil(characterCount / 160);
    const estimatedCost = segmentCount * 0.0075;
    
    return { characterCount, segmentCount, estimatedCost };
  };

  const handleVariableValueChange = (variable: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleSendTest = async () => {
    if (!phoneNumber || !customMessage) {
      toast({
        title: "Missing Information",
        description: "Please enter a phone number and message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    
    try {
      // Simulate API call - replace with actual SMS service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const stats = getMessageStats();
      const result: TestResult = {
        success: true,
        message: `Test SMS sent to ${phoneNumber}`,
        timestamp: new Date(),
        ...stats
      };
      
      setTestResults(prev => [result, ...prev.slice(0, 4)]);
      
      toast({
        title: "Test SMS Sent",
        description: `Message sent to ${phoneNumber}`,
      });
      
    } catch (error) {
      const errorResult: TestResult = {
        success: false,
        message: `Failed to send SMS: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        ...getMessageStats()
      };
      
      setTestResults(prev => [errorResult, ...prev.slice(0, 4)]);
      
      toast({
        title: "Send Failed",
        description: "Failed to send test SMS",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const stats = getMessageStats();
  const preview = renderPreview();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Enhanced SMS Test Panel
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
              <SMSTemplateSelector 
                templates={templates}
                onTemplateSelect={handleTemplateSelect}
              />
              
              <SMSTestForm
                phoneNumber={phoneNumber}
                onPhoneNumberChange={setPhoneNumber}
                customMessage={customMessage}
                onCustomMessageChange={setCustomMessage}
                selectedTemplate={selectedTemplate}
                variableValues={variableValues}
                onVariableValueChange={handleVariableValueChange}
              />
            </div>

            <SMSMessagePreview
              preview={preview}
              stats={stats}
              onSendTest={handleSendTest}
              sending={sending}
              canSend={!!(phoneNumber && customMessage)}
            />
          </div>
        </CardContent>
      </Card>

      <SMSTestResults testResults={testResults} />
    </div>
  );
};
