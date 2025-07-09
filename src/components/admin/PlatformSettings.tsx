import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Globe, Shield, Database, Bell } from 'lucide-react';

export const PlatformSettings = () => {
  const settingsCategories = [
    { 
      title: "System Configuration", 
      description: "Core platform settings and configurations",
      icon: Settings,
      items: ["API Rate Limits", "Default Timeouts", "Cache Settings"]
    },
    { 
      title: "Security Settings", 
      description: "Authentication and security configurations",
      icon: Shield,
      items: ["2FA Requirements", "Session Management", "Password Policies"]
    },
    { 
      title: "Database Settings", 
      description: "Database configuration and maintenance",
      icon: Database,
      items: ["Connection Pools", "Backup Schedule", "Query Optimization"]
    },
    { 
      title: "Notification Settings", 
      description: "Alert and notification configurations",
      icon: Bell,
      items: ["Alert Thresholds", "Email Templates", "Escalation Rules"]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global platform settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.title}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <CardTitle>{category.title}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div key={item} className="flex items-center justify-between p-2 rounded border">
                      <span className="text-sm">{item}</span>
                      <Button variant="ghost" size="sm">Configure</Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full" variant="outline">
                  View All Settings
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Platform Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform Name</label>
              <div className="p-2 border rounded bg-muted text-sm">FlowIQ AI Platform</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Timezone</label>
              <div className="p-2 border rounded bg-muted text-sm">UTC</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Maintenance Mode</label>
              <div className="p-2 border rounded bg-muted text-sm">Disabled</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">API Version</label>
              <div className="p-2 border rounded bg-muted text-sm">v2.1.0</div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline">Reset to Defaults</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};