
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { useTenantConfig } from '@/utils/tenantConfig';
import { useToast } from '@/hooks/use-toast';
import { FormField, FormFieldsJson } from '@/types/intake';


export const IntakeFormBuilder: React.FC = () => {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const { createForm } = useIntakeForms();
  const tenantConfig = useTenantConfig();
  const { toast } = useToast();

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkbox' }
  ];

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text' as const,
      label: '',
      required: false
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = fields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const addOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    const options = field.options || [];
    updateField(fieldIndex, { options: [...options, ''] });
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const field = fields[fieldIndex];
    const options = [...(field.options || [])];
    options[optionIndex] = value;
    updateField(fieldIndex, { options });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    const options = (field.options || []).filter((_, i) => i !== optionIndex);
    updateField(fieldIndex, { options });
  };

  const saveForm = async () => {
    if (!formTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a form title",
        variant: "destructive"
      });
      return;
    }

    if (fields.length === 0) {
      toast({
        title: "Error", 
        description: "Please add at least one field",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      await createForm({
        title: formTitle,
        description: formDescription || null,
        form_fields: fields as FormFieldsJson, // Type assertion for database compatibility
        is_active: true
      });

      toast({
        title: "Success",
        description: "Form created successfully!"
      });

      // Reset form
      setFormTitle('');
      setFormDescription('');
      setFields([]);
    } catch (error) {
      console.error('Error creating form:', error);
      toast({
        title: "Error",
        description: "Failed to create form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={`text-${tenantConfig.primaryColor}-600`}>
            Create New Intake Form
          </CardTitle>
          <CardDescription>
            Build custom intake forms for your {tenantConfig.specialty.toLowerCase()} practice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Form Title *</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., New Patient Intake Form"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description of the form purpose"
                rows={2}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Form Fields</h3>
              <Button onClick={addField} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>

            {fields.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                No fields added yet. Click "Add Field" to get started.
              </div>
            )}

            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <Badge variant="secondary">Field {index + 1}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(index)}
                      className="ml-auto text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Field Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) => updateField(index, { type: value as FormField['type'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Label *</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        placeholder="Field label"
                      />
                    </div>

                    <div>
                      <Label>Placeholder</Label>
                      <Input
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                        placeholder="Placeholder text"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`required-${index}`}
                        checked={field.required || false}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`required-${index}`}>Required field</Label>
                    </div>
                  </div>

                  {/* Options for select/radio fields */}
                  {(field.type === 'select' || field.type === 'radio') && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Options</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(index)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Option
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(field.options || []).map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            <Button
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeOption(index, optionIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={saveForm}
              disabled={isCreating}
              className={`bg-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-700`}
            >
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? 'Creating...' : 'Create Form'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
