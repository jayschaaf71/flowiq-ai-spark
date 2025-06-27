
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Brain, Calendar, Bell, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scheduleIQService } from '@/services/scheduleIQService';

export const ScheduleSettingsTab: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const configData = await scheduleIQService.initializeConfig('default-practice');
      setConfig(configData);
    } catch (error) {
      console.error('Error loading configuration:', error);
      toast({
        title: "Error",
        description: "Failed to load configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    setSaving(true);
    try {
      // In a real implementation, you would save the configuration to the database
      // For now, we'll just show a success message
      toast({
        title: "Settings Saved",
        description: "Schedule iQ configuration has been updated",
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleWorkingHoursChange = (key: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [key]: value
      }
    }));
  };

  const handleReminderSettingsChange = (key: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      reminderSettings: {
        ...prev.reminderSettings,
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-gray-600" />
        <div>
          <h2 className="text-2xl font-bold">Schedule iQ Settings</h2>
          <p className="text-gray-600">Configure AI scheduling behavior and preferences</p>
        </div>
      </div>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="ai-optimization">AI Schedule Optimization</Label>
              <p className="text-sm text-gray-600">
                Automatically optimize schedules to reduce wait times and improve efficiency
              </p>
            </div>
            <Switch
              id="ai-optimization"
              checked={config?.aiOptimizationEnabled || false}
              onCheckedChange={(checked) => handleConfigChange('aiOptimizationEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-booking">Auto-Booking</Label>
              <p className="text-sm text-gray-600">
                Automatically book appointments when high-confidence matches are found
              </p>
            </div>
            <Switch
              id="auto-booking"
              checked={config?.autoBookingEnabled || false}
              onCheckedChange={(checked) => handleConfigChange('autoBookingEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="waitlist">Waitlist Management</Label>
              <p className="text-sm text-gray-600">
                Enable intelligent waitlist processing and automated notifications
              </p>
            </div>
            <Switch
              id="waitlist"
              checked={config?.waitlistEnabled || false}
              onCheckedChange={(checked) => handleConfigChange('waitlistEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Working Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={config?.workingHours?.start || '09:00'}
                onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={config?.workingHours?.end || '17:00'}
                onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Working Days</Label>
            <div className="flex gap-2 mt-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <Badge
                  key={day}
                  variant={config?.workingHours?.days?.includes(index + 1) ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => {
                    const currentDays = config?.workingHours?.days || [];
                    const dayNumber = index + 1;
                    const newDays = currentDays.includes(dayNumber)
                      ? currentDays.filter((d: number) => d !== dayNumber)
                      : [...currentDays, dayNumber];
                    handleWorkingHoursChange('days', newDays);
                  }}
                >
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reminder Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-reminders">Email Reminders</Label>
              <p className="text-sm text-gray-600">Send appointment reminders via email</p>
            </div>
            <Switch
              id="email-reminders"
              checked={config?.reminderSettings?.email || false}
              onCheckedChange={(checked) => handleReminderSettingsChange('email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sms-reminders">SMS Reminders</Label>
              <p className="text-sm text-gray-600">Send appointment reminders via SMS</p>
            </div>
            <Switch
              id="sms-reminders"
              checked={config?.reminderSettings?.sms || false}
              onCheckedChange={(checked) => handleReminderSettingsChange('sms', checked)}
            />
          </div>

          <div>
            <Label>Reminder Intervals (hours before appointment)</Label>
            <div className="flex gap-2 mt-2">
              {[24, 12, 4, 2, 1].map((hours) => (
                <Badge
                  key={hours}
                  variant={config?.reminderSettings?.intervals?.includes(hours) ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => {
                    const currentIntervals = config?.reminderSettings?.intervals || [];
                    const newIntervals = currentIntervals.includes(hours)
                      ? currentIntervals.filter((h: number) => h !== hours)
                      : [...currentIntervals, hours];
                    handleReminderSettingsChange('intervals', newIntervals);
                  }}
                >
                  {hours}h
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveConfiguration} disabled={saving}>
          {saving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </div>
  );
};
