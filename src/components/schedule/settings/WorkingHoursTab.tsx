
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock } from "lucide-react";

interface WorkingHoursSettings {
  [key: string]: {
    start: string;
    end: string;
    enabled: boolean;
  };
}

interface WorkingHoursTabProps {
  settings: WorkingHoursSettings;
  onWorkingHoursChange: (day: string, field: string, value: string | boolean) => void;
}

export const WorkingHoursTab = ({ settings, onWorkingHoursChange }: WorkingHoursTabProps) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
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
                checked={settings[day]?.enabled || false}
                onCheckedChange={(checked) => onWorkingHoursChange(day, 'enabled', checked)}
              />
              <Label className="capitalize font-medium w-20">{day}</Label>
            </div>
            {settings[day]?.enabled && (
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={settings[day]?.start || "09:00"}
                  onChange={(e) => onWorkingHoursChange(day, 'start', e.target.value)}
                  className="w-32"
                />
                <span>to</span>
                <Input
                  type="time"
                  value={settings[day]?.end || "17:00"}
                  onChange={(e) => onWorkingHoursChange(day, 'end', e.target.value)}
                  className="w-32"
                />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
