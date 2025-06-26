
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, ExternalLink, Copy, Zap, Smartphone, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlaudZapierSetupProps {
  onSetupComplete: (zapierWebhookUrl: string) => void;
  onSkip: () => void;
}

export const PlaudZapierSetup: React.FC<PlaudZapierSetupProps> = ({
  onSetupComplete,
  onSkip
}) => {
  const [step, setStep] = useState(1);
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const flowiqWebhookUrl = `https://jzusvsbkprwkjhhozaup.supabase.co/functions/v1/plaud-webhook`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Webhook URL copied successfully",
    });
  };

  const testConnection = async () => {
    if (!zapierWebhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL first",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    try {
      // Test the Zapier webhook
      const response = await fetch(zapierWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          message: "FlowIQ setup test",
          timestamp: new Date().toISOString(),
        }),
      });

      toast({
        title: "Test Sent",
        description: "Test trigger sent to Zapier. Check your Zap history to confirm it worked.",
      });
      
      setStep(4);
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not reach Zapier webhook. Please check the URL.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const completeSetup = () => {
    onSetupComplete(zapierWebhookUrl);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Smartphone className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Connect Your Plaud Device</h3>
              <p className="text-gray-600">
                Set up automatic SOAP note generation from your Plaud recordings using Zapier
              </p>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Zap className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                This setup enables automatic processing - just record with your Plaud device and SOAP notes will appear in FlowIQ automatically!
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button onClick={() => setStep(2)} className="px-8">
                Start Setup <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Step 1: Create Your Zapier Automation</h3>
              
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <ExternalLink className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Go to Zapier and create a new Zap with:</strong>
                    <br />• <strong>Trigger:</strong> Plaud → "New Recording"
                    <br />• <strong>Action:</strong> Webhooks by Zapier → "POST"
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    FlowIQ Webhook URL (copy this into your Zapier webhook action):
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={flowiqWebhookUrl}
                      readOnly
                      className="font-mono text-sm bg-white"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(flowiqWebhookUrl)}
                      className="px-3"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Use this URL as the webhook endpoint in your Zapier action step
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">Webhook Configuration:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• <strong>Method:</strong> POST</li>
                    <li>• <strong>URL:</strong> Use the FlowIQ webhook URL above</li>
                    <li>• <strong>Payload Type:</strong> JSON (not form or raw)</li>
                    <li>• <strong>Data:</strong> Map Plaud fields (recording_id, filename, download_url, etc.)</li>
                  </ul>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Zapier Configured <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Step 2: Get Your Zapier Webhook URL</h3>
              
              <div className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>In your Zapier webhook trigger step:</strong>
                    <br />Copy the "Webhook URL" that Zapier provides and paste it below.
                    <br />This allows us to test the connection.
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="zapier-webhook" className="text-sm font-medium">
                    Your Zapier Webhook URL:
                  </Label>
                  <Input
                    id="zapier-webhook"
                    value={zapierWebhookUrl}
                    onChange={(e) => setZapierWebhookUrl(e.target.value)}
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    This is the webhook URL from your Zapier trigger step
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    onClick={testConnection}
                    disabled={!zapierWebhookUrl || isTestingConnection}
                  >
                    {isTestingConnection ? "Testing..." : "Test Connection"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2 text-green-800">Setup Complete!</h3>
              <p className="text-gray-600">
                Your Plaud device is now connected to FlowIQ via Zapier
              </p>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>How it works now:</strong>
                <br />1. Record patient encounter with your Plaud device
                <br />2. Plaud automatically syncs the recording
                <br />3. Zapier detects the new recording and sends it to FlowIQ
                <br />4. FlowIQ generates SOAP note automatically
                <br />5. You get notified when the SOAP note is ready!
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button onClick={completeSetup} className="px-8">
                Complete Setup
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Plaud + Zapier Integration
        </CardTitle>
        <CardDescription>
          Set up automatic SOAP note generation from your Plaud recordings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
        
        {step > 1 && (
          <div className="mt-6 pt-4 border-t">
            <Button variant="ghost" onClick={onSkip} className="text-gray-500">
              Skip for now - I'll set this up later
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
