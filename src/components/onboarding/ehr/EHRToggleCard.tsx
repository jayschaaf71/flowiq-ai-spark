
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Database } from "lucide-react";

interface EHRToggleCardProps {
  enableIntegration: boolean;
  onToggle: (enabled: boolean) => void;
  primaryColor: string;
  brandName: string;
}

export const EHRToggleCard: React.FC<EHRToggleCardProps> = ({
  enableIntegration,
  onToggle,
  primaryColor,
  brandName
}) => {
  return (
    <Card className="border-2" style={{ borderColor: primaryColor + '20' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" style={{ color: primaryColor }} />
          EHR Integration
        </CardTitle>
        <CardDescription>
          Seamlessly sync patient data, appointments, and clinical notes with your existing EHR system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Enable EHR Integration</Label>
            <p className="text-sm text-gray-600">Connect with your practice management system</p>
          </div>
          <Switch
            checked={enableIntegration}
            onCheckedChange={onToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};
