
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Copy } from 'lucide-react';
import { CustomVariable } from '../types/variableTypes';

interface VariableCardProps {
  variable: CustomVariable;
  onEdit: (variable: CustomVariable) => void;
  onDelete: (id: string) => void;
}

export const VariableCard: React.FC<VariableCardProps> = ({
  variable,
  onEdit,
  onDelete
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝';
      case 'date': return '📅';
      case 'number': return '🔢';
      case 'boolean': return '✅';
      case 'select': return '📋';
      default: return '📝';
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTypeIcon(variable.type)}</span>
            <div>
              <h4 className="font-medium">{variable.label}</h4>
              <code className="text-xs text-blue-600 bg-blue-50 px-1 rounded">
                {`{{${variable.key}}}`}
              </code>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {variable.isSystem && (
              <Badge variant="secondary" className="text-xs">System</Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          {variable.description}
        </p>

        <div className="text-xs text-gray-500 space-y-1">
          <div>Type: {variable.type}</div>
          {variable.defaultValue && (
            <div>Default: {variable.defaultValue}</div>
          )}
          {variable.options && (
            <div>Options: {variable.options.join(', ')}</div>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(`{{${variable.key}}}`)}
          >
            <Copy className="w-3 h-3" />
          </Button>
          {!variable.isSystem && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(variable)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(variable.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
