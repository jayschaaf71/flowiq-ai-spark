import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Settings,
  Type,
  CheckSquare,
  Circle,
  Calendar,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { toast } from 'sonner';
import { AIFormCreator } from './AIFormCreator';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'email' | 'phone' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export const FormBuilder: React.FC = () => {
  const { forms, createForm, isCreating } = useIntakeForms();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedFieldType, setSelectedFieldType] = useState<FormField['type']>('text');

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: Type },
    { value: 'textarea', label: 'Text Area', icon: FileText },
    { value: 'select', label: 'Dropdown', icon: Settings },
    { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { value: 'radio', label: 'Radio Buttons', icon: Circle },
    { value: 'date', label: 'Date Picker', icon: Calendar },
    { value: 'email', label: 'Email Input', icon: Mail },
    { value: 'phone', label: 'Phone Input', icon: Phone },
    { value: 'number', label: 'Number Input', icon: Type }
  ];

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: selectedFieldType,
      label: `New ${selectedFieldType} field`,
      required: false,
      options: selectedFieldType === 'select' || selectedFieldType === 'radio' ? ['Option 1', 'Option 2'] : undefined
    };
    setFormFields([...formFields, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormFields(fields => 
      fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (fieldId: string) => {
    setFormFields(fields => fields.filter(field => field.id !== fieldId));
  };

  const saveForm = () => {
    if (!formTitle.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    if (formFields.length === 0) {
      toast.error('Please add at least one field to the form');
      return;
    }

    createForm({
      title: formTitle,
      description: formDescription,
      form_fields: formFields,
      is_active: true
    });

    // Reset form
    setFormTitle('');
    setFormDescription('');
    setFormFields([]);
  };

  const getFieldIcon = (type: FormField['type']) => {
    const fieldType = fieldTypes.find(ft => ft.value === type);
    return fieldType ? fieldType.icon : Type;
  };

  return (
    <div className="space-y-6">
      {/* AI Form Creator */}
      <AIFormCreator onFormCreated={() => {
        // Refresh forms list or handle form creation
        toast.success('Form created successfully!');
      }} />
      
      {/* Form Header */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Intake Form</CardTitle>
          <CardDescription>
            Build custom intake forms with drag-and-drop fields
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="form-title">Form Title</Label>
              <Input
                id="form-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., New Patient Intake Form"
              />
            </div>
            <div>
              <Label htmlFor="form-description">Description (Optional)</Label>
              <Input
                id="form-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description of the form"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Field Types */}
      <Card>
        <CardHeader>
          <CardTitle>Add Form Fields</CardTitle>
          <CardDescription>
            Select a field type and click "Add Field" to build your form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {fieldTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  variant={selectedFieldType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFieldType(type.value as FormField['type'])}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </Button>
              );
            })}
          </div>
          <Button onClick={addField} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add {fieldTypes.find(t => t.value === selectedFieldType)?.label}
          </Button>
        </CardContent>
      </Card>

      {/* Form Fields */}
      {formFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Form Fields ({formFields.length})</CardTitle>
            <CardDescription>
              Configure your form fields below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formFields.map((field, index) => {
              const Icon = getFieldIcon(field.type);
              return (
                <div key={field.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <Badge variant="outline">{field.type}</Badge>
                      <span className="text-sm text-gray-500">Field {index + 1}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Field Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        placeholder="Enter field label"
                      />
                    </div>
                    <div>
                      <Label>Placeholder (Optional)</Label>
                      <Input
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        placeholder="Enter placeholder text"
                      />
                    </div>
                  </div>

                  {(field.type === 'select' || field.type === 'radio') && (
                    <div>
                      <Label>Options (one per line)</Label>
                      <Textarea
                        value={field.options?.join('\n') || ''}
                        onChange={(e) => updateField(field.id, { 
                          options: e.target.value.split('\n').filter(opt => opt.trim()) 
                        })}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`required-${field.id}`}
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    />
                    <Label htmlFor={`required-${field.id}`}>Required field</Label>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            onClick={saveForm}
            disabled={isCreating || !formTitle.trim() || formFields.length === 0}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isCreating ? 'Saving...' : 'Save Form'}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview Form
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          {formFields.length} field{formFields.length !== 1 ? 's' : ''} added
        </div>
      </div>

      {/* Existing Forms */}
      {forms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Forms ({forms.length})</CardTitle>
            <CardDescription>
              Manage your current intake forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form) => (
                <div key={form.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{form.title}</h3>
                  {form.description && (
                    <p className="text-sm text-gray-600 mb-3">{form.description}</p>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{Array.isArray(form.form_fields) ? form.form_fields.length : 0} fields</span>
                    <Badge variant={form.is_active ? "default" : "secondary"}>
                      {form.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
