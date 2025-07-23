
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface ConditionalRule {
  dependsOn: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number | boolean;
}

interface AdvancedField {
  id: string;
  label: string;
  conditionalRules?: ConditionalRule[];
}

interface ConditionalRuleEditorProps {
  field: AdvancedField;
  fields: AdvancedField[];
  selectedFieldId: string;
  onAddRule: (fieldId: string) => void;
  onUpdateRule: (fieldId: string, ruleIndex: number, updates: Partial<ConditionalRule>) => void;
  onRemoveRule: (fieldId: string, ruleIndex: number) => void;
}

export const ConditionalRuleEditor: React.FC<ConditionalRuleEditorProps> = ({
  field,
  fields,
  selectedFieldId,
  onAddRule,
  onUpdateRule,
  onRemoveRule
}) => {
  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-medium">Conditional Logic</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddRule(selectedFieldId)}
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Rule
        </Button>
      </div>

      {field.conditionalRules?.map((rule, index) => (
        <div key={index} className="space-y-2 p-3 border rounded mb-2">
          <div className="text-xs text-gray-600">Show this field when:</div>
          
          <Select
            value={rule.dependsOn}
            onValueChange={(value) => onUpdateRule(selectedFieldId, index, { dependsOn: value })}
          >
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {fields
                .filter(f => f.id !== selectedFieldId)
                .map(field => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select
            value={rule.operator}
            onValueChange={(value) => onUpdateRule(selectedFieldId, index, { operator: value as ConditionalRule['operator'] })}
          >
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equals">equals</SelectItem>
              <SelectItem value="not_equals">does not equal</SelectItem>
              <SelectItem value="contains">contains</SelectItem>
              <SelectItem value="greater_than">is greater than</SelectItem>
              <SelectItem value="less_than">is less than</SelectItem>
            </SelectContent>
          </Select>

          <Input
            value={String(rule.value)}
            onChange={(e) => onUpdateRule(selectedFieldId, index, { value: e.target.value })}
            placeholder="Enter value"
            className="text-xs"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveRule(selectedFieldId, index)}
            className="text-red-600"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};
