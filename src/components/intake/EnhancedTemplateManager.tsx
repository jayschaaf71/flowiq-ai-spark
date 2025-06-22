
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Variable, 
  Settings,
  Library,
  TrendingUp,
  Download,
  Upload,
  TestTube
} from 'lucide-react';
import { TemplateLibrary } from './TemplateLibrary';
import { TemplateVariableSystem } from './TemplateVariableSystem';
import { TemplateEditor } from './TemplateEditor';
import { TemplateImportExport } from './TemplateImportExport';
import { EnhancedSMSTestPanel } from './EnhancedSMSTestPanel';

interface TemplateStats {
  totalTemplates: number;
  emailTemplates: number;
  smsTemplates: number;
  customVariables: number;
  totalUsage: number;
  mostUsedTemplate: string;
}

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  usageCount: number;
  lastUsed?: string;
  isBuiltIn: boolean;
}

export const EnhancedTemplateManager: React.FC = () => {
  const [stats] = useState<TemplateStats>({
    totalTemplates: 12,
    emailTemplates: 8,
    smsTemplates: 4,
    customVariables: 15,
    totalUsage: 342,
    mostUsedTemplate: 'Appointment Reminder SMS'
  });

  const [templates, setTemplates] = useState<Template[]>([]);

  const handleImportTemplates = (importedTemplates: Template[]) => {
    setTemplates(prev => [...prev, ...importedTemplates]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Template Management</h1>
          <p className="text-gray-600">Create, customize, and manage your communication templates</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold">{stats.totalTemplates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Variable className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Custom Variables</p>
                <p className="text-2xl font-bold">{stats.customVariables}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email vs SMS</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {stats.emailTemplates} Email
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {stats.smsTemplates} SMS
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="library" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Library className="w-4 h-4" />
            Library
          </TabsTrigger>
          <TabsTrigger value="variables" className="flex items-center gap-2">
            <Variable className="w-4 h-4" />
            Variables
          </TabsTrigger>
          <TabsTrigger value="import-export" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Import/Export
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <TemplateLibrary />
        </TabsContent>

        <TabsContent value="variables">
          <TemplateVariableSystem />
        </TabsContent>

        <TabsContent value="import-export">
          <TemplateImportExport 
            templates={templates}
            onImportTemplates={handleImportTemplates}
          />
        </TabsContent>

        <TabsContent value="testing">
          <EnhancedSMSTestPanel templates={templates} />
        </TabsContent>

        <TabsContent value="settings">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
