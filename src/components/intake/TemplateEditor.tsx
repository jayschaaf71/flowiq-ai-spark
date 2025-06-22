
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Save, 
  Eye, 
  Code, 
  Type,
  Settings,
  Info
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  styling?: {
    primaryColor?: string;
    fontFamily?: string;
    backgroundColor?: string;
  };
}

interface TemplateEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

const availableVariables = [
  { key: 'patientName', label: 'Patient Name', description: 'Full name of the patient' },
  { key: 'firstName', label: 'First Name', description: 'Patient\'s first name' },
  { key: 'lastName', label: 'Last Name', description: 'Patient\'s last name' },
  { key: 'appointmentDate', label: 'Appointment Date', description: 'Date of appointment' },
  { key: 'appointmentTime', label: 'Appointment Time', description: 'Time of appointment' },
  { key: 'doctorName', label: 'Doctor Name', description: 'Name of attending physician' },
  { key: 'practiceName', label: 'Practice Name', description: 'Name of medical practice' },
  { key: 'phoneNumber', label: 'Phone Number', description: 'Practice phone number' },
  { key: 'address', label: 'Practice Address', description: 'Practice location' },
  { key: 'confirmationLink', label: 'Confirmation Link', description: 'Link to confirm appointment' },
  { key: 'rescheduleLink', label: 'Reschedule Link', description: 'Link to reschedule appointment' },
  { key: 'portalLink', label: 'Patient Portal', description: 'Link to patient portal' }
];

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const [editingTemplate, setEditingTemplate] = useState<Template>(
    template || {
      id: '',
      name: '',
      type: 'email',
      category: 'appointment',
      subject: '',
      content: '',
      variables: [],
      styling: {
        primaryColor: '#3B82F6',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff'
      }
    }
  );

  const [previewData, setPreviewData] = useState({
    patientName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    appointmentDate: 'March 25, 2024',
    appointmentTime: '2:00 PM',
    doctorName: 'Dr. Smith',
    practiceName: 'Healthcare Plus',
    phoneNumber: '(555) 123-4567',
    address: '123 Medical Center Dr',
    confirmationLink: '#confirm',
    rescheduleLink: '#reschedule',
    portalLink: '#portal'
  });

  const insertVariable = (variable: string) => {
    const variableTag = `{{${variable}}}`;
    setEditingTemplate(prev => ({
      ...prev,
      content: prev.content + variableTag,
      variables: prev.variables.includes(variable) 
        ? prev.variables 
        : [...prev.variables, variable]
    }));
  };

  const renderPreview = () => {
    let preview = editingTemplate.content;
    Object.entries(previewData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return preview;
  };

  const getCharacterCount = () => {
    const preview = renderPreview();
    return {
      count: preview.length,
      segments: editingTemplate.type === 'sms' ? Math.ceil(preview.length / 160) : 1,
      estimatedCost: editingTemplate.type === 'sms' ? Math.ceil(preview.length / 160) * 0.0075 : 0
    };
  };

  const handleSave = () => {
    if (!editingTemplate.name || !editingTemplate.content) return;
    
    const templateToSave = {
      ...editingTemplate,
      id: editingTemplate.id || crypto.randomUUID()
    };
    onSave(templateToSave);
  };

  const stats = getCharacterCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {template ? 'Edit Template' : 'Create New Template'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!editingTemplate.name || !editingTemplate.content}>
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Template Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Template Name</Label>
                  <Input
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Template name"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select 
                    value={editingTemplate.type} 
                    onValueChange={(value: 'email' | 'sms') => 
                      setEditingTemplate(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <Select 
                  value={editingTemplate.category} 
                  onValueChange={(value) => setEditingTemplate(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="confirmation">Confirmation</SelectItem>
                    <SelectItem value="cancellation">Cancellation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingTemplate.type === 'email' && (
                <div>
                  <Label>Subject Line</Label>
                  <Input
                    value={editingTemplate.subject || ''}
                    onChange={(e) => setEditingTemplate(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Email subject"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Content Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={editingTemplate.content}
                onChange={(e) => setEditingTemplate(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your template content..."
                rows={12}
                className="font-mono"
              />
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{stats.count} characters</span>
                {editingTemplate.type === 'sms' && (
                  <div className="flex gap-4">
                    <span>{stats.segments} segments</span>
                    <span>Est. cost: ${stats.estimatedCost.toFixed(4)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Available Variables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {availableVariables.map((variable) => (
                  <Button
                    key={variable.key}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable.key)}
                    className="justify-start text-left h-auto p-2"
                    title={variable.description}
                  >
                    <span className="font-mono text-xs">
                      {`{{${variable.key}}}`}
                    </span>
                  </Button>
                ))}
              </div>
              
              <Alert className="mt-4">
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Click any variable to insert it into your template. Variables will be replaced with actual data when the message is sent.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="raw">Raw Content</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="mt-4">
                  <div className="border rounded-lg p-4 min-h-48 bg-gray-50">
                    {editingTemplate.type === 'email' && editingTemplate.subject && (
                      <div className="mb-4 pb-2 border-b">
                        <strong>Subject:</strong> {editingTemplate.subject.replace(/{{(\w+)}}/g, (match, key) => previewData[key as keyof typeof previewData] || match)}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">
                      {renderPreview() || 'Start typing to see preview...'}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="raw" className="mt-4">
                  <div className="border rounded-lg p-4 min-h-48 bg-gray-900 text-green-400 font-mono text-sm">
                    <pre className="whitespace-pre-wrap">
                      {editingTemplate.content || 'No content yet...'}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Preview Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(previewData).map(([key, value]) => (
                  <div key={key}>
                    <Label className="text-xs">{key}</Label>
                    <Input
                      value={value}
                      onChange={(e) => setPreviewData(prev => ({ ...prev, [key]: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Used Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {editingTemplate.variables.map((variable) => (
                  <Badge key={variable} variant="secondary" className="font-mono">
                    {`{{${variable}}}`}
                  </Badge>
                ))}
                {editingTemplate.variables.length === 0 && (
                  <span className="text-gray-500 text-sm">No variables used yet</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
