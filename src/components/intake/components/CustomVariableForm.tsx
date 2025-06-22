
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomVariable } from '../types/variableTypes';

interface CustomVariableFormProps {
  variable: Partial<CustomVariable>;
  onChange: (variable: Partial<CustomVariable>) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const CustomVariableForm: React.FC<CustomVariableFormProps> = ({
  variable,
  onChange,
  onSave,
  onCancel,
  isEditing = false
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Variable Key</Label>
          <Input
            value={variable.key || ''}
            onChange={(e) => onChange({ ...variable, key: e.target.value })}
            placeholder="variableKey"
          />
        </div>
        <div>
          <Label>Display Label</Label>
          <Input
            value={variable.label || ''}
            onChange={(e) => onChange({ ...variable, label: e.target.value })}
            placeholder="Variable Label"
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={variable.description || ''}
          onChange={(e) => onChange({ ...variable, description: e.target.value })}
          placeholder="Describe what this variable represents..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select 
            value={variable.type} 
            onValueChange={(value) => onChange({ ...variable, type: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="select">Select List</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Category</Label>
          <Input
            value={variable.category || ''}
            onChange={(e) => onChange({ ...variable, category: e.target.value })}
            placeholder="Category"
          />
        </div>
      </div>

      <div>
        <Label>Default Value</Label>
        <Input
          value={variable.defaultValue || ''}
          onChange={(e) => onChange({ ...variable, defaultValue: e.target.value })}
          placeholder="Default value (optional)"
        />
      </div>

      {variable.type === 'select' && (
        <div>
          <Label>Options (comma-separated)</Label>
          <Input
            value={variable.options?.join(', ') || ''}
            onChange={(e) => onChange({ 
              ...variable, 
              options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })}
            placeholder="Option 1, Option 2, Option 3"
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          {isEditing ? 'Update' : 'Create'} Variable
        </Button>
      </div>
    </div>
  );
};
