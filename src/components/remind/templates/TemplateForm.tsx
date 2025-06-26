
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TemplateFormData {
  name: string;
  message: string;
  category: string;
}

interface TemplateFormProps {
  formData: TemplateFormData;
  onChange: (data: TemplateFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <Card className="border-2 border-dashed border-blue-200">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Template name"
            value={formData.name}
            onChange={(e) => onChange({...formData, name: e.target.value})}
          />
          <Select 
            value={formData.category} 
            onValueChange={(value) => onChange({...formData, category: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="welcome">Welcome</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="confirmation">Confirmation</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          placeholder="Message content (use {{patientName}}, {{date}}, {{time}} for variables)"
          value={formData.message}
          onChange={(e) => onChange({...formData, message: e.target.value})}
          rows={3}
        />
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {formData.message.length}/160 characters
            {formData.message.length > 160 && (
              <span className="text-orange-600 ml-2">
                ({Math.ceil(formData.message.length / 160)} segments)
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>
              Create Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
