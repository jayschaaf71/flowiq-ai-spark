
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Bell, Shield, Users, Database, Mail } from 'lucide-react';
import { useTenantManagement, Tenant } from '@/hooks/useTenantManagement';

interface TenantSettingsManagerProps {
  tenant: Tenant;
}

export const TenantSettingsManager: React.FC<TenantSettingsManagerProps> = ({
  tenant
}) => {
  const [settings, setSettings] = useState({
    // Notification Settings
    email_notifications: true,
    sms_notifications: false,
    appointment_reminders: true,
    marketing_emails: false,
    
    // Security Settings
    two_factor_required: false,
    session_timeout: 30,
    password_policy: 'standard',
    audit_logging: true,
    
    // Feature Settings
    patient_portal: true,
    online_booking: true,
    ai_assistance: true,
    custom_forms: true,
    
    // Integration Settings
    calendar_sync: false,
    billing_integration: false,
    insurance_verification: false,
  });

  const { updateTenant, isUpdating } = useTenantManagement();

  const handleToggle = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In a real implementation, this would save to tenant_settings table
    console.log('Saving tenant settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Tenant Settings
          </h3>
          <p className="text-sm text-gray-600">Configure {tenant.brand_name} preferences and features</p>
        </div>
        <Button onClick={handleSave} disabled={isUpdating}>
          Save All Settings
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how your tenant receives notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive important updates via email</p>
                  </div>
                  <Switch
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive urgent alerts via SMS</p>
                  </div>
                  <Switch
                    checked={settings.sms_notifications}
                    onCheckedChange={(checked) => handleToggle('sms_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-gray-600">Automated patient appointment reminders</p>
                  </div>
                  <Switch
                    checked={settings.appointment_reminders}
                    onCheckedChange={(checked) => handleToggle('appointment_reminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-gray-600">Receive product updates and tips</p>
                  </div>
                  <Switch
                    checked={settings.marketing_emails}
                    onCheckedChange={(checked) => handleToggle('marketing_emails', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security policies for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication Required</Label>
                    <p className="text-sm text-gray-600">Require 2FA for all users</p>
                  </div>
                  <Switch
                    checked={settings.two_factor_required}
                    onCheckedChange={(checked) => handleToggle('two_factor_required', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Password Policy</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-gray-600">Log all user activities for compliance</p>
                  </div>
                  <Switch
                    checked={settings.audit_logging}
                    onCheckedChange={(checked) => handleToggle('audit_logging', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Feature Configuration
              </CardTitle>
              <CardDescription>Enable or disable features for your tenant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Patient Portal</Label>
                      <p className="text-sm text-gray-600">Allow patients to access their records</p>
                    </div>
                    <Switch
                      checked={settings.patient_portal}
                      onCheckedChange={(checked) => handleToggle('patient_portal', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Online Booking</Label>
                      <p className="text-sm text-gray-600">Enable online appointment scheduling</p>
                    </div>
                    <Switch
                      checked={settings.online_booking}
                      onCheckedChange={(checked) => handleToggle('online_booking', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>AI Assistance</Label>
                      <p className="text-sm text-gray-600">Enable AI-powered features</p>
                    </div>
                    <Switch
                      checked={settings.ai_assistance}
                      onCheckedChange={(checked) => handleToggle('ai_assistance', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Custom Forms</Label>
                      <p className="text-sm text-gray-600">Create custom intake forms</p>
                    </div>
                    <Switch
                      checked={settings.custom_forms}
                      onCheckedChange={(checked) => handleToggle('custom_forms', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Integration Settings
              </CardTitle>
              <CardDescription>Configure third-party integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Calendar Sync</Label>
                    <p className="text-sm text-gray-600">Sync with Google Calendar or Outlook</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Coming Soon</Badge>
                    <Switch
                      checked={settings.calendar_sync}
                      onCheckedChange={(checked) => handleToggle('calendar_sync', checked)}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Billing Integration</Label>
                    <p className="text-sm text-gray-600">Connect with billing software</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Coming Soon</Badge>
                    <Switch
                      checked={settings.billing_integration}
                      onCheckedChange={(checked) => handleToggle('billing_integration', checked)}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Insurance Verification</Label>
                    <p className="text-sm text-gray-600">Automated insurance verification</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Coming Soon</Badge>
                    <Switch
                      checked={settings.insurance_verification}
                      onCheckedChange={(checked) => handleToggle('insurance_verification', checked)}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle>Usage Limits</CardTitle>
              <CardDescription>Current plan limits and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{tenant.max_users}</div>
                  <p className="text-sm text-gray-600">Max Users</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{tenant.max_forms}</div>
                  <p className="text-sm text-gray-600">Max Forms</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{tenant.max_submissions}</div>
                  <p className="text-sm text-gray-600">Max Submissions</p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Current plan: <strong>{tenant.subscription_tier}</strong>
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Contact support to upgrade your plan for higher limits.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
