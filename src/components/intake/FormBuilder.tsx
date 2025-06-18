
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Eye
} from "lucide-react";

export const FormBuilder = () => {
  const [formTitle, setFormTitle] = useState("New Patient Intake Form");
  const [formDescription, setFormDescription] = useState("Complete patient information and medical history");
  const [fields, setFields] = useState([
    { id: 1, type: "text", label: "Full Name", required: true, placeholder: "Enter full name" },
    { id: 2, type: "email", label: "Email Address", required: true, placeholder: "Enter email" },
    { id: 3, type: "phone", label: "Phone Number", required: true, placeholder: "Enter phone" }
  ]);

  const fieldTypes = [
    { value: "text", label: "Text Input", icon: Type },
    { value: "textarea", label: "Text Area", icon: FileText },
    { value: "email", label: "Email", icon: Mail },
    { value: "phone", label: "Phone", icon: Phone },
    { value: "date", label: "Date", icon: Calendar },
    { value: "checkbox", label: "Checkbox", icon: CheckSquare },
    { value: "radio", label: "Radio Buttons", icon: Radio }
  ];

  const addField = (type: string) => {
    const newField = {
      id: Date.now(),
      type,
      label: `New ${type} field`,
      required: false,
      placeholder: `Enter ${type}...`
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: number, updates: any) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: number) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const renderFieldPreview = (field: any) => {
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
      case "checkbox":
        return (
          <div className="flex items-center space-x-2 opacity-50">
            <input type="checkbox" disabled />
            <label>Checkbox option</label>
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2 opacity-50">
            <div className="flex items-center space-x-2">
              <input type="radio" name={`radio-${field.id}`} disabled />
              <label>Option 1</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" name={`radio-${field.id}`} disabled />
              <label>Option 2</label>
            </div>
          </div>
        );
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
          <CardDescription>Configure your intake form details</CardDescription>
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
          <CardTitle>Add Fields</CardTitle>
          <CardDescription>Click to add different field types to your form</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fieldTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Button
                  key={type.value}
                  variant="outline"
                  className="h-20 flex-col gap-2"
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
            <CardTitle>Form Fields</CardTitle>
            <CardDescription>Configure and arrange your form fields</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Field {field.id}</span>
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
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                    />
                    <Label>Required field</Label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Form Preview</CardTitle>
            <CardDescription>Preview how your form will look to patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
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
              
              <div className="pt-4 border-t">
                <Button className="w-full" disabled>
                  Submit Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Form
        </Button>
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Preview Full Form
        </Button>
      </div>
    </div>
  );
};
