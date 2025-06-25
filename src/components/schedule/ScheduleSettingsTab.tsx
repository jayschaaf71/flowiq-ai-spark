
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Brain, 
  Clock, 
  Bell, 
  Calendar,
  Zap,
  Shield,
  Save,
  RefreshCw
} from "lucide-react";

export const ScheduleSettingsTab = () => {
  const [settings, setSettings] = useState({
    aiOptimizationEnabled: true,
    autoBookingEnabled: true,
    waitlistEnabled: true,
    reminderSettings: {
      email: true,
      sms: true,
      intervals: [24, 2]
    },
    workingHours: {
      start: '09:00',
      end: '17:00',
      days: [1, 2, 3, 4, 5]
    },
    bookingRules: {
      minAdvanceHours: 2,
      maxAdvanceDays: 90,
      bufferMinutes: 15
    },
    aiSettings: {
      confidenceThreshold: 0.8,
      autoBookThreshold: 0.9,
      learningMode: true
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Schedule iQ configuration updated successfully",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save settings at this time",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    setSettings(prev => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-gray-600" />
            Schedule iQ Configuration
            <Badge className="bg-green-100 text-green-700">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </CardTitle>
          <CardDescription>
            Configure AI-powered scheduling settings and automation rules
          </CardDescription>
        </CardHeader>
      </Card>

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Settings
          </CardTitle>
          <CardDescription>
            Control AI behavior and automation thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">AI Optimization</label>
              <p className="text-sm text-gray-600">Enable AI-powered schedule optimization</p>
            </div>
            <Switch
              checked={settings.aiOptimizationEnabled}
              onCheckedChange={(checked) => updateSetting('aiOptimizationEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Auto-Booking</label>
              <p className="text-sm text-gray-600">Allow AI to automatically book appointments</p>
            </div>
            <Switch
              checked={settings.autoBookingEnabled}
              onCheckedChange={(checked) => updateSetting('autoBookingEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Learning Mode</label>
              <p className="text-sm text-gray-600">AI continuously learns from booking patterns</p>
            </div>
            <Switch
              checked={settings.aiSettings.learningMode}
              onCheckedChange={(checked) => updateSetting('aiSettings.learningMode', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Confidence Threshold</label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={settings.aiSettings.confidenceThreshold}
                onChange={(e) => updateSetting('aiSettings.confidenceThreshold', parseFloat(e.target.value))}
              />
              <p className="text-xs text-gray-600">Minimum confidence for AI suggestions (0.0 - 1.0)</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Auto-Book Threshold</label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={settings.aiSettings.autoBookThreshold}
                onChange={(e) => updateSetting('aiSettings.autoBookThreshold', parseFloat(e.target.value))}
              />
              <p className="text-xs text-gray-600">Minimum confidence for auto-booking (0.0 - 1.0)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Working Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => updateSetting('workingHours.start', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                value={settings.workingHours.end}
                onChange={(e) => updateSetting('workingHours.end', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Working Days</label>
            <div className="flex gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <Button
                  key={day}
                  variant={settings.workingHours.days.includes(index) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const days = settings.workingHours.days.includes(index)
                      ? settings.workingHours.days.filter(d => d !== index)
                      : [...settings.workingHours.days, index];
                    updateSetting('workingHours.days', days);
                  }}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Booking Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Advance (Hours)</label>
              <Input
                type="number"
                min="0"
                value={settings.bookingRules.minAdvanceHours}
                onChange={(e) => updateSetting('bookingRules.minAdvanceHours', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Advance (Days)</label>
              <Input
                type="number"
                min="1"
                value={settings.bookingRules.maxAdvanceDays}
                onChange={(e) => updateSetting('bookingRules.maxAdvanceDays', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Buffer (Minutes)</label>
              <Input
                type="number"
                min="0"
                value={settings.bookingRules.bufferMinutes}
                onChange={(e) => updateSetting('bookingRules.bufferMinutes', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Reminder Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Email Reminders</label>
              <p className="text-sm text-gray-600">Send email appointment reminders</p>
            </div>
            <Switch
              checked={settings.reminderSettings.email}
              onCheckedChange={(checked) => updateSetting('reminderSettings.email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">SMS Reminders</label>
              <p className="text-sm text-gray-600">Send text message reminders</p>
            </div>
            <Switch
              checked={settings.reminderSettings.sms}
              onCheckedChange={(checked) => updateSetting('reminderSettings.sms', checked)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reminder Intervals (Hours Before)</label>
            <div className="flex gap-2">
              {settings.reminderSettings.intervals.map((interval, index) => (
                <Input
                  key={index}
                  type="number"
                  min="0"
                  value={interval}
                  onChange={(e) => {
                    const newIntervals = [...settings.reminderSettings.intervals];
                    newIntervals[index] = parseInt(e.target.value);
                    updateSetting('reminderSettings.intervals', newIntervals);
                  }}
                  className="w-20"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Waitlist Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Waitlist Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Enable Waitlist</label>
              <p className="text-sm text-gray-600">Allow patients to join waitlist for unavailable slots</p>
            </div>
            <Switch
              checked={settings.waitlistEnabled}
              onCheckedChange={(checked) => updateSetting('waitlistEnabled', checked)}
            />
          </div>

          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              When enabled, AI will automatically process the waitlist and book patients when slots become available.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
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
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
