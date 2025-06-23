
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';
import { TemplateCard } from './TemplateCard';
import { Template } from '@/hooks/useTemplates';

interface TemplateGridProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (templateId: string) => void;
  onCreateNew: () => void;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  onEdit,
  onDuplicate,
  onDelete,
  onCreateNew
}) => {
  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No templates found matching your criteria.</p>
          <Button className="mt-4" onClick={onCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Template
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
