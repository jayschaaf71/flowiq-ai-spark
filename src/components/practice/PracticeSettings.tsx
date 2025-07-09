import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Building,
  Clock,
  Bell,
  Shield,
  Palette
} from 'lucide-react';

export const PracticeSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Practice Settings</h1>
        <p className="text-muted-foreground">Configure your practice preferences and operations</p>
      </div>

      {/* Practice Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Practice Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="practice-name">Practice Name</Label>
              <Input id="practice-name" defaultValue="Downtown Medical Center" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="practice-phone">Phone Number</Label>
              <Input id="practice-phone" defaultValue="(555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="practice-email">Email Address</Label>
              <Input id="practice-email" defaultValue="contact@downtown-medical.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="practice-specialty">Specialty</Label>
              <Input id="practice-specialty" defaultValue="Family Medicine" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="practice-address">Address</Label>
            <Input id="practice-address" defaultValue="123 Medical Plaza, Suite 100, Downtown, ST 12345" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Operating Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-20">
                    <span className="font-medium">{day}</span>
                  </div>
                  <Switch defaultChecked={day !== 'Sunday'} />
                </div>
                {day !== 'Sunday' && (
                  <div className="flex items-center space-x-2">
                    <Input className="w-24" defaultValue="9:00 AM" />
                    <span>to</span>
                    <Input className="w-24" defaultValue="5:00 PM" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button>Update Hours</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Appointment Reminders</p>
                <p className="text-sm text-muted-foreground">Send automatic reminders to patients</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Staff Notifications</p>
                <p className="text-sm text-muted-foreground">Notify staff of schedule changes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Billing Alerts</p>
                <p className="text-sm text-muted-foreground">Alert for overdue payments</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Require 2FA for all staff accounts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">HIPAA Audit Logging</p>
                <p className="text-sm text-muted-foreground">Log all patient data access</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input className="w-16" defaultValue="30" />
                <span className="text-sm">minutes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance & Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded border bg-blue-600"></div>
                <Input id="primary-color" defaultValue="#2563eb" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Practice Logo</Label>
              <Input id="logo-upload" type="file" accept="image/*" />
            </div>
          </div>
          <Button>Update Branding</Button>
        </CardContent>
      </Card>
    </div>
  );
};