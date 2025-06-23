
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Globe, 
  Shield, 
  Bell,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TemplateSettings {
  globalSettings: {
    defaultSender: string;
    defaultSenderEmail: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
  };
  emailSettings: {
    enableTracking: boolean;
    enableAutoResponse: boolean;
    signatureTemplate: string;
    unsubscribeLink: string;
  };
  smsSettings: {
    enableDeliveryReceipts: boolean;
    enableOptOut: boolean;
    defaultOptOutMessage: string;
    rateLimitPerHour: number;
  };
  styling: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoUrl: string;
  };
  compliance: {
    enableHIPAAMode: boolean;
    enableAuditLogging: boolean;
    dataRetentionDays: number;
    enableEncryption: boolean;
  };
}

const defaultSettings: TemplateSettings = {
  globalSettings: {
    defaultSender: 'Healthcare Practice',
    defaultSenderEmail: 'noreply@practice.com',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  },
  emailSettings: {
    enableTracking: true,
    enableAutoResponse: false,
    signatureTemplate: 'Best regards,\n{{practiceName}}',
    unsubscribeLink: 'https://practice.com/unsubscribe'
  },
  smsSettings: {
    enableDeliveryReceipts: true,
    enableOptOut: true,
    defaultOptOutMessage: 'Reply STOP to opt out',
    rateLimitPerHour: 100
  },
  styling: {
    primaryColor: '#3B82F6',
    secondaryColor: '#06B6D4',
    fontFamily: 'Inter, sans-serif',
    logoUrl: ''
  },
  compliance: {
    enableHIPAAMode: true,
    enableAuditLogging: true,
    dataRetentionDays: 2555, // 7 years
    enableEncryption: true
  }
};

export const TemplateSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<TemplateSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Template settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateGlobalSettings = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        [key]: value
      }
    }));
  };

  const updateEmailSettings = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      emailSettings: {
        ...prev.emailSettings,
        [key]: value
      }
    }));
  };

  const updateSMSSettings = (key: string, value: boolean | string | number) => {
    setSettings(prev => ({
      ...prev,
      smsSettings: {
        ...prev.smsSettings,
        [key]: value
      }
    }));
  };

  const updateStyling = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      styling: {
        ...prev.styling,
        [key]: value
      }
    }));
  };

  const updateCompliance = (key: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      compliance: {
        ...prev.compliance,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Template Settings</h3>
          <p className="text-gray-600">
            Configure global settings for your template system
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Global Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default Sender Name</Label>
              <Input
                value={settings.globalSettings.defaultSender}
                onChange={(e) => updateGlobalSettings('defaultSender', e.target.value)}
                placeholder="Your Practice Name"
              />
            </div>
            <div>
              <Label>Default Sender Email</Label>
              <Input
                value={settings.globalSettings.defaultSenderEmail}
                onChange={(e) => updateGlobalSettings('defaultSenderEmail', e.target.value)}
                placeholder="noreply@yourpractice.com"
                type="email"
              />
            </div>
            <div>
              <Label>Timezone</Label>
              <Select 
                value={settings.globalSettings.timezone}
                onValueChange={(value) => updateGlobalSettings('timezone', value)}
              >
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date Format</Label>
                <Select 
                  value={settings.globalSettings.dateFormat}
                  onValueChange={(value) => updateGlobalSettings('dateFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time Format</Label>
                <Select 
                  value={settings.globalSettings.timeFormat}
                  onValueChange={(value) => updateGlobalSettings('timeFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 Hour</SelectItem>
                    <SelectItem value="24h">24 Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Email Tracking</Label>
              <Switch 
                checked={settings.emailSettings.enableTracking}
                onCheckedChange={(checked) => updateEmailSettings('enableTracking', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable Auto-Response</Label>
              <Switch 
                checked={settings.emailSettings.enableAutoResponse}
                onCheckedChange={(checked) => updateEmailSettings('enableAutoResponse', checked)}
              />
            </div>
            <div>
              <Label>Email Signature Template</Label>
              <Textarea
                value={settings.emailSettings.signatureTemplate}
                onChange={(e) => updateEmailSettings('signatureTemplate', e.target.value)}
                placeholder="Best regards,\n{{practiceName}}"
                rows={3}
              />
            </div>
            <div>
              <Label>Unsubscribe Link</Label>
              <Input
                value={settings.emailSettings.unsubscribeLink}
                onChange={(e) => updateEmailSettings('unsubscribeLink', e.target.value)}
                placeholder="https://yoursite.com/unsubscribe"
              />
            </div>
          </CardContent>
        </Card>

        {/* SMS Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              SMS Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Delivery Receipts</Label>
              <Switch 
                checked={settings.smsSettings.enableDeliveryReceipts}
                onCheckedChange={(checked) => updateSMSSettings('enableDeliveryReceipts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable Opt-Out</Label>
              <Switch 
                checked={settings.smsSettings.enableOptOut}
                onCheckedChange={(checked) => updateSMSSettings('enableOptOut', checked)}
              />
            </div>
            <div>
              <Label>Default Opt-Out Message</Label>
              <Input
                value={settings.smsSettings.defaultOptOutMessage}
                onChange={(e) => updateSMSSettings('defaultOptOutMessage', e.target.value)}
                placeholder="Reply STOP to opt out"
              />
            </div>
            <div>
              <Label>Rate Limit (per hour)</Label>
              <Input
                type="number"
                value={settings.smsSettings.rateLimitPerHour}
                onChange={(e) => updateSMSSettings('rateLimitPerHour', parseInt(e.target.value) || 0)}
                placeholder="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Compliance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Compliance & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>HIPAA Compliance Mode</Label>
                <p className="text-xs text-gray-500">Enable enhanced security features</p>
              </div>
              <Switch 
                checked={settings.compliance.enableHIPAAMode}
                onCheckedChange={(checked) => updateCompliance('enableHIPAAMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable Audit Logging</Label>
              <Switch 
                checked={settings.compliance.enableAuditLogging}
                onCheckedChange={(checked) => updateCompliance('enableAuditLogging', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable Encryption</Label>
              <Switch 
                checked={settings.compliance.enableEncryption}
                onCheckedChange={(checked) => updateCompliance('enableEncryption', checked)}
              />
            </div>
            <div>
              <Label>Data Retention (days)</Label>
              <Input
                type="number"
                value={settings.compliance.dataRetentionDays}
                onChange={(e) => updateCompliance('dataRetentionDays', parseInt(e.target.value) || 0)}
                placeholder="2555"
              />
              <p className="text-xs text-gray-500 mt-1">
                Default: 2555 days (7 years) for healthcare compliance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
