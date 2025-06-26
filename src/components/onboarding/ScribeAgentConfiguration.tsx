
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Mic, 
  FileText, 
  Smartphone, 
  Zap,
  Shield
} from 'lucide-react';
import { PlaudZapierSetup } from './PlaudZapierSetup';

interface ScribeAgentConfigurationProps {
  onConfigUpdate: (config: any) => void;
  currentConfig?: any;
}

export const ScribeAgentConfiguration: React.FC<ScribeAgentConfigurationProps> = ({
  onConfigUpdate,
  currentConfig = {}
}) => {
  const [showPlaudSetup, setShowPlaudSetup] = useState(false);
  const [config, setConfig] = useState({
    enableScribeAgent: currentConfig.enableScribeAgent || false,
    enablePlaudIntegration: currentConfig.enablePlaudIntegration || false,
    zapierWebhookUrl: currentConfig.zapierWebhookUrl || '',
    autoSOAPGeneration: currentConfig.autoSOAPGeneration || true,
    realTimeTranscription: currentConfig.realTimeTranscription || true,
    ...currentConfig
  });

  const updateConfig = (updates: Partial<typeof config>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigUpdate(newConfig);
  };

  const handlePlaudSetupComplete = (zapierWebhookUrl: string) => {
    updateConfig({
      enablePlaudIntegration: true,
      zapierWebhookUrl
    });
    setShowPlaudSetup(false);
  };

  if (showPlaudSetup) {
    return (
      <PlaudZapierSetup
        onSetupComplete={handlePlaudSetupComplete}
        onSkip={() => setShowPlaudSetup(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Scribe iQ Agent Configuration
          </CardTitle>
          <CardDescription>
            Set up AI-powered medical documentation and voice transcription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Scribe Agent */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <div>
                <Label className="text-base font-medium">Enable Scribe iQ Agent</Label>
                <p className="text-sm text-gray-600">
                  AI-powered medical documentation and SOAP note generation
                </p>
              </div>
            </div>
            <Switch
              checked={config.enableScribeAgent}
              onCheckedChange={(checked) => updateConfig({ enableScribeAgent: checked })}
            />
          </div>

          {config.enableScribeAgent && (
            <>
              {/* Plaud Integration */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <Label className="text-base font-medium">Plaud Device Integration</Label>
                      <p className="text-sm text-gray-600">
                        Automatic transcription from Plaud recordings via Zapier
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {config.enablePlaudIntegration && (
                      <Badge className="bg-green-100 text-green-700">
                        <Zap className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                    <Switch
                      checked={config.enablePlaudIntegration}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setShowPlaudSetup(true);
                        } else {
                          updateConfig({ 
                            enablePlaudIntegration: false,
                            zapierWebhookUrl: ''
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                {config.enablePlaudIntegration && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Automatic Workflow Active:</strong> Plaud recordings will automatically generate SOAP notes via Zapier integration.
                    </AlertDescription>
                  </Alert>
                )}

                {!config.enablePlaudIntegration && (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPlaudSetup(true)}
                    className="w-full"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Set Up Plaud Integration
                  </Button>
                )}
              </div>

              {/* Additional Scribe Features */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-green-600" />
                    <div>
                      <Label className="text-sm font-medium">Auto SOAP Generation</Label>
                      <p className="text-xs text-gray-600">Automatically generate SOAP notes from transcriptions</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.autoSOAPGeneration}
                    onCheckedChange={(checked) => updateConfig({ autoSOAPGeneration: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mic className="w-4 h-4 text-red-600" />
                    <div>
                      <Label className="text-sm font-medium">Real-time Transcription</Label>
                      <p className="text-xs text-gray-600">Live transcription during patient encounters</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.realTimeTranscription}
                    onCheckedChange={(checked) => updateConfig({ realTimeTranscription: checked })}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {config.enableScribeAgent && (
        <Alert className="border-purple-200 bg-purple-50">
          <Brain className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>Scribe iQ Features Enabled:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• AI-powered medical transcription</li>
              <li>• Automatic SOAP note generation</li>
              <li>• HIPAA-compliant processing</li>
              {config.enablePlaudIntegration && <li>• Automatic Plaud device integration</li>}
              {config.realTimeTranscription && <li>• Real-time transcription capabilities</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
