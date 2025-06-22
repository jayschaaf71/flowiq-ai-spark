
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, MessageSquare, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { CommunicationService } from '@/services/communicationService';

interface CommunicationTestPanelProps {
  submissionId?: string;
}

export const CommunicationTestPanel: React.FC<CommunicationTestPanelProps> = ({
  submissionId
}) => {
  // Generate a valid UUID for testing if none provided
  const testSubmissionId = submissionId || crypto.randomUUID();
  
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('Hello! This is a test message from your intake system.');
  const [type, setType] = useState<'email' | 'sms'>('email');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendTest = async () => {
    if (!recipient || !message) {
      setResult({ success: false, message: 'Please fill in recipient and message' });
      return;
    }

    setIsSending(true);
    setResult(null);

    try {
      await CommunicationService.sendCommunication({
        submissionId: testSubmissionId,
        templateId: 'test-template',
        recipient,
        patientName: 'Test Patient',
        customMessage: message,
        type
      });

      setResult({ success: true, message: `Test ${type} sent successfully!` });
    } catch (error: any) {
      setResult({ success: false, message: error.message || 'Failed to send test message' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Test Communication System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={(value: 'email' | 'sms') => setType(value)}>
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
            <label className="text-sm font-medium">
              {type === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <Input
              placeholder={type === 'email' ? 'test@example.com' : '+1234567890'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Test Message</label>
          <Textarea
            placeholder="Enter your test message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        <Button 
          onClick={handleSendTest}
          disabled={isSending || !recipient || !message}
          className="w-full"
        >
          {isSending ? 'Sending...' : `Send Test ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </Button>

        {result && (
          <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {result.success ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
              {result.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Email requires valid Resend API key configuration</p>
          <p>• SMS is currently simulated for testing purposes</p>
          <p>• Check the Communication History tab to see delivery status</p>
          <p>• Using test submission ID: {testSubmissionId.substring(0, 8)}...</p>
        </div>
      </CardContent>
    </Card>
  );
};
