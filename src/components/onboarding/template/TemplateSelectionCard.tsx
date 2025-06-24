
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { TemplateItem } from './types';

interface TemplateSelectionCardProps {
  availableTemplates: TemplateItem[];
  selectedTemplates: string[];
  onTemplateToggle: (templateId: string, enabled: boolean) => void;
  primaryColor: string;
}

export const TemplateSelectionCard: React.FC<TemplateSelectionCardProps> = ({
  availableTemplates,
  selectedTemplates,
  onTemplateToggle,
  primaryColor
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" style={{ color: primaryColor }} />
          Select Templates to Generate
        </CardTitle>
        <CardDescription>
          Choose which templates you'd like us to create for your practice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {availableTemplates.map((template) => {
            const Icon = template.icon;
            const isSelected = selectedTemplates.includes(template.id);
            
            return (
              <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {template.templates_count} templates
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ~{template.estimated_time}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={isSelected}
                  onCheckedChange={(checked) => onTemplateToggle(template.id, checked)}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
