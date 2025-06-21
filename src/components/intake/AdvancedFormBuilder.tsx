
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Settings, 
  Upload, 
  PenTool,
  Zap,
  Copy,
  Eye
} from 'lucide-react';
import { FormBuilder } from './FormBuilder';

interface ConditionalRule {
  dependsOn: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
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
              <Button
                key={type.value}
                variant="outline"
                className="h-16 flex-col gap-1"
                onClick={() => addField(type.value)}
              >
                {type.value === 'file' && <Upload className="w-4 h-4" />}
                {type.value === 'signature' && <PenTool className="w-4 h-4" />}
                <span className="text-xs">{type.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fields.map((field) => (
                  <div 
                    key={field.id} 
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedField === field.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedField(field.id)}
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
                            setSelectedField(field.id);
                          }}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeField(field.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field Configuration */}
        <div>
          {selectedFieldData ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Field Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Label</Label>
                  <Input
                    value={selectedFieldData.label}
                    onChange={(e) => updateField(selectedField!, { label: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Placeholder</Label>
                  <Input
                    value={selectedFieldData.placeholder || ''}
                    onChange={(e) => updateField(selectedField!, { placeholder: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Help Text</Label>
                  <Textarea
                    value={selectedFieldData.helpText || ''}
                    onChange={(e) => updateField(selectedField!, { helpText: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedFieldData.required}
                    onCheckedChange={(checked) => updateField(selectedField!, { required: checked })}
                  />
                  <Label>Required field</Label>
                </div>

                {/* Conditional Logic */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Conditional Logic</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addConditionalRule(selectedField!)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Rule
                    </Button>
                  </div>

                  {selectedFieldData.conditionalRules?.map((rule, index) => (
                    <div key={index} className="space-y-2 p-3 border rounded mb-2">
                      <div className="text-xs text-gray-600">Show this field when:</div>
                      
                      <Select
                        value={rule.dependsOn}
                        onValueChange={(value) => updateConditionalRule(selectedField!, index, { dependsOn: value })}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields
                            .filter(f => f.id !== selectedField)
                            .map(field => (
                              <Select

Item key={field.id} value={field.id}>
                                {field.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={rule.operator}
                        onValueChange={(value: any) => updateConditionalRule(selectedField!, index, { operator: value })}
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
                        value={rule.value}
                        onChange={(e) => updateConditionalRule(selectedField!, index, { value: e.target.value })}
                        placeholder="Enter value"
                        className="text-xs"
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConditionalRule(selectedField!, index)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* File Upload Settings */}
                {selectedFieldData.type === 'file' && (
                  <div className="border-t pt-4 space-y-3">
                    <Label className="text-sm font-medium">File Upload Settings</Label>
                    
                    <div>
                      <Label className="text-xs">Accepted File Types</Label>
                      <Input
                        value={selectedFieldData.fileUpload?.acceptedTypes.join(', ') || ''}
                        onChange={(e) => updateField(selectedField!, {
                          fileUpload: {
                            ...selectedFieldData.fileUpload!,
                            acceptedTypes: e.target.value.split(',').map(s => s.trim())
                          }
                        })}
                        placeholder="image/*, .pdf, .doc"
                        className="text-xs"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Max File Size (MB)</Label>
                      <Input
                        type="number"
                        value={selectedFieldData.fileUpload?.maxSize || 10}
                        onChange={(e) => updateField(selectedField!, {
                          fileUpload: {
                            ...selectedFieldData.fileUpload!,
                            maxSize: parseInt(e.target.value) || 10
                          }
                        })}
                        className="text-xs"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedFieldData.fileUpload?.multiple || false}
                        onCheckedChange={(checked) => updateField(selectedField!, {
                          fileUpload: {
                            ...selectedFieldData.fileUpload!,
                            multiple: checked
                          }
                        })}
                      />
                      <Label className="text-xs">Allow multiple files</Label>
                    </div>
                  </div>
                )}

                {/* Signature Settings */}
                {selectedFieldData.type === 'signature' && (
                  <div className="border-t pt-4 space-y-3">
                    <Label className="text-sm font-medium">Signature Settings</Label>
                    
                    <div>
                      <Label className="text-xs">Consent Text</Label>
                      <Textarea
                        value={selectedFieldData.signature?.consentText || ''}
                        onChange={(e) => updateField(selectedField!, {
                          signature: {
                            ...selectedFieldData.signature!,
                            consentText: e.target.value
                          }
                        })}
                        placeholder="I agree to the terms and conditions..."
                        rows={3}
                        className="text-xs"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedFieldData.signature?.signerNameRequired || false}
                        onCheckedChange={(checked) => updateField(selectedField!, {
                          signature: {
                            ...selectedFieldData.signature!,
                            signerNameRequired: checked
                          }
                        })}
                      />
                      <Label className="text-xs">Require signer name</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Select a field to configure its settings</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
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
