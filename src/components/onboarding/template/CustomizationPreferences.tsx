
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CustomizationPreferencesProps {
  customizationPreferences: {
    includeBranding: boolean;
    primaryColor: string;
    secondaryColor: string;
  };
  onCustomizationChange: (key: string, value: any) => void;
  primaryColor: string;
}

export const CustomizationPreferences: React.FC<CustomizationPreferencesProps> = ({
  customizationPreferences,
  onCustomizationChange,
  primaryColor
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customization Preferences</CardTitle>
        <CardDescription>
          Customize how your templates will look and feel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Include Practice Branding</Label>
            <p className="text-sm text-gray-600">Add your practice colors and styling</p>
          </div>
          <Switch
            checked={customizationPreferences.includeBranding}
            onCheckedChange={(checked) => onCustomizationChange('includeBranding', checked)}
          />
        </div>

        {customizationPreferences.includeBranding && (
          <div className="pl-4 space-y-3 border-l-2" style={{ borderColor: primaryColor }}>
            <div>
              <Label>Primary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: customizationPreferences.primaryColor }}
                ></div>
                <span className="text-sm font-mono">{customizationPreferences.primaryColor}</span>
              </div>
            </div>
            <div>
              <Label>Secondary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: customizationPreferences.secondaryColor }}
                ></div>
                <span className="text-sm font-mono">{customizationPreferences.secondaryColor}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
