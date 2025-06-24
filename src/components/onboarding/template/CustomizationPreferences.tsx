
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogoUploadField } from './LogoUploadField';
import { ColorPickerField } from './ColorPickerField';

interface CustomizationPreferencesProps {
  customizationPreferences: {
    includeBranding: boolean;
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    brandName?: string;
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
        <CardTitle>Practice Branding & Customization</CardTitle>
        <CardDescription>
          Customize your practice's branding to appear on all templates and communications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Enable Custom Branding</Label>
            <p className="text-sm text-gray-600">Apply your practice branding to all templates</p>
          </div>
          <Switch
            checked={customizationPreferences.includeBranding}
            onCheckedChange={(checked) => onCustomizationChange('includeBranding', checked)}
          />
        </div>

        {customizationPreferences.includeBranding && (
          <div className="pl-4 space-y-6 border-l-2" style={{ borderColor: primaryColor + '20' }}>
            {/* Practice Name */}
            <div className="space-y-2">
              <Label>Practice Name</Label>
              <Input
                value={customizationPreferences.brandName || ''}
                onChange={(e) => onCustomizationChange('brandName', e.target.value)}
                placeholder="Enter your practice name"
              />
              <p className="text-xs text-gray-500">This will appear on your templates and communications</p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Practice Logo</Label>
              <LogoUploadField
                logoUrl={customizationPreferences.logoUrl}
                onLogoUpload={(logoUrl) => onCustomizationChange('logoUrl', logoUrl)}
                onLogoRemove={() => onCustomizationChange('logoUrl', undefined)}
              />
            </div>

            {/* Primary Color */}
            <ColorPickerField
              label="Primary Brand Color"
              value={customizationPreferences.primaryColor}
              onChange={(color) => onCustomizationChange('primaryColor', color)}
            />

            {/* Secondary Color */}
            <ColorPickerField
              label="Secondary Brand Color"
              value={customizationPreferences.secondaryColor}
              onChange={(color) => onCustomizationChange('secondaryColor', color)}
            />

            {/* Preview */}
            <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: customizationPreferences.primaryColor + '10' }}>
              <h4 className="font-medium mb-2">Branding Preview</h4>
              <div className="flex items-center gap-3">
                {customizationPreferences.logoUrl && (
                  <img 
                    src={customizationPreferences.logoUrl} 
                    alt="Logo preview" 
                    className="w-12 h-12 object-contain"
                  />
                )}
                <div>
                  <div 
                    className="text-lg font-semibold"
                    style={{ color: customizationPreferences.primaryColor }}
                  >
                    {customizationPreferences.brandName || 'Your Practice Name'}
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: customizationPreferences.secondaryColor }}
                  >
                    Professional Healthcare Services
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
