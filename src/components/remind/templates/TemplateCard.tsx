
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Mail, 
  Phone,
  Edit, 
  Copy,
  Send,
  Trash2
} from "lucide-react";

interface Template {
  id: number;
  name: string;
  category: string;
  type: "sms" | "email" | "call";
  subject?: string;
  content: string;
  variables: string[];
  usageCount: number;
}

interface TemplateCardProps {
  template: Template;
  editingTemplate: Template | null;
  onEdit: (template: Template) => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
  onEditingChange: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  editingTemplate,
  onEdit,
  onUpdate,
  onCancelEdit,
  onEditingChange
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sms": return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "email": return <Mail className="w-4 h-4 text-green-600" />;
      case "call": return <Phone className="w-4 h-4 text-purple-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "sms": return <Badge className="bg-blue-100 text-blue-700">SMS</Badge>;
      case "email": return <Badge className="bg-green-100 text-green-700">Email</Badge>;
      case "call": return <Badge className="bg-purple-100 text-purple-700">Call</Badge>;
      default: return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const isEditing = editingTemplate?.id === template.id;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {getTypeIcon(template.type)}
            <div>
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-gray-600">Used {template.usageCount} times</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getTypeBadge(template.type)}
          </div>
        </div>

        {template.subject && (
          <div className="space-y-1 mb-3">
            <Label className="text-sm font-medium">Subject:</Label>
            <p className="text-sm text-gray-600 font-medium">{template.subject}</p>
          </div>
        )}
        
        <div className="space-y-1 mb-3">
          <Label className="text-sm font-medium">Content:</Label>
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editingTemplate.content}
                onChange={(e) => onEditingChange({
                  ...editingTemplate,
                  content: e.target.value
                })}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {editingTemplate.content.length}/160 characters
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={onUpdate}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{template.content}</p>
            </div>
          )}
        </div>

        {!isEditing && template.variables.length > 0 && (
          <div className="space-y-2 mb-3">
            <Label className="text-sm font-medium">Variables:</Label>
            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable) => (
                <Badge key={variable} variant="outline" className="text-xs">
                  {`{${variable}}`}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(template)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Copy className="w-4 h-4 mr-1" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm">
              <Send className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
