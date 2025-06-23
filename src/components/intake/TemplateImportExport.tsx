
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileJson } from 'lucide-react';
import { TemplateExportSection } from './TemplateExportSection';
import { TemplateImportSection } from './TemplateImportSection';
import { ImportGuidelines } from './ImportGuidelines';
import { Template } from '@/hooks/useTemplates';

interface TemplateImportExportProps {
  templates: Template[];
  onImportComplete?: () => void;
}

export const TemplateImportExport: React.FC<TemplateImportExportProps> = ({
  templates,
  onImportComplete
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
          <TemplateImportSection onImportComplete={onImportComplete} />
        </div>

        <ImportGuidelines />
      </CardContent>
    </Card>
  );
};
