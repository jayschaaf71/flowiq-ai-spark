
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Mail, 
  MessageSquare,
  Eye,
  Download,
  Upload,
  Filter
} from 'lucide-react';
import { TemplateEditor } from './TemplateEditor';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  usageCount: number;
  lastUsed?: string;
  isBuiltIn: boolean;
}

// Built-in template library
const builtInTemplates: Template[] = [
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    type: 'email',
    category: 'welcome',
    subject: 'Welcome to {{practiceName}}, {{patientName}}!',
    content: `Dear {{patientName}},

Welcome to {{practiceName}}! We're excited to provide you with excellent healthcare services.

Your upcoming appointment is scheduled for {{appointmentDate}} at {{appointmentTime}} with {{doctorName}}.

Please arrive 15 minutes early to complete any remaining paperwork. If you need to reschedule, please call us at {{phoneNumber}} or use this link: {{rescheduleLink}}

Access your patient portal: {{portalLink}}

Best regards,
The {{practiceName}} Team`,
    variables: ['patientName', 'practiceName', 'appointmentDate', 'appointmentTime', 'doctorName', 'phoneNumber', 'rescheduleLink', 'portalLink'],
    usageCount: 45,
    lastUsed: '2024-03-20',
    isBuiltIn: true
  },
  {
    id: 'reminder-sms',
    name: 'Appointment Reminder SMS',
    type: 'sms',
    category: 'reminder',
    content: 'Hi {{firstName}}, reminder: you have an appointment tomorrow at {{appointmentTime}} with {{doctorName}}. Reply CONFIRM to confirm or CANCEL to reschedule. {{practiceName}}',
    variables: ['firstName', 'appointmentTime', 'doctorName', 'practiceName'],
    usageCount: 128,
    lastUsed: '2024-03-22',
    isBuiltIn: true
  },
  {
    id: 'confirmation-email',
    name: 'Appointment Confirmation',
    type: 'email',
    category: 'confirmation',
    subject: 'Appointment Confirmed - {{appointmentDate}}',
    content: `Dear {{patientName}},

Your appointment has been confirmed!

📅 Date: {{appointmentDate}}
🕐 Time: {{appointmentTime}}
👨‍⚕️ Provider: {{doctorName}}
📍 Location: {{address}}

What to bring:
• Insurance card
• Photo ID
• List of current medications

If you need to make changes, please contact us at {{phoneNumber}} or click here: {{rescheduleLink}}

Thank you,
{{practiceName}}`,
    variables: ['patientName', 'appointmentDate', 'appointmentTime', 'doctorName', 'address', 'phoneNumber', 'rescheduleLink', 'practiceName'],
    usageCount: 67,
    lastUsed: '2024-03-21',
    isBuiltIn: true
  },
  {
    id: 'follow-up-email',
    name: 'Follow-up Care Instructions',
    type: 'email',
    category: 'follow-up',
    subject: 'Follow-up Instructions - {{patientName}}',
    content: `Dear {{patientName}},

Thank you for your visit to {{practiceName}} today with {{doctorName}}.

Please follow these important instructions:
• Take medications as prescribed
• Follow up in 2 weeks or as discussed
• Contact us immediately if you experience any concerning symptoms

Schedule your follow-up appointment: {{portalLink}}

Questions? Call us at {{phoneNumber}}

Best wishes for your recovery,
{{practiceName}} Team`,
    variables: ['patientName', 'practiceName', 'doctorName', 'portalLink', 'phoneNumber'],
    usageCount: 23,
    lastUsed: '2024-03-19',
    isBuiltIn: true
  }
];

export const TemplateLibrary: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(builtInTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | undefined>();

  const categories = ['welcome', 'reminder', 'confirmation', 'follow-up', 'appointment', 'cancellation'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || template.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleCreateNew = () => {
    setEditingTemplate(undefined);
    setIsEditorOpen(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setIsEditorOpen(true);
  };

  const handleDuplicate = (template: Template) => {
    const duplicated: Template = {
      ...template,
      id: crypto.randomUUID(),
      name: `${template.name} (Copy)`,
      isBuiltIn: false,
      usageCount: 0,
      lastUsed: undefined
    };
    setTemplates(prev => [...prev, duplicated]);
  };

  const handleDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleSaveTemplate = (template: Template) => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates(prev => [...prev, { ...template, usageCount: 0, isBuiltIn: false }]);
    }
    setIsEditorOpen(false);
    setEditingTemplate(undefined);
  };

  const getTypeIcon = (type: string) => {
    return type === 'email' ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />;
  };

  const getTypeBadge = (type: string) => {
    return type === 'email' 
      ? <Badge className="bg-blue-100 text-blue-700">Email</Badge>
      : <Badge className="bg-green-100 text-green-700">SMS</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Template Library</h2>
          <p className="text-gray-600">Manage and customize your communication templates</p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(template.type)}
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeBadge(template.type)}
                      <Badge variant="outline">
                        {template.category}
                      </Badge>
                      {template.isBuiltIn && (
                        <Badge variant="secondary">Built-in</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {template.subject && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Subject:</label>
                  <p className="text-sm text-gray-800 truncate">{template.subject}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-600">Content Preview:</label>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p className="line-clamp-3">{template.content}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Used {template.usageCount} times</span>
                {template.lastUsed && (
                  <span>Last used: {template.lastUsed}</span>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(template)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDuplicate(template)}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                {!template.isBuiltIn && (
                  <Button variant="outline" size="sm" onClick={() => handleDelete(template.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No templates found matching your criteria.</p>
            <Button className="mt-4" onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Template Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
          </DialogHeader>
          <TemplateEditor
            template={editingTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setIsEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
