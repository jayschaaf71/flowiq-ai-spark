import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Library,
  Variable,
  Download,
  TestTube,
  Settings
} from 'lucide-react';
import { TemplateLibrary } from './TemplateLibrary';
import { TemplateVariableSystem } from './TemplateVariableSystem';
import { TemplateImportExport } from './TemplateImportExport';
import { EnhancedSMSTestPanel } from './EnhancedSMSTestPanel';
import { TemplateSettingsTab } from './TemplateSettingsTab';
import { TemplateTestingPanel } from './TemplateTestingPanel';
import { TemplateSettingsPanel } from './TemplateSettingsPanel';
import { Template } from '@/hooks/useTemplates';

interface TemplateManagerTabsProps {
  templates: Template[];
  onImportTemplates: (templates: Template[]) => void;
}

export const TemplateManagerTabs: React.FC<TemplateManagerTabsProps> = ({
  templates,
  onImportTemplates
}) => {
  const handleImportComplete = () => {
    // Refresh templates after import
    window.location.reload(); // Simple refresh for now
  };

  return (
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
          onImportComplete={handleImportComplete}
        />
      </TabsContent>

      <TabsContent value="testing">
        <TemplateTestingPanel templates={templates} />
      </TabsContent>

      <TabsContent value="settings">
        <TemplateSettingsPanel />
      </TabsContent>
    </Tabs>
  );
};
