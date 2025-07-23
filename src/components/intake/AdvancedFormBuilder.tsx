
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Copy, Eye } from 'lucide-react';
import { FieldTypeButton } from './FieldTypeButton';
import { FieldListItem } from './FieldListItem';
import { FieldConfiguration } from './FieldConfiguration';

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
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
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

export const AdvancedFormBuilder: React.FC = () => {
  const [fields, setFields] = useState<AdvancedField[]>([
    {
      id: '1',
      type: 'text',
      label: 'Full Name',
      required: true,
      placeholder: 'Enter your full name'
    }
  ]);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'date', label: 'Date' },
    { value: 'number', label: 'Number' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'file', label: 'File Upload' },
    { value: 'signature', label: 'Digital Signature' }
  ];

  const addField = (type: string) => {
    const newField: AdvancedField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false,
      placeholder: `Enter ${type}...`
    };

    if (type === 'file') {
      newField.fileUpload = {
        acceptedTypes: ['image/*', '.pdf'],
        maxSize: 10,
        multiple: false
      };
    }

    if (type === 'signature') {
      newField.signature = {
        signerNameRequired: true,
        dateRequired: true
      };
    }

    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<AdvancedField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    if (selectedField === id) {
      setSelectedField(null);
    }
  };

  const addConditionalRule = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const newRule: ConditionalRule = {
      dependsOn: '',
      operator: 'equals',
      value: ''
    };

    updateField(fieldId, {
      conditionalRules: [...(field.conditionalRules || []), newRule]
    });
  };

  const updateConditionalRule = (fieldId: string, ruleIndex: number, updates: Partial<ConditionalRule>) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.conditionalRules) return;

    const updatedRules = field.conditionalRules.map((rule, index) =>
      index === ruleIndex ? { ...rule, ...updates } : rule
    );

    updateField(fieldId, { conditionalRules: updatedRules });
  };

  const removeConditionalRule = (fieldId: string, ruleIndex: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.conditionalRules) return;

    const updatedRules = field.conditionalRules.filter((_, index) => index !== ruleIndex);
    updateField(fieldId, { conditionalRules: updatedRules });
  };

  const selectedFieldData = fields.find(f => f.id === selectedField);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Advanced Form Builder
          </CardTitle>
          <CardDescription>
            Create sophisticated forms with conditional logic, file uploads, and digital signatures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fieldTypes.map((type) => (
              <FieldTypeButton
                key={type.value}
                type={type}
                onAddField={addField}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fields.map((field) => (
                  <FieldListItem
                    key={field.id}
                    field={field}
                    isSelected={selectedField === field.id}
                    onSelect={setSelectedField}
                    onRemove={removeField}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <FieldConfiguration
            selectedField={selectedFieldData || null}
            fields={fields}
            selectedFieldId={selectedField}
            onUpdateField={updateField}
            onAddConditionalRule={addConditionalRule}
            onUpdateConditionalRule={updateConditionalRule}
            onRemoveConditionalRule={removeConditionalRule}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button>
          <Copy className="w-4 h-4 mr-2" />
          Save Form Template
        </Button>
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Preview Form
        </Button>
      </div>
    </div>
  );
};
