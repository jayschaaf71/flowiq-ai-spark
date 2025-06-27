
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';

interface BusinessHours {
  start: string;
  end: string;
  timezone: string;
}

interface AutomationSettingsProps {
  automationLevel: number;
  businessHours: BusinessHours;
  onAutomationLevelChange: (level: number) => void;
  onBusinessHoursChange: (hours: BusinessHours) => void;
}

export const AutomationSettings: React.FC<AutomationSettingsProps> = ({
  automationLevel,
  businessHours,
  onAutomationLevelChange,
  onBusinessHoursChange
}) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Automation Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Automation Level</label>
            <Badge variant="outline">{automationLevel}%</Badge>
          </div>
          <Slider
            value={[automationLevel]}
            onValueChange={(value) => onAutomationLevelChange(value[0])}
            max={100}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Conservative</span>
            <span>Balanced</span>
            <span>Aggressive</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Business Hours Start</label>
            <input
              type="time"
              value={businessHours.start}
              onChange={(e) => onBusinessHoursChange({
                ...businessHours,
                start: e.target.value
              })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Business Hours End</label>
            <input
              type="time"
              value={businessHours.end}
              onChange={(e) => onBusinessHoursChange({
                ...businessHours,
                end: e.target.value
              })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Timezone</label>
            <select
              value={businessHours.timezone}
              onChange={(e) => onBusinessHoursChange({
                ...businessHours,
                timezone: e.target.value
              })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
