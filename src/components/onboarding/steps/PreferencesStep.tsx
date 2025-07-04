import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingData } from '@/hooks/usePatientOnboarding';
import { Settings, Bell, Globe, Accessibility } from 'lucide-react';

interface PreferencesStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  specialty?: string;
}

export const PreferencesStep: React.FC<PreferencesStepProps> = ({
  data,
  onUpdate,
  specialty
}) => {
  const preferences = data.portal_preferences || {};

  const handlePreferenceChange = (field: string, value: string | boolean) => {
    onUpdate({
      portal_preferences: {
        ...preferences,
        [field]: value
      }
    });
  };

  const handleAccessibilityToggle = (feature: string) => {
    const currentAccessibility = preferences.accessibility || [];
    const isSelected = currentAccessibility.includes(feature);
    
    const updatedAccessibility = isSelected
      ? currentAccessibility.filter(item => item !== feature)
      : [...currentAccessibility, feature];

    onUpdate({
      portal_preferences: {
        ...preferences,
        accessibility: updatedAccessibility
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Settings className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">Portal Preferences</h3>
        <p className="text-gray-600">
          Customize your patient portal experience
        </p>
      </div>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Communication Preferences
          </CardTitle>
          <CardDescription>
            How would you like to receive communications from us?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="communicationMethod">Preferred Communication Method</Label>
            <Select 
              value={preferences.communicationMethod || ''} 
              onValueChange={(value) => handlePreferenceChange('communicationMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preferred method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="text">Text Message</SelectItem>
                <SelectItem value="portal">Patient Portal Messages</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Appointment Reminders</Label>
                <p className="text-sm text-gray-600">Receive reminders about upcoming appointments</p>
              </div>
              <Switch
                checked={preferences.appointmentReminders !== false}
                onCheckedChange={(checked) => handlePreferenceChange('appointmentReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Educational Content</Label>
                <p className="text-sm text-gray-600">Receive health tips and educational materials</p>
              </div>
              <Switch
                checked={preferences.educationalContent === true}
                onCheckedChange={(checked) => handlePreferenceChange('educationalContent', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Billing Notifications</Label>
                <p className="text-sm text-gray-600">Receive billing and payment notifications</p>
              </div>
              <Switch
                checked={preferences.billingNotifications !== false}
                onCheckedChange={(checked) => handlePreferenceChange('billingNotifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language & Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language & Accessibility
          </CardTitle>
          <CardDescription>
            Customize your portal for your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="language">Preferred Language</Label>
            <Select 
              value={preferences.language || 'english'} 
              onValueChange={(value) => handlePreferenceChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Español (Spanish)</SelectItem>
                <SelectItem value="french">Français (French)</SelectItem>
                <SelectItem value="german">Deutsch (German)</SelectItem>
                <SelectItem value="italian">Italiano (Italian)</SelectItem>
                <SelectItem value="portuguese">Português (Portuguese)</SelectItem>
                <SelectItem value="chinese">中文 (Chinese)</SelectItem>
                <SelectItem value="arabic">العربية (Arabic)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Accessibility className="w-4 h-4" />
              <Label>Accessibility Features</Label>
            </div>
            
            {[
              { id: 'large-text', label: 'Large Text', description: 'Increase text size for better readability' },
              { id: 'high-contrast', label: 'High Contrast', description: 'Enhanced contrast for better visibility' },
              { id: 'screen-reader', label: 'Screen Reader Support', description: 'Optimized for screen reading software' },
              { id: 'reduced-motion', label: 'Reduced Motion', description: 'Minimize animations and transitions' }
            ].map((feature) => (
              <div key={feature.id} className="flex items-center justify-between">
                <div>
                  <Label>{feature.label}</Label>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
                <Switch
                  checked={(preferences.accessibility || []).includes(feature.id)}
                  onCheckedChange={() => handleAccessibilityToggle(feature.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Specialty-specific preferences */}
      {specialty === 'chiropractic' && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700">Chiropractic Care Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Pain Level Tracking</Label>
                <p className="text-sm text-gray-600">Track your pain levels between visits</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Exercise Reminders</Label>
                <p className="text-sm text-gray-600">Receive reminders for prescribed exercises</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      )}

      {specialty === 'dental-sleep-medicine' && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-700">Sleep Medicine Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Sleep Tracking</Label>
                <p className="text-sm text-gray-600">Track sleep quality and appliance usage</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Compliance Reminders</Label>
                <p className="text-sm text-gray-600">Reminders to use your sleep appliance</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Your Privacy Matters</h4>
        <p className="text-sm text-blue-700">
          All preference settings can be changed at any time from your portal settings. 
          Your communication preferences help us provide you with the best possible care experience 
          while respecting your privacy and communication needs.
        </p>
      </div>
    </div>
  );
};