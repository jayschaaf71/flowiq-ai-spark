import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const smsTemplates = templates.filter(t => t.type === 'sms');

  const handleTemplateSelect = (templateId: string) => {
    const template = smsTemplates.find(t => t.id === templateId);
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
              {smsTemplates.length > 0 && (
                <div>
                  <Label>Select SMS Template</Label>
                  <Select onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {smsTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Test Phone Number</Label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  type="tel"
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
                        onChange={(e) => setVariableValues(prev => ({
                          ...prev,
                          [variable]: e.target.value
                        }))}
                        placeholder={`Enter ${variable}`}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Message Content</Label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter your SMS message..."
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-4">
                  <span className={stats.characterCount > 160 ? "text-orange-600" : "text-gray-600"}>
                    {stats.characterCount} characters
                  </span>
                  <span className="text-gray-600">
                    {stats.segmentCount} segments
                  </span>
                </div>
                <span className="text-gray-600">
                  Est. cost: ${stats.estimatedCost.toFixed(4)}
                </span>
              </div>

              {stats.characterCount > 160 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Message exceeds 160 characters and will be sent as {stats.segmentCount} segments.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Message Preview</h4>
              <Button 
                onClick={handleSendTest}
                disabled={sending || !phoneNumber || !customMessage}
                className="flex items-center gap-2"
              >
                {sending ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {sending ? 'Sending...' : 'Send Test'}
              </Button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm whitespace-pre-wrap">
                {renderPreview() || 'Enter a message to see preview...'}
              </p>
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
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {result.characterCount} chars
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ${result.estimatedCost.toFixed(4)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
