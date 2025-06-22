
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  AlertCircle, 
  CheckCircle, 
  Phone,
  MessageCircle,
  DollarSign,
  Clock
} from 'lucide-react';
import { CommunicationService } from '@/services/communicationService';
import { validatePhoneNumber, formatPhoneNumber, formatPhoneForDisplay } from '@/utils/phoneValidation';

interface EnhancedSMSTestPanelProps {
  submissionId?: string;
}

const smsTemplates = [
  {
    id: 'welcome-sms',
    name: 'Welcome SMS',
    message: 'Welcome {{patientName}}! We\'ve received your intake form. We\'ll contact you within 24 hours. Reply STOP to opt out.',
    category: 'welcome'
  },
  {
    id: 'appointment-reminder-sms',
    name: 'Appointment Reminder',
    message: 'Hi {{patientName}}, this is a reminder about your appointment tomorrow at {{time}}. Reply CONFIRM to confirm or RESCHEDULE if needed.',
    category: 'reminder'
  },
  {
    id: 'follow-up-sms',
    name: 'Follow-up Message',
    message: 'Hi {{patientName}}, thank you for your visit. How are you feeling? Reply with any questions or concerns. Reply STOP to opt out.',
    category: 'follow-up'
  },
  {
    id: 'test-sms',
    name: 'Test Message',
    message: 'This is a test SMS from your healthcare system. Reply STOP to opt out.',
    category: 'test'
  }
];

export const EnhancedSMSTestPanel: React.FC<EnhancedSMSTestPanelProps> = ({
  submissionId
}) => {
  const testSubmissionId = submissionId || crypto.randomUUID();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('test-sms');
  const [customMessage, setCustomMessage] = useState('');
  const [patientName, setPatientName] = useState('Test Patient');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [phoneValidation, setPhoneValidation] = useState<{ isValid: boolean; message?: string }>({ isValid: true });

  const selectedTemplateData = smsTemplates.find(t => t.id === selectedTemplate);
  const finalMessage = customMessage || selectedTemplateData?.message || '';
  const processedMessage = finalMessage
    .replace(/\{\{patientName\}\}/g, patientName)
    .replace(/\{\{time\}\}/g, '2:00 PM')
    .replace(/\{\{date\}\}/g, 'tomorrow');

  const characterCount = processedMessage.length;
  const segmentCount = Math.ceil(characterCount / 160);
  const estimatedCost = segmentCount * 0.0075;

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    const validation = validatePhoneNumber(value);
    setPhoneValidation(validation);
  };

  const handleSendSMS = async () => {
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setResult({ success: false, message: validation.message || 'Invalid phone number' });
      return;
    }

    if (!processedMessage.trim()) {
      setResult({ success: false, message: 'Message cannot be empty' });
      return;
    }

    setIsSending(true);
    setResult(null);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      const response = await CommunicationService.sendCommunication({
        submissionId: testSubmissionId,
        templateId: selectedTemplate,
        recipient: formattedPhone,
        patientName,
        customMessage: processedMessage,
        type: 'sms'
      });

      setResult({ 
        success: true, 
        message: 'SMS sent successfully (simulated)!',
        details: {
          recipient: formatPhoneForDisplay(formattedPhone),
          characterCount,
          segmentCount,
          estimatedCost: `$${estimatedCost.toFixed(4)}`
        }
      });
    } catch (error: any) {
      setResult({ success: false, message: error.message || 'Failed to send SMS' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Enhanced SMS Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phone Number Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            placeholder="+1 (555) 123-4567"
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={!phoneValidation.isValid ? 'border-red-500' : ''}
          />
          {!phoneValidation.isValid && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {phoneValidation.message}
            </p>
          )}
          {phoneValidation.isValid && phoneNumber && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Valid: {formatPhoneForDisplay(formatPhoneNumber(phoneNumber))}
            </p>
          )}
        </div>

        {/* Patient Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Patient Name</label>
          <Input
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>

        {/* Template Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">SMS Template</label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {smsTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {template.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Template Preview */}
        {selectedTemplateData && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Template Preview:</span>
              <Badge variant="outline">{selectedTemplateData.category}</Badge>
            </div>
            <p className="text-sm font-mono">{selectedTemplateData.message}</p>
          </div>
        )}

        {/* Custom Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Message (Optional)</label>
          <Textarea
            placeholder="Override template with custom message..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* Final Message Preview */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Final Message:</span>
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <span>{characterCount}/160 chars</span>
              <span>•</span>
              <span>{segmentCount} segment{segmentCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <p className="text-sm font-mono text-blue-700">{processedMessage}</p>
        </div>

        {/* Cost Estimation */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-green-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MessageSquare className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm font-medium">{characterCount}</div>
            <div className="text-xs text-gray-600">Characters</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm font-medium">{segmentCount}</div>
            <div className="text-xs text-gray-600">Segments</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm font-medium">${estimatedCost.toFixed(4)}</div>
            <div className="text-xs text-gray-600">Est. Cost</div>
          </div>
        </div>

        <Separator />

        {/* Send Button */}
        <Button 
          onClick={handleSendSMS}
          disabled={isSending || !phoneValidation.isValid || !phoneNumber || !processedMessage.trim()}
          className="w-full flex items-center gap-2"
        >
          {isSending ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              Sending SMS...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Test SMS
            </>
          )}
        </Button>

        {/* Result */}
        {result && (
          <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {result.success ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
              {result.message}
              {result.success && result.details && (
                <div className="mt-2 text-xs space-y-1">
                  <div>Sent to: {result.details.recipient}</div>
                  <div>Characters: {result.details.characterCount}</div>
                  <div>Segments: {result.details.segmentCount}</div>
                  <div>Cost: {result.details.estimatedCost}</div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* SMS Guidelines */}
        <div className="text-xs text-gray-500 space-y-1 p-3 bg-gray-50 rounded">
          <p className="font-medium">SMS Guidelines:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>SMS messages over 160 characters are split into multiple segments</li>
            <li>Each segment typically costs $0.0075 (varies by provider)</li>
            <li>Always include opt-out instructions (Reply STOP to opt out)</li>
            <li>SMS is currently simulated for testing purposes</li>
            <li>Use variables like {`{{patientName}}`} for personalization</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
