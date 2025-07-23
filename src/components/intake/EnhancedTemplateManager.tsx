
import React from 'react';
import { TemplateStatsOverview } from './TemplateStatsOverview';
import { TemplateManagerTabs } from './TemplateManagerTabs';
import { useTemplates } from '@/hooks/useTemplates';

export const EnhancedTemplateManager: React.FC = () => {
  const { templates } = useTemplates();

  interface ImportedTemplate {
    id: string;
    name: string;
    content: string;
    type: string;
  }

  const handleImportTemplates = (importedTemplates: ImportedTemplate[]) => {
    // This will be implemented when we create the import functionality
    console.log('Importing templates:', importedTemplates);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Template Management</h1>
          <p className="text-muted-foreground">Create, customize, and manage your communication templates</p>
        </div>
      </div>

      <TemplateStatsOverview />

      <TemplateManagerTabs 
        templates={templates}
        onImportTemplates={handleImportTemplates}
      />
    </div>
  );
};
