
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { aiAgentHub } from "@/services/aiAgentHub";
import { useTenantConfig, detectTenant } from "@/utils/tenantConfig";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Type, 
  Calendar, 
  Phone, 
  Mail, 
  FileText,
  CheckSquare,
  Radio,
  Save,
  Eye,
  Brain,
  Loader
} from "lucide-react";

interface FormField {
  id: number;
  type: string;
  label: string;
  required: boolean;
  placeholder: string;
  options?: string[];
}

export const TenantFormBuilder = () => {
  const tenantConfig = useTenantConfig();
  const currentTenant = detectTenant();
  
  const [formTitle, setFormTitle] = useState(`${tenantConfig.specialty} Intake Form`);
  const [formDescription, setFormDescription] = useState(`Complete patient information and ${tenantConfig.specialty.toLowerCase()} history`);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const loadTenantTemplate = useCallback(async () => {
    setLoadingTemplate(true);
    try {
      const response = await aiAgentHub.processRequest({
        agentType: 'intake',
        action: 'generate_form',
        tenant: currentTenant,
        payload: {
          formType: 'primary_intake'
        }
      });

      if (response.success && response.data.fields) {
        interface TemplateField {
          type: string;
          label: string;
          required?: boolean;
          placeholder?: string;
          options?: string[];
        }
        const templateFields = response.data.fields.map((field: TemplateField, index: number) => ({
          id: index + 1,
          type: field.type,
          label: field.label,
          required: field.required || false,
          placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}...`,
          options: field.options || []
        }));
        
        setFields(templateFields);
      }
    } catch (error) {
      console.error('Failed to load tenant template:', error);
      // Fallback to basic fields
      setFields([
        { id: 1, type: "text", label: "Full Name", required: true, placeholder: "Enter full name" },
        { id: 2, type: "email", label: "Email Address", required: true, placeholder: "Enter email" },
        { id: 3, type: "phone", label: "Phone Number", required: true, placeholder: "Enter phone" }
      ]);
    } finally {
      setLoadingTemplate(false);
    }
  }, [currentTenant]);

  // Load tenant-specific form template on mount
  useEffect(() => {
    loadTenantTemplate();
  }, [loadTenantTemplate]);

  const fieldTypes = [
    { value: "text", label: "Text Input", icon: Type },
    { value: "textarea", label: "Text Area", icon: FileText },
    { value: "email", label: "Email", icon: Mail },
    { value: "phone", label: "Phone", icon: Phone },
    { value: "date", label: "Date", icon: Calendar },
    { value: "checkbox", label: "Checkbox", icon: CheckSquare },
    { value: "radio", label: "Radio Buttons", icon: Radio },
    { value: "range", label: "Range/Scale", icon: Type },
    { value: "select", label: "Dropdown", icon: Type }
  ];

  const addField = (type: string) => {
    const newField: FormField = {
      id: Date.now(),
      type,
      label: `New ${type} field`,
      required: false,
      placeholder: `Enter ${type}...`,
      options: type === 'checkbox' || type === 'radio' || type === 'select' ? ['Option 1', 'Option 2'] : undefined
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: number, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: number) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const renderFieldPreview = (field: FormField) => {
    const commonProps = {
      placeholder: field.placeholder,
      disabled: true,
      className: "opacity-50"
    };

    switch (field.type) {
      case "textarea":
        return <Textarea {...commonProps} />;
      case "date":
        return <Input type="date" {...commonProps} />;
      case "email":
        return <Input type="email" {...commonProps} />;
      case "phone":
        return <Input type="tel" {...commonProps} />;
      case "range":
        return (
          <div className="opacity-50">
            <input type="range" min="1" max="10" disabled className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        );
      case "select":
        return (
          <Select disabled>
            <SelectTrigger className="opacity-50">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
          </Select>
        );
      case "checkbox":
        return (
          <div className="space-y-2 opacity-50">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="checkbox" disabled />
                <label>{option}</label>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2 opacity-50">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" name={`radio-${field.id}`} disabled />
                <label>{option}</label>
              </div>
            ))}
          </div>
        );
      default:
        return <Input {...commonProps} />;
    }
  };

  if (loadingTemplate) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading {tenantConfig.brandName} form template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tenant-specific header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">{tenantConfig.brandName} Form Builder</h3>
              <p className="text-sm text-blue-700">Specialized for {tenantConfig.specialty} intake forms</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Form Configuration</CardTitle>
          <CardDescription>Configure your {tenantConfig.specialty.toLowerCase()} intake form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Form Title</Label>
            <Input
              id="title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Enter form title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Enter form description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Field Types */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add Fields</CardTitle>
              <CardDescription>Add specialized fields for {tenantConfig.specialty.toLowerCase()} intake</CardDescription>
            </div>
            <Button onClick={loadTenantTemplate} variant="outline" size="sm">
              <Brain className="w-4 h-4 mr-2" />
              Regenerate Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {fieldTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Button
                  key={type.value}
                  variant="outline"
                  className="h-20 flex-col gap-2 hover:bg-blue-50"
                  onClick={() => addField(type.value)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-xs">{type.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Form Fields ({fields.length})</CardTitle>
            <CardDescription>Configure and arrange your form fields</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{field.type}</span>
                      {field.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Field Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Enter field label"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Placeholder</Label>
                    <Input
                      value={field.placeholder}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      placeholder="Enter placeholder text"
                    />
                  </div>
                  
                  {(field.type === 'checkbox' || field.type === 'radio' || field.type === 'select') && (
                    <div className="space-y-2">
                      <Label>Options (one per line)</Label>
                      <Textarea
                        value={field.options?.join('\n') || ''}
                        onChange={(e) => updateField(field.id, { options: e.target.value.split('\n').filter(o => o.trim()) })}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        rows={3}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                    />
                    <Label>Required field</Label>
                  </div>
                </div>
              ))}
              
              {fields.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No fields added yet. Click "Add Fields" above to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>Preview how your form will appear to patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold">{formTitle}</h3>
                <p className="text-sm text-muted-foreground">{formDescription}</p>
              </div>
              
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {renderFieldPreview(field)}
                  </div>
                ))}
              </div>
              
              {fields.length > 0 && (
                <div className="pt-4 border-t">
                  <Button className="w-full" disabled>
                    Submit {tenantConfig.specialty} Form
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save {tenantConfig.brandName} Form
        </Button>
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Preview Full Form
        </Button>
        <Button variant="outline">
          <Brain className="w-4 h-4 mr-2" />
          AI Optimize
        </Button>
      </div>
    </div>
  );
};
