
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Settings, Trash2 } from 'lucide-react';

interface AdvancedField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  conditionalRules?: any[];
}

interface FieldListItemProps {
  field: AdvancedField;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export const FieldListItem: React.FC<FieldListItemProps> = ({
  field,
  isSelected,
  onSelect,
  onRemove
}) => {
  return (
    <div 
      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
      onClick={() => onSelect(field.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <div>
            <div className="font-medium">{field.label}</div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {field.type}
              </Badge>
              {field.required && (
                <Badge variant="destructive" className="text-xs">Required</Badge>
              )}
              {field.conditionalRules && field.conditionalRules.length > 0 && (
                <Badge variant="outline" className="text-xs">Conditional</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(field.id);
            }}
          >
            <Settings className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(field.id);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
