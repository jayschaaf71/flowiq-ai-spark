
import React, { useState } from 'react';
import { TemplateStatsOverview } from './TemplateStatsOverview';
import { TemplateManagerTabs } from './TemplateManagerTabs';

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

      <TemplateStatsOverview stats={stats} />

      <TemplateManagerTabs 
        templates={templates}
        onImportTemplates={handleImportTemplates}
      />
    </div>
  );
};
