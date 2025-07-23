
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { ConditionalRuleEditor } from './ConditionalRuleEditor';
import { FileUploadSettings } from './FileUploadSettings';
import { SignatureSettings } from './SignatureSettings';

interface ConditionalRule {
  dependsOn: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number | boolean;
}

interface AdvancedField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  conditionalRules?: ConditionalRule[];
  fileUpload?: {
    acceptedTypes: string[];
    maxSize: number;
    multiple: boolean;
  };
  signature?: {
    consentText?: string;
    signerNameRequired: boolean;
    dateRequired: boolean;
  };
}

interface FieldConfigurationProps {
  selectedField: AdvancedField | null;
  fields: AdvancedField[];
  selectedFieldId: string | null;
  onUpdateField: (id: string, updates: Partial<AdvancedField>) => void;
  onAddConditionalRule: (fieldId: string) => void;
  onUpdateConditionalRule: (fieldId: string, ruleIndex: number, updates: Partial<ConditionalRule>) => void;
  onRemoveConditionalRule: (fieldId: string, ruleIndex: number) => void;
}

export const FieldConfiguration: React.FC<FieldConfigurationProps> = ({
  selectedField,
  fields,
  selectedFieldId,
  onUpdateField,
  onAddConditionalRule,
  onUpdateConditionalRule,
  onRemoveConditionalRule
}) => {
  if (!selectedField || !selectedFieldId) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Select a field to configure its settings</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Field Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Label</Label>
          <Input
            value={selectedField.label}
            onChange={(e) => onUpdateField(selectedFieldId, { label: e.target.value })}
          />
        </div>

        <div>
          <Label>Placeholder</Label>
          <Input
            value={selectedField.placeholder || ''}
            onChange={(e) => onUpdateField(selectedFieldId, { placeholder: e.target.value })}
          />
        </div>

        <div>
          <Label>Help Text</Label>
          <Textarea
            value={selectedField.helpText || ''}
            onChange={(e) => onUpdateField(selectedFieldId, { helpText: e.target.value })}
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={selectedField.required}
            onCheckedChange={(checked) => onUpdateField(selectedFieldId, { required: checked })}
          />
          <Label>Required field</Label>
        </div>

        <ConditionalRuleEditor
          field={selectedField}
          fields={fields}
          selectedFieldId={selectedFieldId}
          onAddRule={onAddConditionalRule}
          onUpdateRule={onUpdateConditionalRule}
          onRemoveRule={onRemoveConditionalRule}
        />

        {selectedField.type === 'file' && (
          <FileUploadSettings
            field={selectedField}
            onUpdate={onUpdateField}
            selectedFieldId={selectedFieldId}
          />
        )}

        {selectedField.type === 'signature' && (
          <SignatureSettings
            field={selectedField}
            onUpdate={onUpdateField}
            selectedFieldId={selectedFieldId}
          />
        )}
      </CardContent>
    </Card>
  );
};
