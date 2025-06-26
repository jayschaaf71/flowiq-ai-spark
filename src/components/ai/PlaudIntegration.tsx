import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Cloud, 
  Wifi, 
  CheckCircle, 
  Clock, 
  Settings,
  Smartphone,
  Mic
} from "lucide-react";
import { usePlaudIntegration } from "@/hooks/usePlaudIntegration";

export const PlaudIntegration = () => {
  const {
    isConnected,
    config,
    recordings,
    isPolling,
    savePlaudConfig,
    manualSync,
    uploadRecording
  } = usePlaudIntegration();

  const [apiKey, setApiKey] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Update local state when config changes
  useEffect(() => {
    if (config) {
      setApiKey(config.apiKey || "");
      setAutoSync(config.autoSync);
    }
  }, [config]);

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

  const connectToPlaud = async () => {
    if (!apiKey) {
      setConnectionError("Please enter your Plaud Cloud API key");
      return;
    }

    setConnectionError(null);
    
    try {
      // Test the API key by making a simple request
      const testResponse = await fetch('https://api.plaud.ai/v1/user/profile', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-API-Version': '2024-01'
        }
      });

      if (!testResponse.ok) {
        throw new Error('Invalid API key or connection failed');
      }

      const newConfig = {
        apiKey,
        webhookUrl: `https://jzusvsbkprwkjhhozaup.supabase.co/functions/v1/plaud-webhook`,
        autoSync
      };

      await savePlaudConfig(newConfig);
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  const handleAutoSyncChange = async (checked: boolean) => {
    setAutoSync(checked);
    
    if (config) {
      const newConfig = {
        ...config,
        autoSync: checked
      };
      await savePlaudConfig(newConfig);
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Plaud Device Integration
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Seamlessly integrate with your Plaud recording device for automatic voice transcription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="plaud-api-key">Plaud Cloud API Key</Label>
                <Input
                  id="plaud-api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Plaud Cloud API key"
                />
                {connectionError && (
                  <p className="text-sm text-red-600 mt-1">{connectionError}</p>
                )}
              </div>
              <Button onClick={connectToPlaud} disabled={!apiKey}>
                <Cloud className="w-4 h-4 mr-2" />
                Connect to Plaud Cloud
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Connected to Plaud Cloud</span>
                  {isPolling && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Wifi className="w-3 h-3 mr-1" />
                      Auto-syncing
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="auto-sync">Auto-sync recordings</Label>
                    <Switch
                      id="auto-sync"
                      checked={autoSync}
                      onCheckedChange={handleAutoSyncChange}
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={manualSync}>
                    <Settings className="w-4 h-4 mr-2" />
                    Manual Sync
                  </Button>
                </div>
              </div>
              
              {/* Webhook URL Info */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Webhook URL</p>
                <p className="text-xs text-blue-700 font-mono break-all">
                  https://jzusvsbkprwkjhhozaup.supabase.co/functions/v1/plaud-webhook
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Configure this URL in your Plaud Cloud dashboard for automatic sync
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Upload Option */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Manual Upload
          </CardTitle>
          <CardDescription>
            Upload recordings directly from your Plaud device or mobile app
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
                  {isProcessing ? "Processing..." : "Click to upload audio file or drag and drop"}
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
                  AI is processing your recording...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Recordings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Recordings</CardTitle>
          <CardDescription>
            Recordings from your Plaud device with AI transcription status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recordings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recordings yet</p>
              <p className="text-sm">Recordings will appear here automatically when synced</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recordings.map((recording) => (
                <div key={recording.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{recording.filename}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(recording.timestamp).toLocaleString()}
                      {recording.duration > 0 && ` • ${Math.floor(recording.duration / 60)}m ${recording.duration % 60}s`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {recording.processed ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Transcribed
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
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

      {/* Integration Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
              <div>
                <p className="font-medium">Connect your Plaud device</p>
                <p className="text-sm text-gray-600">Download the Plaud mobile app and connect your device</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
              <div>
                <p className="font-medium">Get your API key</p>
                <p className="text-sm text-gray-600">Obtain API credentials from your Plaud Cloud account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <div>
                <p className="font-medium">Enable auto-sync</p>
                <p className="text-sm text-gray-600">Recordings will automatically transfer and be transcribed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
