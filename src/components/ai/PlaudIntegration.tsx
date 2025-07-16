
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  Cloud, 
  Wifi, 
  CheckCircle, 
  Clock, 
  Settings,
  Smartphone,
  Mic,
  Zap,
  Copy,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { usePlaudIntegration } from "@/hooks/usePlaudIntegration";
import { useToast } from "@/hooks/use-toast";

export const PlaudIntegration = () => {
  const {
    isConnected,
    config,
    recordings,
    savePlaudConfig,
    manualSync,
    uploadRecording
  } = usePlaudIntegration();

  const [zapierWebhookUrl, setZapierWebhookUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  // Our webhook URL for Zapier
  const flowiqWebhookUrl = "https://jzusvsbkprwkjhhozaup.supabase.co/functions/v1/plaud-webhook";

  useEffect(() => {
    if (config) {
      setZapierWebhookUrl(config.webhookUrl || "");
    }
  }, [config]);

  const handleZapierSetup = async () => {
    setConnectionError(null);
    
    try {
      const newConfig = {
        apiKey: "", // Not needed for Zapier
        webhookUrl: flowiqWebhookUrl, // Use our webhook URL
        autoSync: true
      };

      await savePlaudConfig(newConfig);
      
      toast({
        title: "Zapier Integration Enabled",
        description: "ScribeIQ is now ready to receive recordings from your Plaud device via Zapier",
      });
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  const handleManualUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      await uploadRecording(file);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(flowiqWebhookUrl);
      toast({
        title: "Copied to Clipboard",
        description: "FlowIQ webhook URL has been copied",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Zapier Integration Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Plaud + Zapier Integration
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Setup Required"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Connect your Plaud device to FlowIQ using Zapier automation for seamless voice transcription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Zap className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Setup Instructions:</strong>
                  <ol className="mt-2 ml-4 list-decimal space-y-1 text-sm">
                    <li>Create a Zap with "Plaud" as the trigger (Transcript & Summary Ready)</li>
                    <li>Add "Webhooks by Zapier" as the action (POST)</li>
                    <li>Copy the ScribeIQ webhook URL below and paste it in your Zap</li>
                    <li>Map the Plaud fields (transcript, summary, etc.) to the webhook</li>
                    <li>Test and publish your Zap</li>
                    <li>Click "Enable Zapier Integration" below</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>ScribeIQ Webhook URL (Copy this to your Zap action)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={flowiqWebhookUrl} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button onClick={copyWebhookUrl} variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {connectionError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {connectionError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button onClick={handleZapierSetup}>
                  <Zap className="w-4 h-4 mr-2" />
                  Enable Zapier Integration
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://zapier.com/apps/plaud/integrations" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Plaud Zapier Apps
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Connected via Zapier</span>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    <Zap className="w-3 h-3 mr-1" />
                    Zapier Active
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={manualSync}>
                  <Settings className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
              </div>
              
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Zapier Integration Active:</strong> Your Plaud recordings will automatically be sent to FlowIQ and processed into SOAP notes.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Upload Option */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Manual Upload & Testing
          </CardTitle>
          <CardDescription>
            Upload recordings directly for testing or backup processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="audio/*"
                onChange={handleManualUpload}
                className="hidden"
                id="file-upload"
                disabled={isProcessing}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {isProcessing ? "Processing..." : "Click to upload audio file"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports MP3, WAV, M4A formats
                </p>
              </label>
            </div>
            
            {isProcessing && (
              <div className="space-y-2">
                <Progress value={65} />
                <p className="text-sm text-center text-gray-600">
                  AI is processing your recording and generating SOAP notes...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Recordings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Recordings & SOAP Notes</CardTitle>
          <CardDescription>
            Voice recordings processed with AI-generated medical documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recordings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No recordings yet</p>
              <p className="text-sm">Upload a test file or make a recording with your Plaud device</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recordings.map((recording) => (
                <div key={recording.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{recording.filename}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(recording.timestamp).toLocaleString()}
                      {recording.duration > 0 && ` • ${Math.floor(recording.duration / 60)}m ${recording.duration % 60}s`}
                    </p>
                    {recording.transcription && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-md">
                        "{recording.transcription.substring(0, 100)}..."
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {recording.processed ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        SOAP Generated
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        Processing
                      </Badge>
                    )}
                    <Button variant="outline" size="sm">
                      View SOAP
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
