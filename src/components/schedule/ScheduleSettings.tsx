
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings, Clock, Bell, Brain, Calendar, Users, Shield } from "lucide-react";

export const ScheduleSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    workingHours: {
      monday: { start: "09:00", end: "17:00", enabled: true },
      tuesday: { start: "09:00", end: "17:00", enabled: true },
      wednesday: { start: "09:00", end: "17:00", enabled: true },
      thursday: { start: "09:00", end: "17:00", enabled: true },
      friday: { start: "09:00", end: "17:00", enabled: true },
      saturday: { start: "09:00", end: "13:00", enabled: false },
      sunday: { start: "09:00", end: "13:00", enabled: false }
    },
    appointments: {
      defaultDuration: 60,
      bufferTime: 15,
      maxAdvanceBooking: 90,
      minAdvanceBooking: 2,
      allowOnlineBooking: true,
      requireDeposit: false,
      depositAmount: 0
    },
    notifications: {
      emailReminders: true,
      smsReminders: true,
      reminderTiming: [24, 2], // hours before
      confirmationRequired: true,
      autoReschedule: false
    },
    aiSettings: {
      autoOptimization: true,
      conflictResolution: true,
      predictiveScheduling: true,
      waitlistManagement: true,
      noShowPrediction: true,
      smartReminders: true
    }
  });

  const handleSave = () => {
    // In a real implementation, this would save to the database
    toast({
      title: "Settings Saved",
      description: "Your schedule settings have been updated successfully.",
    });
  };

  const handleWorkingHoursChange = (day: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value
        }
      }
    }));
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Schedule Settings</h2>
          <p className="text-gray-600">Configure your scheduling preferences and AI automation</p>
        </div>
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="hours" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Working Hours
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Working Hours Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {days.map((day) => (
                <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={settings.workingHours[day as keyof typeof settings.workingHours].enabled}
                      onCheckedChange={(checked) => handleWorkingHoursChange(day, 'enabled', checked)}
                    />
                    <Label className="capitalize font-medium w-20">{day}</Label>
                  </div>
                  {settings.workingHours[day as keyof typeof settings.workingHours].enabled && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={settings.workingHours[day as keyof typeof settings.workingHours].start}
                        onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={settings.workingHours[day as keyof typeof settings.workingHours].end}
                        onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Appointment Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Duration (minutes)</Label>
                  <Select value={settings.appointments.defaultDuration.toString()} onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, appointments: { ...prev.appointments, defaultDuration: parseInt(value) } }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Buffer Time (minutes)</Label>
                  <Select value={settings.appointments.bufferTime.toString()} onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, appointments: { ...prev.appointments, bufferTime: parseInt(value) } }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No buffer</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Advance Booking (days)</Label>
                  <Input
                    type="number"
                    value={settings.appointments.maxAdvanceBooking}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      appointments: { ...prev.appointments, maxAdvanceBooking: parseInt(e.target.value) || 90 } 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Min Advance Booking (hours)</Label>
                  <Input
                    type="number"
                    value={settings.appointments.minAdvanceBooking}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      appointments: { ...prev.appointments, minAdvanceBooking: parseInt(e.target.value) || 2 } 
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Online Booking</Label>
                    <p className="text-sm text-gray-600">Enable patients to book appointments online</p>
                  </div>
                  <Switch
                    checked={settings.appointments.allowOnlineBooking}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      appointments: { ...prev.appointments, allowOnlineBooking: checked } 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Deposit</Label>
                    <p className="text-sm text-gray-600">Require payment to secure appointment</p>
                  </div>
                  <Switch
                    checked={settings.appointments.requireDeposit}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      appointments: { ...prev.appointments, requireDeposit: checked } 
                    }))}
                  />
                </div>

                {settings.appointments.requireDeposit && (
                  <div className="space-y-2">
                    <Label>Deposit Amount ($)</Label>
                    <Input
                      type="number"
                      value={settings.appointments.depositAmount}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        appointments: { ...prev.appointments, depositAmount: parseFloat(e.target.value) || 0 } 
                      }))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Reminders</Label>
                    <p className="text-sm text-gray-600">Send appointment reminders via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailReminders}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      notifications: { ...prev.notifications, emailReminders: checked } 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Reminders</Label>
                    <p className="text-sm text-gray-600">Send appointment reminders via text message</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsReminders}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      notifications: { ...prev.notifications, smsReminders: checked } 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Confirmation Required</Label>
                    <p className="text-sm text-gray-600">Require patients to confirm appointments</p>
                  </div>
                  <Switch
                    checked={settings.notifications.confirmationRequired}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      notifications: { ...prev.notifications, confirmationRequired: checked } 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Reschedule</Label>
                    <p className="text-sm text-gray-600">Automatically reschedule cancelled appointments</p>
                  </div>
                  <Switch
                    checked={settings.notifications.autoReschedule}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      notifications: { ...prev.notifications, autoReschedule: checked } 
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reminder Timing</Label>
                <p className="text-sm text-gray-600">When to send reminders (hours before appointment)</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">24 hours</Badge>
                  <Badge variant="secondary">2 hours</Badge>
                  <Button variant="outline" size="sm">+ Add Timing</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
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
                    checked={settings.aiSettings.autoOptimization}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      aiSettings: { ...prev.aiSettings, autoOptimization: checked } 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Conflict Resolution</Label>
                    <p className="text-sm text-gray-600">AI resolves scheduling conflicts automatically</p>
                  </div>
                  <Switch
                    checked={settings.aiSettings.conflictResolution}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      aiSettings: { ...prev.aiSettings, conflictResolution: checked } 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Predictive Scheduling</Label>
                    <p className="text-sm text-gray-600">AI suggests optimal appointment times</p>
                  </div>
                  <Switch
                    checked={settings.aiSettings.predictiveScheduling}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      aiSettings: { ...prev.aiSettings, predictiveScheduling: checked } 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Waitlist Management</Label>
                    <p className="text-sm text-gray-600">Automatically manage patient waitlist</p>
                  </div>
                  <Switch
                    checked={settings.aiSettings.waitlistManagement}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      aiSettings: { ...prev.aiSettings, waitlistManagement: checked } 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>No-Show Prediction</Label>
                    <p className="text-sm text-gray-600">Predict and prevent no-shows with AI</p>
                  </div>
                  <Switch
                    checked={settings.aiSettings.noShowPrediction}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      aiSettings: { ...prev.aiSettings, noShowPrediction: checked } 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Smart Reminders</Label>
                    <p className="text-sm text-gray-600">AI optimizes reminder timing and content</p>
                  </div>
                  <Switch
                    checked={settings.aiSettings.smartReminders}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      aiSettings: { ...prev.aiSettings, smartReminders: checked } 
                    }))}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
