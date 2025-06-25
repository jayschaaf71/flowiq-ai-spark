
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface AppointmentSettings {
  defaultDuration: number;
  bufferTime: number;
  maxAdvanceBooking: number;
  minAdvanceBooking: number;
  allowOnlineBooking: boolean;
  requireDeposit: boolean;
  depositAmount: number;
}

interface AppointmentConfigTabProps {
  settings: AppointmentSettings;
  onSettingsChange: (updates: Partial<AppointmentSettings>) => void;
}

export const AppointmentConfigTab = ({ settings, onSettingsChange }: AppointmentConfigTabProps) => {
  return (
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
            <Select 
              value={settings.defaultDuration.toString()} 
              onValueChange={(value) => onSettingsChange({ defaultDuration: parseInt(value) })}
            >
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
            <Select 
              value={settings.bufferTime.toString()} 
              onValueChange={(value) => onSettingsChange({ bufferTime: parseInt(value) })}
            >
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
              value={settings.maxAdvanceBooking}
              onChange={(e) => onSettingsChange({ maxAdvanceBooking: parseInt(e.target.value) || 90 })}
            />
          </div>

          <div className="space-y-2">
            <Label>Min Advance Booking (hours)</Label>
            <Input
              type="number"
              value={settings.minAdvanceBooking}
              onChange={(e) => onSettingsChange({ minAdvanceBooking: parseInt(e.target.value) || 2 })}
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
              checked={settings.allowOnlineBooking}
              onCheckedChange={(checked) => onSettingsChange({ allowOnlineBooking: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Require Deposit</Label>
              <p className="text-sm text-gray-600">Require payment to secure appointment</p>
            </div>
            <Switch
              checked={settings.requireDeposit}
              onCheckedChange={(checked) => onSettingsChange({ requireDeposit: checked })}
            />
          </div>

          {settings.requireDeposit && (
            <div className="space-y-2">
              <Label>Deposit Amount ($)</Label>
              <Input
                type="number"
                value={settings.depositAmount}
                onChange={(e) => onSettingsChange({ depositAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
