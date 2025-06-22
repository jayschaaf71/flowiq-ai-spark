
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Copy, Trash2, Mail, MessageSquare } from 'lucide-react';

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

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  const getTypeIcon = (type: string) => {
    return type === 'email' ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />;
  };

  const getTypeBadge = (type: string) => {
    return type === 'email' 
      ? <Badge className="bg-blue-100 text-blue-700">Email</Badge>
      : <Badge className="bg-green-100 text-green-700">SMS</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getTypeIcon(template.type)}
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getTypeBadge(template.type)}
                <Badge variant="outline">
                  {template.category}
                </Badge>
                {template.isBuiltIn && (
                  <Badge variant="secondary">Built-in</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {template.subject && (
          <div>
            <label className="text-sm font-medium text-gray-600">Subject:</label>
            <p className="text-sm text-gray-800 truncate">{template.subject}</p>
          </div>
        )}
        
        <div>
          <label className="text-sm font-medium text-gray-600">Content Preview:</label>
          <div className="bg-gray-50 p-3 rounded text-sm">
            <p className="line-clamp-3">{template.content}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Used {template.usageCount} times</span>
          {template.lastUsed && (
            <span>Last used: {template.lastUsed}</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(template)}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onDuplicate(template)}>
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          {!template.isBuiltIn && (
            <Button variant="outline" size="sm" onClick={() => onDelete(template.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
