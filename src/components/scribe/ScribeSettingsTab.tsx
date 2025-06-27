
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Settings, 
  Brain, 
  Mic, 
  FileText, 
  Shield, 
  Volume2,
  Clock,
  Zap,
  Save,
  RefreshCw
} from "lucide-react";
import { useScribeSettings } from "@/hooks/useScribeSettings";

export const ScribeSettingsTab = () => {
  const {
    settings,
    isLoading,
    isSaving,
    updateSetting,
    saveSettings,
    resetToDefaults
  } = useScribeSettings();

  const handleSaveSettings = () => {
    saveSettings(settings);
  };

  const handleResetToDefaults = () => {
    resetToDefaults();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Scribe iQ Configuration
          </CardTitle>
          <CardDescription>
            Configure AI transcription and SOAP generation preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Features */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              AI Features
            </h3>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Auto SOAP Generation</Label>
                  <p className="text-xs text-gray-600">Automatically generate SOAP notes from transcriptions</p>
                </div>
                <Switch
                  checked={settings.autoSOAPGeneration}
                  onCheckedChange={(checked) => updateSetting('autoSOAPGeneration', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Real-time Transcription</Label>
                  <p className="text-xs text-gray-600">Live transcription during patient encounters</p>
                </div>
                <Switch
                  checked={settings.realTimeTranscription}
                  onCheckedChange={(checked) => updateSetting('realTimeTranscription', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Save Recordings</Label>
                  <p className="text-xs text-gray-600">Store audio recordings for future reference</p>
                </div>
                <Switch
                  checked={settings.saveRecordings}
                  onCheckedChange={(checked) => updateSetting('saveRecordings', checked)}
                />
              </div>
            </div>
          </div>

          {/* AI Model Settings */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-600" />
              AI Model Configuration
            </h3>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select value={settings.aiModel} onValueChange={(value) => updateSetting('aiModel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">Higher models provide better medical accuracy</p>
              </div>

              <div className="space-y-2">
                <Label>Transcription Language</Label>
                <Select value={settings.transcriptionLanguage} onValueChange={(value) => updateSetting('transcriptionLanguage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Confidence Threshold: {settings.confidenceThreshold}%</Label>
                <Slider
                  value={[settings.confidenceThreshold]}
                  onValueChange={(value) => updateSetting('confidenceThreshold', value[0])}
                  max={100}
                  min={50}
                  step={5}
                  className="py-4"
                />
                <p className="text-xs text-gray-600">Minimum confidence level for transcription accuracy</p>
              </div>
            </div>
          </div>

          {/* Recording Settings */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Mic className="w-4 h-4 text-red-600" />
              Recording Settings
            </h3>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Recording Quality</Label>
                <Select value={settings.recordingQuality} onValueChange={(value) => updateSetting('recordingQuality', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Quality (Recommended)</SelectItem>
                    <SelectItem value="medium">Medium Quality</SelectItem>
                    <SelectItem value="low">Low Quality</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">Higher quality improves transcription accuracy</p>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Auto-save Transcriptions</Label>
                  <p className="text-xs text-gray-600">Automatically save completed transcriptions</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                />
              </div>
            </div>
          </div>

          {/* Integration Settings */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-600" />
              Integrations
            </h3>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="text-sm font-medium">Zapier Integration</Label>
                <p className="text-xs text-gray-600">Connect with Plaud device via Zapier</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  {settings.zapierIntegration ? 'Active' : 'Inactive'}
                </Badge>
                <Switch
                  checked={settings.zapierIntegration}
                  onCheckedChange={(checked) => updateSetting('zapierIntegration', checked)}
                />
              </div>
            </div>
          </div>

          {/* Compliance */}
          <Alert className="border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>HIPAA Compliance Active:</strong> All recordings and transcriptions are processed with full HIPAA compliance and encryption.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleResetToDefaults}
              disabled={isSaving}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
