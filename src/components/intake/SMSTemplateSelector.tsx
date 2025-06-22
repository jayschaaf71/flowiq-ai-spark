
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  content: string;
  variables: string[];
}

interface SMSTemplateSelectorProps {
  templates: Template[];
  onTemplateSelect: (templateId: string) => void;
}

export const SMSTemplateSelector: React.FC<SMSTemplateSelectorProps> = ({
  templates,
  onTemplateSelect
}) => {
  const smsTemplates = templates.filter(t => t.type === 'sms');

  if (smsTemplates.length === 0) {
    return null;
  }

  return (
    <div>
      <Label>Select SMS Template</Label>
      <Select onValueChange={onTemplateSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a template..." />
        </SelectTrigger>
        <SelectContent>
          {smsTemplates.map(template => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
