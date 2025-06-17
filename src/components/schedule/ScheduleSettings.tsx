
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Clock, MessageSquare, Bell, Calendar } from "lucide-react";

export const ScheduleSettings = () => {
  const [settings, setSettings] = useState({
    // Working Hours
    workingHours: {
      monday: { enabled: true, start: "08:00", end: "17:00" },
      tuesday: { enabled: true, start: "08:00", end: "17:00" },
      wednesday: { enabled: true, start: "08:00", end: "17:00" },
      thursday: { enabled: true, start: "08:00", end: "17:00" },
      friday: { enabled: true, start: "08:00", end: "17:00" },
      saturday: { enabled: false, start: "09:00", end: "15:00" },
      sunday: { enabled: false, start: "09:00", end: "15:00" }
    },
    
    // Appointment Settings
    defaultDuration: "60",
    bufferTime: "15",
    advanceBooking: "30",
    
    // Automation Settings
    autoConfirmation: true,
    reminderSMS: true,
    reminderEmail: true,
    reminderTiming: "24",
    followUpEnabled: true,
    
    // Notification Templates
    confirmationMessage: "Hi {name}, your appointment is confirmed for {date} at {time}. Reply STOP to opt out.",
    reminderMessage: "Reminder: You have an appointment tomorrow at {time}. Reply C to confirm or R to reschedule.",
    
    // AI Settings
    aiBookingEnabled: true,
    aiReschedulingEnabled: true,
    requireHumanApproval: false
  });

  const handleSettingChange = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const saveSettings = () => {
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  return (
    <div className="space-y-6">
      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Working Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {days.map((day) => (
            <div key={day.key} className="flex items-center gap-4">
              <div className="w-24">
                <Switch
                  checked={settings.workingHours[day.key as keyof typeof settings.workingHours].enabled}
                  onCheckedChange={(checked) => handleSettingChange(`workingHours.${day.key}.enabled`, checked)}
                />
                <Label className="ml-2 text-sm">{day.label}</Label>
              </div>
              
              {settings.workingHours[day.key as keyof typeof settings.workingHours].enabled && (
                <>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={settings.workingHours[day.key as keyof typeof settings.workingHours].start}
                      onChange={(e) => handleSettingChange(`workingHours.${day.key}.start`, e.target.value)}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-500">to</span>
                    <Input
                      type="time"
                      value={settings.workingHours[day.key as keyof typeof settings.workingHours].end}
                      onChange={(e) => handleSettingChange(`workingHours.${day.key}.end`, e.target.value)}
                      className="w-32"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appointment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="defaultDuration">Default Duration (minutes)</Label>
              <Input
                id="defaultDuration"
                type="number"
                value={settings.defaultDuration}
                onChange={(e) => handleSettingChange('defaultDuration', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="bufferTime">Buffer Time (minutes)</Label>
              <Input
                id="bufferTime"
                type="number"
                value={settings.bufferTime}
                onChange={(e) => handleSettingChange('bufferTime', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="advanceBooking">Advance Booking (days)</Label>
              <Input
                id="advanceBooking"
                type="number"
                value={settings.advanceBooking}
                onChange={(e) => handleSettingChange('advanceBooking', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Automation & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoConfirmation">Auto-send confirmations</Label>
                <Switch
                  id="autoConfirmation"
                  checked={settings.autoConfirmation}
                  onCheckedChange={(checked) => handleSettingChange('autoConfirmation', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="reminderSMS">SMS reminders</Label>
                <Switch
                  id="reminderSMS"
                  checked={settings.reminderSMS}
                  onCheckedChange={(checked) => handleSettingChange('reminderSMS', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="reminderEmail">Email reminders</Label>
                <Switch
                  id="reminderEmail"
                  checked={settings.reminderEmail}
                  onCheckedChange={(checked) => handleSettingChange('reminderEmail', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="followUpEnabled">Follow-up messages</Label>
                <Switch
                  id="followUpEnabled"
                  checked={settings.followUpEnabled}
                  onCheckedChange={(checked) => handleSettingChange('followUpEnabled', checked)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="reminderTiming">Reminder timing</Label>
              <Select value={settings.reminderTiming} onValueChange={(value) => handleSettingChange('reminderTiming', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 hours before</SelectItem>
                  <SelectItem value="24">1 day before</SelectItem>
                  <SelectItem value="48">2 days before</SelectItem>
                  <SelectItem value="72">3 days before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="confirmationMessage">Confirmation Message</Label>
            <Textarea
              id="confirmationMessage"
              value={settings.confirmationMessage}
              onChange={(e) => handleSettingChange('confirmationMessage', e.target.value)}
              className="mt-1"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use {'{name}'}, {'{date}'}, {'{time}'} as placeholders
            </p>
          </div>
          
          <div>
            <Label htmlFor="reminderMessage">Reminder Message</Label>
            <Textarea
              id="reminderMessage"
              value={settings.reminderMessage}
              onChange={(e) => handleSettingChange('reminderMessage', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            AI Automation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="aiBookingEnabled">AI-powered booking</Label>
              <p className="text-sm text-gray-500">Allow AI to automatically book appointments</p>
            </div>
            <Switch
              id="aiBookingEnabled"
              checked={settings.aiBookingEnabled}
              onCheckedChange={(checked) => handleSettingChange('aiBookingEnabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="aiReschedulingEnabled">AI rescheduling</Label>
              <p className="text-sm text-gray-500">Allow AI to handle reschedule requests</p>
            </div>
            <Switch
              id="aiReschedulingEnabled"
              checked={settings.aiReschedulingEnabled}
              onCheckedChange={(checked) => handleSettingChange('aiReschedulingEnabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="requireHumanApproval">Require human approval</Label>
              <p className="text-sm text-gray-500">All AI actions need staff confirmation</p>
            </div>
            <Switch
              id="requireHumanApproval"
              checked={settings.requireHumanApproval}
              onCheckedChange={(checked) => handleSettingChange('requireHumanApproval', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
          Save Settings
        </Button>
      </div>
    </div>
  );
};
