
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  MessageCircle,
  Phone,
  Clock
} from 'lucide-react';

interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  category: 'welcome' | 'reminder' | 'follow-up' | 'confirmation' | 'alert' | 'custom';
  characterCount: number;
  estimatedCost: number;
}

const defaultTemplates: SMSTemplate[] = [
  {
    id: 'welcome-sms',
    name: 'Welcome SMS',
    message: 'Welcome {{patientName}}! We\'ve received your intake form. We\'ll contact you within 24 hours. Reply STOP to opt out.',
    category: 'welcome',
    characterCount: 121,
    estimatedCost: 0.0075
  },
  {
    id: 'appointment-reminder-sms',
    name: 'Appointment Reminder',
    message: 'Hi {{patientName}}, this is a reminder about your appointment tomorrow at {{time}}. Reply CONFIRM to confirm or RESCHEDULE if needed.',
    category: 'reminder',
    characterCount: 132,
    estimatedCost: 0.0075
  },
  {
    id: 'follow-up-sms',
    name: 'Follow-up Message',
    message: 'Hi {{patientName}}, thank you for your visit. How are you feeling? Reply with any questions or concerns. Reply STOP to opt out.',
    category: 'follow-up',
    characterCount: 125,
    estimatedCost: 0.0075
  },
  {
    id: 'confirmation-sms',
    name: 'Confirmation Request',
    message: 'Hi {{patientName}}, please confirm your appointment on {{date}} at {{time}}. Reply YES to confirm or NO to reschedule.',
    category: 'confirmation',
    characterCount: 118,
    estimatedCost: 0.0075
  }
];

export const SMSTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<SMSTemplate[]>(defaultTemplates);
  const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    message: '',
    category: 'custom' as SMSTemplate['category']
  });

  const calculateCost = (message: string): number => {
    const segments = Math.ceil(message.length / 160);
    return segments * 0.0075; // Approximate SMS cost per segment
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.message) return;

    const template: SMSTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      message: newTemplate.message,
      category: newTemplate.category,
      characterCount: newTemplate.message.length,
      estimatedCost: calculateCost(newTemplate.message)
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: '', message: '', category: 'custom' });
    setIsCreating(false);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;

    setTemplates(templates.map(t => 
      t.id === editingTemplate.id 
        ? {
            ...editingTemplate,
            characterCount: editingTemplate.message.length,
            estimatedCost: calculateCost(editingTemplate.message)
          }
        : t
    ));
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const getCategoryIcon = (category: SMSTemplate['category']) => {
    switch (category) {
      case 'welcome': return <MessageCircle className="w-4 h-4" />;
      case 'reminder': return <Clock className="w-4 h-4" />;
      case 'follow-up': return <Phone className="w-4 h-4" />;
      case 'confirmation': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: SMSTemplate['category']) => {
    switch (category) {
      case 'welcome': return 'bg-green-100 text-green-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      case 'confirmation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              SMS Templates
            </CardTitle>
            <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Creation Form */}
          {isCreating && (
            <Card className="border-2 border-dashed border-blue-200">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Template name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  />
                  <Select 
                    value={newTemplate.category} 
                    onValueChange={(value: SMSTemplate['category']) => 
                      setNewTemplate({...newTemplate, category: value})
                    }
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
                  placeholder="SMS message (use {{patientName}}, {{date}}, {{time}} for variables)"
                  value={newTemplate.message}
                  onChange={(e) => setNewTemplate({...newTemplate, message: e.target.value})}
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {newTemplate.message.length}/160 characters
                    {newTemplate.message.length > 160 && (
                      <span className="text-orange-600 ml-2">
                        ({Math.ceil(newTemplate.message.length / 160)} segments)
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTemplate}>
                      Create Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Template List */}
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(template.category)}
                        <h3 className="font-medium">{template.name}</h3>
                      </div>
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(template.message)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {template.category === 'custom' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {editingTemplate?.id === template.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editingTemplate.message}
                        onChange={(e) => setEditingTemplate({
                          ...editingTemplate,
                          message: e.target.value
                        })}
                        rows={3}
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {editingTemplate.message.length}/160 characters
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateTemplate}>
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-700 mb-3 font-mono bg-gray-50 p-2 rounded">
                        {template.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{template.characterCount} characters</span>
                        <span>Est. cost: ${template.estimatedCost.toFixed(4)}</span>
                        <span>
                          {Math.ceil(template.characterCount / 160)} segment{Math.ceil(template.characterCount / 160) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
