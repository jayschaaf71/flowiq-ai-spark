
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Brain } from "lucide-react";

interface AISettings {
  autoOptimization: boolean;
  conflictResolution: boolean;
  predictiveScheduling: boolean;
  waitlistManagement: boolean;
  noShowPrediction: boolean;
  smartReminders: boolean;
}

interface AISettingsTabProps {
  settings: AISettings;
  onSettingsChange: (updates: Partial<AISettings>) => void;
}

export const AISettingsTab = ({ settings, onSettingsChange }: AISettingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Automation Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Optimization</Label>
              <p className="text-sm text-gray-600">Automatically optimize schedule for efficiency</p>
            </div>
            <Switch
              checked={settings.autoOptimization}
              onCheckedChange={(checked) => onSettingsChange({ autoOptimization: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Conflict Resolution</Label>
              <p className="text-sm text-gray-600">AI resolves scheduling conflicts automatically</p>
            </div>
            <Switch
              checked={settings.conflictResolution}
              onCheckedChange={(checked) => onSettingsChange({ conflictResolution: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Predictive Scheduling</Label>
              <p className="text-sm text-gray-600">AI suggests optimal appointment times</p>
            </div>
            <Switch
              checked={settings.predictiveScheduling}
              onCheckedChange={(checked) => onSettingsChange({ predictiveScheduling: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Waitlist Management</Label>
              <p className="text-sm text-gray-600">Automatically manage patient waitlist</p>
            </div>
            <Switch
              checked={settings.waitlistManagement}
              onCheckedChange={(checked) => onSettingsChange({ waitlistManagement: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>No-Show Prediction</Label>
              <p className="text-sm text-gray-600">Predict and prevent no-shows with AI</p>
            </div>
            <Switch
              checked={settings.noShowPrediction}
              onCheckedChange={(checked) => onSettingsChange({ noShowPrediction: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Smart Reminders</Label>
              <p className="text-sm text-gray-600">AI optimizes reminder timing and content</p>
            </div>
            <Switch
              checked={settings.smartReminders}
              onCheckedChange={(checked) => onSettingsChange({ smartReminders: checked })}
            />
          </div>
        </div>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900">AI Performance</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Your AI scheduling agent is performing at 94.5% accuracy with excellent optimization results.
                </p>
                <Button variant="outline" size="sm" className="mt-2 border-purple-300 text-purple-700 hover:bg-purple-100">
                  View AI Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
