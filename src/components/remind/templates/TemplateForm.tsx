
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useCreateMessageTemplate, useUpdateMessageTemplate, MessageTemplate } from "@/hooks/useMessageTemplates";

interface TemplateFormProps {
  template?: MessageTemplate | null;
  onClose: () => void;
}

export const TemplateForm = ({ template, onClose }: TemplateFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'sms' as 'sms' | 'email',
    subject: '',
    content: '',
    category: 'general',
    variables: [] as string[]
  });
  const [newVariable, setNewVariable] = useState('');

  const createTemplate = useCreateMessageTemplate();
  const updateTemplate = useUpdateMessageTemplate();

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        type: template.type,
        subject: template.subject || '',
        content: template.content,
        category: template.category,
        variables: template.variables || []
      });
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (template) {
        await updateTemplate.mutateAsync({
          id: template.id,
          ...formData,
          is_active: true
        });
      } else {
        await createTemplate.mutateAsync({
          ...formData,
          is_active: true,
          created_by: 'current-user' // This would come from auth context
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const addVariable = () => {
    if (newVariable && !formData.variables.includes(newVariable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable]
      }));
      setNewVariable('');
    }
  };

  const removeVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }));
  };

  const isLoading = createTemplate.isPending || updateTemplate.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Template Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., 24-hour Appointment Reminder"
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Message Type</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value: 'sms' | 'email') => 
            setFormData(prev => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === 'email' && (
        <div>
          <Label htmlFor="subject">Email Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Appointment Reminder - {{patientName}}"
          />
        </div>
      )}

      <div>
        <Label htmlFor="content">Message Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Hi {{patientName}}, this is a reminder of your appointment on {{appointmentDate}} at {{appointmentTime}}."
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="appointment">Appointment</SelectItem>
            <SelectItem value="followup">Follow-up</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Template Variables</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newVariable}
            onChange={(e) => setNewVariable(e.target.value)}
            placeholder="e.g., patientName"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariable())}
          />
          <Button type="button" onClick={addVariable} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.variables.map(variable => (
            <Badge key={variable} variant="secondary" className="flex items-center gap-1">
              {variable}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeVariable(variable)}
              />
            </Badge>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Use variables in your message like: {`{{patientName}}`}
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : (template ? 'Update Template' : 'Create Template')}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
