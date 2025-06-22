
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileJson } from 'lucide-react';
import { TemplateExportSection } from './TemplateExportSection';
import { TemplateImportSection } from './TemplateImportSection';
import { ImportGuidelines } from './ImportGuidelines';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  styling?: {
    primaryColor?: string;
    fontFamily?: string;
    backgroundColor?: string;
  };
}

interface TemplateImportExportProps {
  templates: Template[];
  onImportTemplates: (templates: Template[]) => void;
}

export const TemplateImportExport: React.FC<TemplateImportExportProps> = ({
  templates,
  onImportTemplates
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson className="w-5 h-5" />
          Import / Export Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TemplateExportSection templates={templates} />
          <TemplateImportSection onImportTemplates={onImportTemplates} />
        </div>

        <ImportGuidelines />
      </CardContent>
    </Card>
  );
};
