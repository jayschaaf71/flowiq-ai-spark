import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  MessageSquare, 
  Mail, 
  Phone,
  Settings,
  Bell,
  Calendar,
  Zap,
  Shield,
  Globe,
  Save
} from 'lucide-react';

export const RemindSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Settings state
  const [reminderTiming, setReminderTiming] = useState({
    confirmationDelay: '15', // minutes after booking
    reminderTimes: ['24', '2'], // hours before appointment
    followUpDelay: '24', // hours after appointment
    noShowFollowUp: '2' // hours after missed appointment
  });

  const [communicationPrefs, setCommunicationPrefs] = useState({
    defaultMethod: 'sms',
    enableEmail: true,
    enableSMS: true,
    enableVoice: false,
    requireConsent: true
  });

  const [businessHours, setBusinessHours] = useState({
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'America/New_York',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    respectHolidays: true
  });

  const [automationRules, setAutomationRules] = useState({
    autoConfirmation: true,
    autoReminders: true,
    autoFollowUp: true,
    autoReschedule: false,
    maxRetries: '3',
    retryInterval: '2' // hours
  });

  const [escalationSettings, setEscalationSettings] = useState({
    enableEscalation: true,
    escalationDelay: '4', // hours
    escalationMethod: 'phone',
    assignToStaff: true,
    staffNotification: true
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Your reminder settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reminder Settings</h2>
          <p className="text-muted-foreground">Configure how and when reminders are sent to patients</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Tabs defaultValue="timing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="timing">
            <Clock className="w-4 h-4 mr-2" />
            Timing
          </TabsTrigger>
          <TabsTrigger value="communication">
            <MessageSquare className="w-4 h-4 mr-2" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Zap className="w-4 h-4 mr-2" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="escalation">
            <Bell className="w-4 h-4 mr-2" />
            Escalation
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Settings className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Timing</CardTitle>
              <CardDescription>Set when reminders should be sent relative to appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="confirmationDelay">Confirmation Delay</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="confirmationDelay"
                      type="number"
                      value={reminderTiming.confirmationDelay}
                      onChange={(e) => setReminderTiming({...reminderTiming, confirmationDelay: e.target.value})}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">minutes after booking</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="followUpDelay">Follow-up Delay</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="followUpDelay"
                      type="number"
                      value={reminderTiming.followUpDelay}
                      onChange={(e) => setReminderTiming({...reminderTiming, followUpDelay: e.target.value})}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">hours after appointment</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Reminder Schedule</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reminderTiming.reminderTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={time}
                        onChange={(e) => {
                          const newTimes = [...reminderTiming.reminderTimes];
                          newTimes[index] = e.target.value;
                          setReminderTiming({...reminderTiming, reminderTimes: newTimes});
                        }}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">hours before</span>
                    </div>
                  ))}
                  <Button variant="outline" size="sm">
                    Add Reminder
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Business Hours</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startTime" className="text-sm">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={businessHours.startTime}
                      onChange={(e) => setBusinessHours({...businessHours, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="text-sm">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={businessHours.endTime}
                      onChange={(e) => setBusinessHours({...businessHours, endTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone" className="text-sm">Timezone</Label>
                    <Select value={businessHours.timezone} onValueChange={(value) => setBusinessHours({...businessHours, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication Preferences</CardTitle>
              <CardDescription>Configure how reminders are delivered to patients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <div>
                      <Label>SMS Reminders</Label>
                      <p className="text-sm text-muted-foreground">Send text message reminders</p>
                    </div>
                  </div>
                  <Switch
                    checked={communicationPrefs.enableSMS}
                    onCheckedChange={(checked) => setCommunicationPrefs({...communicationPrefs, enableSMS: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <Label>Email Reminders</Label>
                      <p className="text-sm text-muted-foreground">Send email reminders</p>
                    </div>
                  </div>
                  <Switch
                    checked={communicationPrefs.enableEmail}
                    onCheckedChange={(checked) => setCommunicationPrefs({...communicationPrefs, enableEmail: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <div>
                      <Label>Voice Calls</Label>
                      <p className="text-sm text-muted-foreground">Automated voice reminders</p>
                    </div>
                    <Badge variant="secondary">Premium</Badge>
                  </div>
                  <Switch
                    checked={communicationPrefs.enableVoice}
                    onCheckedChange={(checked) => setCommunicationPrefs({...communicationPrefs, enableVoice: checked})}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Default Communication Method</Label>
                <Select value={communicationPrefs.defaultMethod} onValueChange={(value) => setCommunicationPrefs({...communicationPrefs, defaultMethod: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS First</SelectItem>
                    <SelectItem value="email">Email First</SelectItem>
                    <SelectItem value="voice">Voice Call</SelectItem>
                    <SelectItem value="patient_preference">Patient Preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Patient Consent</Label>
                  <p className="text-sm text-muted-foreground">Patients must opt-in to receive reminders</p>
                </div>
                <Switch
                  checked={communicationPrefs.requireConsent}
                  onCheckedChange={(checked) => setCommunicationPrefs({...communicationPrefs, requireConsent: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>Configure automatic reminder behaviors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Confirmation</Label>
                      <p className="text-sm text-muted-foreground">Send confirmation immediately after booking</p>
                    </div>
                    <Switch
                      checked={automationRules.autoConfirmation}
                      onCheckedChange={(checked) => setAutomationRules({...automationRules, autoConfirmation: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Reminders</Label>
                      <p className="text-sm text-muted-foreground">Send scheduled reminders automatically</p>
                    </div>
                    <Switch
                      checked={automationRules.autoReminders}
                      onCheckedChange={(checked) => setAutomationRules({...automationRules, autoReminders: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Follow-up</Label>
                      <p className="text-sm text-muted-foreground">Send follow-up after appointments</p>
                    </div>
                    <Switch
                      checked={automationRules.autoFollowUp}
                      onCheckedChange={(checked) => setAutomationRules({...automationRules, autoFollowUp: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Reschedule</Label>
                      <p className="text-sm text-muted-foreground">Allow patients to reschedule via text</p>
                    </div>
                    <Switch
                      checked={automationRules.autoReschedule}
                      onCheckedChange={(checked) => setAutomationRules({...automationRules, autoReschedule: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxRetries">Maximum Retry Attempts</Label>
                    <Select value={automationRules.maxRetries} onValueChange={(value) => setAutomationRules({...automationRules, maxRetries: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 attempt</SelectItem>
                        <SelectItem value="2">2 attempts</SelectItem>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retryInterval">Retry Interval</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="retryInterval"
                        type="number"
                        value={automationRules.retryInterval}
                        onChange={(e) => setAutomationRules({...automationRules, retryInterval: e.target.value})}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">hours between retries</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Escalation Settings</CardTitle>
              <CardDescription>Configure what happens when patients don't respond</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Escalation</Label>
                  <p className="text-sm text-muted-foreground">Escalate unresponsive patients to staff</p>
                </div>
                <Switch
                  checked={escalationSettings.enableEscalation}
                  onCheckedChange={(checked) => setEscalationSettings({...escalationSettings, enableEscalation: checked})}
                />
              </div>

              {escalationSettings.enableEscalation && (
                <div className="space-y-4 pl-4 border-l-2 border-muted">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="escalationDelay">Escalation Delay</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="escalationDelay"
                          type="number"
                          value={escalationSettings.escalationDelay}
                          onChange={(e) => setEscalationSettings({...escalationSettings, escalationDelay: e.target.value})}
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">hours after no response</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="escalationMethod">Escalation Method</Label>
                      <Select value={escalationSettings.escalationMethod} onValueChange={(value) => setEscalationSettings({...escalationSettings, escalationMethod: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="email">Staff Email</SelectItem>
                          <SelectItem value="task">Create Task</SelectItem>
                          <SelectItem value="all">All Methods</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Assign to Staff</Label>
                      <p className="text-sm text-muted-foreground">Automatically assign escalated cases to available staff</p>
                    </div>
                    <Switch
                      checked={escalationSettings.assignToStaff}
                      onCheckedChange={(checked) => setEscalationSettings({...escalationSettings, assignToStaff: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Staff Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify staff when cases are escalated</p>
                    </div>
                    <Switch
                      checked={escalationSettings.staffNotification}
                      onCheckedChange={(checked) => setEscalationSettings({...escalationSettings, staffNotification: checked})}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>HIPAA Compliance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enhanced security for PHI</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all reminder activities</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Retention</Label>
                    <p className="text-sm text-muted-foreground">Auto-delete old reminder logs</p>
                  </div>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Integration Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>EHR Integration</Label>
                    <p className="text-sm text-muted-foreground">Sync with external EHR systems</p>
                  </div>
                  <Badge variant="outline">Connected</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Calendar Sync</Label>
                    <p className="text-sm text-muted-foreground">Two-way calendar synchronization</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Webhook Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send events to external systems</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://your-system.com/webhooks/reminders"
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom Message Templates</CardTitle>
              <CardDescription>Customize default reminder messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmationTemplate">Confirmation Message</Label>
                <Textarea
                  id="confirmationTemplate"
                  placeholder="Hi {patient_name}, your appointment with {provider_name} is confirmed for {date} at {time}. Reply STOP to opt out."
                  defaultValue="Hi {patient_name}, your appointment with {provider_name} is confirmed for {date} at {time}. Reply STOP to opt out."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderTemplate">Reminder Message</Label>
                <Textarea
                  id="reminderTemplate"
                  placeholder="Reminder: You have an appointment tomorrow at {time} with {provider_name}. Reply YES to confirm or RESCHEDULE to change."
                  defaultValue="Reminder: You have an appointment tomorrow at {time} with {provider_name}. Reply YES to confirm or RESCHEDULE to change."
                />
              </div>

              <div className="space-y-2">
                <Label>Available Variables</Label>
                <div className="flex flex-wrap gap-2">
                  {['{patient_name}', '{provider_name}', '{date}', '{time}', '{location}', '{phone}'].map((variable) => (
                    <Badge key={variable} variant="secondary" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};