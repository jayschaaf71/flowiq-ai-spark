
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const TemplateSettingsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Default Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Email Templates</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Default From Name</label>
                    <p className="text-sm font-medium">Your Practice Name</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Default From Email</label>
                    <p className="text-sm font-medium">noreply@yourpractice.com</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Reply-To Email</label>
                    <p className="text-sm font-medium">contact@yourpractice.com</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit Email Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">SMS Templates</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Default Sender Name</label>
                    <p className="text-sm font-medium">Your Practice</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Character Limit Warning</label>
                    <p className="text-sm font-medium">160 characters</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Cost Per Segment</label>
                    <p className="text-sm font-medium">$0.0075</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit SMS Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Template Preferences</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Auto-save templates</p>
                <p className="text-sm text-gray-600">Automatically save template changes</p>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Template validation</p>
                <p className="text-sm text-gray-600">Validate template syntax before saving</p>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Usage analytics</p>
                <p className="text-sm text-gray-600">Track template usage and performance</p>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
