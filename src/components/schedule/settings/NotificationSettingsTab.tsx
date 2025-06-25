
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface NotificationSettings {
  emailReminders: boolean;
  smsReminders: boolean;
  reminderTiming: number[];
  confirmationRequired: boolean;
  autoReschedule: boolean;
}

interface NotificationSettingsTabProps {
  settings: NotificationSettings;
  onSettingsChange: (updates: Partial<NotificationSettings>) => void;
}

export const NotificationSettingsTab = ({ settings, onSettingsChange }: NotificationSettingsTabProps) => {
  return (
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
              checked={settings.emailReminders}
              onCheckedChange={(checked) => onSettingsChange({ emailReminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>SMS Reminders</Label>
              <p className="text-sm text-gray-600">Send appointment reminders via text message</p>
            </div>
            <Switch
              checked={settings.smsReminders}
              onCheckedChange={(checked) => onSettingsChange({ smsReminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Confirmation Required</Label>
              <p className="text-sm text-gray-600">Require patients to confirm appointments</p>
            </div>
            <Switch
              checked={settings.confirmationRequired}
              onCheckedChange={(checked) => onSettingsChange({ confirmationRequired: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Reschedule</Label>
              <p className="text-sm text-gray-600">Automatically reschedule cancelled appointments</p>
            </div>
            <Switch
              checked={settings.autoReschedule}
              onCheckedChange={(checked) => onSettingsChange({ autoReschedule: checked })}
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
  );
};
