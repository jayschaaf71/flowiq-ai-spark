
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TemplateSettings {
  emailProvider: 'resend' | 'sendgrid' | 'mailgun';
  smsProvider: 'twilio' | 'messagebird' | 'vonage';
  defaultFromEmail: string;
  defaultFromName: string;
  autoApproval: boolean;
  requireReview: boolean;
  enableVersioning: boolean;
  maxTemplateSize: number;
}

export const TemplateSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<TemplateSettings>({
    emailProvider: 'resend',
    smsProvider: 'twilio',
    defaultFromEmail: 'noreply@yourpractice.com',
    defaultFromName: 'Your Practice',
    autoApproval: false,
    requireReview: true,
    enableVersioning: true,
    maxTemplateSize: 10000
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Template settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save template settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Template Settings</h2>
          <p className="text-gray-600">Configure template system preferences and integrations</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email Provider</Label>
              <Select 
                value={settings.emailProvider} 
                onValueChange={(value: any) => setSettings(prev => ({ ...prev, emailProvider: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resend">Resend</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Default From Email</Label>
              <Input
                value={settings.defaultFromEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultFromEmail: e.target.value }))}
                placeholder="noreply@yourpractice.com"
                type="email"
              />
            </div>

            <div>
              <Label>Default From Name</Label>
              <Input
                value={settings.defaultFromName}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultFromName: e.target.value }))}
                placeholder="Your Practice Name"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              SMS Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>SMS Provider</Label>
              <Select 
                value={settings.smsProvider} 
                onValueChange={(value: any) => setSettings(prev => ({ ...prev, smsProvider: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="messagebird">MessageBird</SelectItem>
                  <SelectItem value="vonage">Vonage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                Configure your SMS provider credentials in the main settings panel.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Template Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-approve templates</Label>
                <p className="text-sm text-gray-600">Automatically approve new templates</p>
              </div>
              <Switch
                checked={settings.autoApproval}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoApproval: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Require review</Label>
                <p className="text-sm text-gray-600">Require manager review before publishing</p>
              </div>
              <Switch
                checked={settings.requireReview}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireReview: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Enable versioning</Label>
                <p className="text-sm text-gray-600">Keep track of template changes</p>
              </div>
              <Switch
                checked={settings.enableVersioning}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableVersioning: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Maximum Template Size (characters)</Label>
              <Input
                type="number"
                value={settings.maxTemplateSize}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  maxTemplateSize: parseInt(e.target.value) || 10000 
                }))}
                min="1000"
                max="50000"
              />
              <p className="text-sm text-gray-600 mt-1">
                Recommended: 10,000 characters for email, 1,600 for SMS
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
