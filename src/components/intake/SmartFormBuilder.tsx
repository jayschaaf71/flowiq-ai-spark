
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTenantConfig } from "@/utils/tenantConfig";
import { 
  Plus, 
  Trash2, 
  Eye, 
  Save, 
  Brain, 
  Wand2,
  GripVertical,
  Type,
  CheckSquare,
  Circle,
  Calendar,
  Hash
} from "lucide-react";

interface FormField {
  id: string;
  type: "text" | "textarea" | "select" | "checkbox" | "radio" | "date" | "number";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  aiSuggested?: boolean;
}

export const SmartFormBuilder = () => {
  const tenantConfig = useTenantConfig();
  const [activeTab, setActiveTab] = useState("builder");
  const [formTitle, setFormTitle] = useState("New Patient Intake Form");
  const [formDescription, setFormDescription] = useState("");
  
  const [fields, setFields] = useState<FormField[]>([
    {
      id: "1",
      type: "text",
      label: "Full Name",
      required: true,
      aiSuggested: false
    },
    {
      id: "2",
      type: "text",
      label: "Email Address",
      required: true,
      aiSuggested: false
    }
  ]);

  const fieldTypes = [
    { value: "text", label: "Text Input", icon: Type },
    { value: "textarea", label: "Text Area", icon: Type },
    { value: "select", label: "Dropdown", icon: Circle },
    { value: "checkbox", label: "Checkbox", icon: CheckSquare },
    { value: "radio", label: "Radio Button", icon: Circle },
    { value: "date", label: "Date Picker", icon: Calendar },
    { value: "number", label: "Number", icon: Hash }
  ];

  const aiSuggestedFields = {
    chiro: [
      { type: "select" as const, label: "Chief Complaint", options: ["Lower Back Pain", "Neck Pain", "Headaches", "Sports Injury", "Other"] },
      { type: "number" as const, label: "Pain Level (1-10)" },
      { type: "date" as const, label: "When did pain start?" },
      { type: "textarea" as const, label: "How did the injury occur?" },
      { type: "checkbox" as const, label: "Previous Treatments", options: ["Chiropractic", "Physical Therapy", "Massage", "Medication"] }
    ],
    dental: [
      { type: "select" as const, label: "Reason for Visit", options: ["Cleaning", "Pain", "Checkup", "Cosmetic", "Emergency"] },
      { type: "date" as const, label: "Last Dental Visit" },
      { type: "checkbox" as const, label: "Current Symptoms", options: ["Pain", "Sensitivity", "Bleeding Gums", "Bad Breath"] },
      { type: "textarea" as const, label: "Dental History" },
      { type: "text" as const, label: "Current Medications" }
    ]
  };

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false,
      aiSuggested: false
    };
    
    if (type === "select" || type === "checkbox" || type === "radio") {
      newField.options = ["Option 1", "Option 2"];
    }
    
    setFields([...fields, newField]);
  };

  const addAISuggestedField = (suggestedField: { type: FormField['type']; label: string; options?: string[] }) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: suggestedField.type,
      label: suggestedField.label,
      required: true,
      options: suggestedField.options,
      aiSuggested: true
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const currentTenant = tenantConfig.name.toLowerCase() as keyof typeof aiSuggestedFields;
  const suggestions = aiSuggestedFields[currentTenant] || aiSuggestedFields.chiro;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Smart Form Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="formTitle">Form Title</Label>
              <Input
                id="formTitle"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="formDescription">Description</Label>
              <Input
                id="formDescription"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description of this form"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Field Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Add Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {fieldTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <Button
                      key={type.value}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addField(type.value as FormField['type'])}
                    >
                      <IconComponent className="w-3 h-3 mr-2" />
                      {type.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Form Builder */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Form Fields</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm">
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className={field.aiSuggested ? "border-purple-200 bg-purple-50" : ""}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          <GripVertical className="w-4 h-4 text-gray-400 mt-2 cursor-move" />
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              {field.aiSuggested && (
                                <Badge variant="secondary" className="text-purple-700 bg-purple-100">
                                  <Brain className="w-3 h-3 mr-1" />
                                  AI Suggested
                                </Badge>
                              )}
                              <span className="text-sm text-muted-foreground">
                                {fieldTypes.find(t => t.value === field.type)?.label}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Field Label</Label>
                                <Input
                                  value={field.label}
                                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                                />
                              </div>
                              
                              {(field.type === "text" || field.type === "textarea") && (
                                <div>
                                  <Label className="text-xs">Placeholder</Label>
                                  <Input
                                    value={field.placeholder || ""}
                                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                  />
                                </div>
                              )}
                            </div>

                            {(field.type === "select" || field.type === "checkbox" || field.type === "radio") && (
                              <div>
                                <Label className="text-xs">Options (one per line)</Label>
                                <Textarea
                                  value={field.options?.join('\n') || ""}
                                  onChange={(e) => updateField(field.id, { 
                                    options: e.target.value.split('\n').filter(opt => opt.trim()) 
                                  })}
                                  rows={3}
                                  className="text-sm"
                                />
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Switch
                                checked={field.required}
                                onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                              />
                              <Label className="text-xs">Required field</Label>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(field.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {fields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Plus className="w-8 h-8 mx-auto mb-2" />
                      <p>No fields added yet. Add fields from the sidebar.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{formTitle}</CardTitle>
              {formDescription && (
                <p className="text-sm text-muted-foreground">{formDescription}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field) => (
                <div key={field.id}>
                  <Label className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {field.type === "text" && (
                    <Input placeholder={field.placeholder} className="mt-1" />
                  )}
                  
                  {field.type === "textarea" && (
                    <Textarea placeholder={field.placeholder} className="mt-1" />
                  )}
                  
                  {field.type === "select" && (
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option, idx) => (
                          <SelectItem key={idx} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {field.type === "date" && (
                    <Input type="date" className="mt-1" />
                  )}
                  
                  {field.type === "number" && (
                    <Input type="number" className="mt-1" />
                  )}
                </div>
              ))}
              
              <Button className="w-full mt-6">Submit Form</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" />
                AI-Powered Field Suggestions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on your {tenantConfig.specialty.toLowerCase()} practice, here are recommended form fields:
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{suggestion.label}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {suggestion.type} field
                    </div>
                    {suggestion.options && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Options: {suggestion.options.join(', ')}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addAISuggestedField(suggestion)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
