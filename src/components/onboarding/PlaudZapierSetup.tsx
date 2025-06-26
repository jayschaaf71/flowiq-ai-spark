
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
              <h3 className="text-lg font-semibold mb-4">Step 1: Connect Plaud to Zapier</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <ol className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">1</Badge>
                      <span>Open your Plaud app and go to <strong>Settings → Integrations</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">2</Badge>
                      <span>Find <strong>Zapier</strong> and click <strong>"Connect"</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">3</Badge>
                      <span>Follow the prompts to authorize Zapier to access your Plaud recordings</span>
                    </li>
                  </ol>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Plaud Connected <ArrowRight className="w-4 h-4 ml-2" />
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
              <h3 className="text-lg font-semibold mb-4">Step 2: Create Zapier Automation</h3>
              
              <div className="space-y-4">
                <Alert className="border-yellow-200 bg-yellow-50">
                  <ExternalLink className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Create a new Zap in Zapier:</strong>
                    <br />• <strong>Trigger:</strong> Plaud → "New Recording"
                    <br />• <strong>Action:</strong> Webhooks → "POST" to the URL below
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="webhook-url" className="text-sm font-medium">
                    FlowIQ Webhook URL (copy this into Zapier):
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="webhook-url"
                      value={flowiqWebhookUrl}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(flowiqWebhookUrl)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="zapier-webhook" className="text-sm font-medium">
                    Your Zapier Webhook URL (from your Zap):
                  </Label>
                  <Input
                    id="zapier-webhook"
                    value={zapierWebhookUrl}
                    onChange={(e) => setZapierWebhookUrl(e.target.value)}
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    className="mt-1 font-mono text-xs"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Get this from your Zapier webhook trigger step
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
