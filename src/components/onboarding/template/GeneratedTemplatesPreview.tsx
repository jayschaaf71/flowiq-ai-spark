
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateItem } from './types';

interface GeneratedTemplatesPreviewProps {
  selectedTemplates: string[];
  availableTemplates: TemplateItem[];
  hasGenerated: boolean;
}

export const GeneratedTemplatesPreview: React.FC<GeneratedTemplatesPreviewProps> = ({
  selectedTemplates,
  availableTemplates,
  hasGenerated
}) => {
  if (!hasGenerated) return null;

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-900">Generated Templates</CardTitle>
        <CardDescription className="text-green-700">
          Your specialty-specific templates are ready to use.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {selectedTemplates.map((templateId) => {
            const template = availableTemplates.find(t => t.id === templateId);
            return (
              <div key={templateId} className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm font-medium">{template?.name}</span>
                <Badge className="bg-green-100 text-green-800">
                  {template?.templates_count} templates
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
