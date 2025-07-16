import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TestTube, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Upload,
  Smartphone,
  Mic,
  FileText,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export const PlaudTestingPanel: React.FC = () => {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({});
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [isTestingUpload, setIsTestingUpload] = useState(false);
  const [customPayload, setCustomPayload] = useState('');
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState('');

  const webhookUrl = "https://jzusvsbkprwkjhhozaup.supabase.co/functions/v1/plaud-webhook";

  const defaultTestPayload = {
    test: true,
    timestamp: new Date().toISOString(),
    message: "Test webhook from ScribeIQ",
    source: "plaud_test"
  };

  const mockPlaudPayload = {
    recording_id: "test_" + Date.now(),
    filename: "test_recording.m4a",
    duration: "120",
    download_url: "https://example.com/test-audio.m4a",
    created_at: new Date().toISOString(),
    tenant_name: "Test Tenant"
  };

  const updateTestResult = (testName: string, result: TestResult) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: result
    }));
  };

  const testWebhookEndpoint = async () => {
    setIsTestingWebhook(true);
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(defaultTestPayload)
      });

      const data = await response.json();
      
      if (response.ok) {
        updateTestResult('webhook_endpoint', {
          success: true,
          data,
          timestamp: new Date().toISOString()
        });
        
        toast({
          title: "Webhook Test Successful",
          description: "PlaudIQ webhook endpoint is responding correctly",
        });
      } else {
        throw new Error(data.error || 'Webhook test failed');
      }
      
    } catch (error) {
      console.error('Webhook test error:', error);
      updateTestResult('webhook_endpoint', {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Webhook Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const testPlaudWebhookFunction = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('plaud-webhook', {
        body: mockPlaudPayload
      });

      if (error) throw error;

      updateTestResult('plaud_function', {
        success: true,
        data,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Plaud Function Test Successful",
        description: "Mock Plaud recording processed successfully",
      });

    } catch (error) {
      console.error('Plaud function test error:', error);
      updateTestResult('plaud_function', {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Plaud Function Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testZapierWebhook = async () => {
    if (!zapierWebhookUrl) {
      toast({
        title: "Missing Zapier URL",
        description: "Please enter your Zapier webhook URL to test",
        variant: "destructive",
      });
      return;
    }

    try {
      const testData = {
        test: true,
        from: "ScribeIQ",
        timestamp: new Date().toISOString(),
        plaud_data: mockPlaudPayload
      };

      const response = await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(testData)
      });

      // Since we're using no-cors, we can't read the response
      updateTestResult('zapier_webhook', {
        success: true,
        data: { message: "Test sent to Zapier" },
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Zapier Test Sent",
        description: "Test data sent to your Zapier webhook. Check your Zap history.",
      });

    } catch (error) {
      console.error('Zapier test error:', error);
      updateTestResult('zapier_webhook', {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Zapier Test Failed", 
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testCustomPayload = async () => {
    if (!customPayload) {
      toast({
        title: "Missing Payload",
        description: "Please enter custom test data",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = JSON.parse(customPayload);
      
      const { data, error } = await supabase.functions.invoke('plaud-webhook', {
        body: payload
      });

      if (error) throw error;

      updateTestResult('custom_payload', {
        success: true,
        data,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Custom Test Successful",
        description: "Custom payload processed successfully",
      });

    } catch (error) {
      console.error('Custom payload test error:', error);
      updateTestResult('custom_payload', {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Custom Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const runFullPlaudTest = async () => {
    toast({
      title: "Running Full Plaud Test Suite",
      description: "Testing all Plaud integration components...",
    });

    // Test 1: Webhook endpoint
    await testWebhookEndpoint();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Plaud function
    await testPlaudWebhookFunction();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 3: Voice transcription (if available)
    try {
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: {
          audio: 'test-audio-data',
          language: 'en'
        }
      });

      updateTestResult('voice_transcription', {
        success: !error,
        data: error ? undefined : data,
        error: error?.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      updateTestResult('voice_transcription', {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    toast({
      title: "Full Test Suite Complete",
      description: "Check results below for detailed status",
    });
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: "Copied to Clipboard",
      description: "Webhook URL has been copied",
    });
  };

  const getResultBadge = (result?: TestResult) => {
    if (!result) return <Badge variant="outline">Not Tested</Badge>;
    
    return result.success ? 
      <Badge className="bg-green-100 text-green-800">✓ Passed</Badge> :
      <Badge variant="destructive">✗ Failed</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Plaud Integration Testing
          </CardTitle>
          <CardDescription>
            Comprehensive testing for Plaud device integration and webhook functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={runFullPlaudTest}>
              <TestTube className="w-4 h-4 mr-2" />
              Run Full Test Suite
            </Button>
            <Button onClick={testWebhookEndpoint} disabled={isTestingWebhook} variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              {isTestingWebhook ? 'Testing...' : 'Test Webhook'}
            </Button>
            <Button onClick={testPlaudWebhookFunction} variant="outline">
              <Smartphone className="w-4 h-4 mr-2" />
              Test Plaud Function
            </Button>
          </div>

          {/* Webhook URL Display */}
          <div className="space-y-2">
            <Label>PlaudIQ Webhook Endpoint</Label>
            <div className="flex gap-2">
              <Input 
                value={webhookUrl} 
                readOnly 
                className="font-mono text-xs"
              />
              <Button onClick={copyWebhookUrl} variant="outline" size="sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Webhook Endpoint Test */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Webhook Endpoint</p>
                <p className="text-sm text-gray-600">Tests if the webhook URL is accessible</p>
              </div>
              <div className="flex items-center gap-2">
                {getResultBadge(testResults.webhook_endpoint)}
                <Button size="sm" variant="outline" onClick={testWebhookEndpoint}>
                  Test
                </Button>
              </div>
            </div>

            {/* Plaud Function Test */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Plaud Function Processing</p>
                <p className="text-sm text-gray-600">Tests mock Plaud recording processing</p>
              </div>
              <div className="flex items-center gap-2">
                {getResultBadge(testResults.plaud_function)}
                <Button size="sm" variant="outline" onClick={testPlaudWebhookFunction}>
                  Test
                </Button>
              </div>
            </div>

            {/* Voice Transcription Test */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Voice Transcription</p>
                <p className="text-sm text-gray-600">Tests AI voice transcription capability</p>
              </div>
              <div className="flex items-center gap-2">
                {getResultBadge(testResults.voice_transcription)}
                <Badge variant="outline" className="text-xs">Auto-tested</Badge>
              </div>
            </div>
          </div>

          {/* Test Results Details */}
          {Object.entries(testResults).map(([testName, result]) => (
            <div key={testName} className="mt-4">
              {result.error && (
                <Alert className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{testName} Error:</strong> {result.error}
                  </AlertDescription>
                </Alert>
              )}
              {result.success && result.data && (
                <Alert className="mb-2 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <strong>{testName} Success:</strong>
                    <pre className="text-xs mt-1 text-green-700">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Zapier Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Zapier Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Your Zapier Webhook URL</Label>
            <Input
              value={zapierWebhookUrl}
              onChange={(e) => setZapierWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
            />
          </div>
          <Button onClick={testZapierWebhook} disabled={!zapierWebhookUrl}>
            <Send className="w-4 h-4 mr-2" />
            Test Zapier Webhook
          </Button>
          {getResultBadge(testResults.zapier_webhook)}
        </CardContent>
      </Card>

      {/* Custom Payload Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Payload Test</CardTitle>
          <CardDescription>
            Test webhook with custom JSON payload
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Custom JSON Payload</Label>
            <Textarea
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              placeholder={JSON.stringify(mockPlaudPayload, null, 2)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={testCustomPayload} disabled={!customPayload}>
              <TestTube className="w-4 h-4 mr-2" />
              Test Custom Payload
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCustomPayload(JSON.stringify(mockPlaudPayload, null, 2))}
            >
              Load Mock Data
            </Button>
          </div>
          {getResultBadge(testResults.custom_payload)}
        </CardContent>
      </Card>
    </div>
  );
};