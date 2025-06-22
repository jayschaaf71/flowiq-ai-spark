
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Code2, 
  Variable,
  Settings,
  Info,
  Copy
} from 'lucide-react';

interface CustomVariable {
  id: string;
  key: string;
  label: string;
  description: string;
  type: 'text' | 'date' | 'number' | 'boolean' | 'select';
  defaultValue?: string;
  options?: string[]; // For select type
  category: string;
  isSystem: boolean;
}

interface VariableMapping {
  templateId: string;
  variableId: string;
  customValue?: string;
}

const systemVariables: CustomVariable[] = [
  {
    id: 'patient-name',
    key: 'patientName',
    label: 'Patient Name',
    description: 'Full name of the patient',
    type: 'text',
    category: 'Patient Info',
    isSystem: true
  },
  {
    id: 'appointment-date',
    key: 'appointmentDate',
    label: 'Appointment Date',
    description: 'Date of the appointment',
    type: 'date',
    category: 'Appointment',
    isSystem: true
  },
  {
    id: 'practice-name',
    key: 'practiceName',
    label: 'Practice Name',
    description: 'Name of the medical practice',
    type: 'text',
    defaultValue: 'Your Practice Name',
    category: 'Practice Info',
    isSystem: true
  }
];

export const TemplateVariableSystem: React.FC = () => {
  const [variables, setVariables] = useState<CustomVariable[]>(systemVariables);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<CustomVariable | null>(null);
  const [newVariable, setNewVariable] = useState<Partial<CustomVariable>>({
    key: '',
    label: '',
    description: '',
    type: 'text',
    category: 'Custom',
    isSystem: false
  });

  const categories = [...new Set(variables.map(v => v.category))];

  const handleCreateVariable = () => {
    if (!newVariable.key || !newVariable.label) return;

    const variable: CustomVariable = {
      id: crypto.randomUUID(),
      key: newVariable.key,
      label: newVariable.label,
      description: newVariable.description || '',
      type: newVariable.type || 'text',
      defaultValue: newVariable.defaultValue,
      options: newVariable.options,
      category: newVariable.category || 'Custom',
      isSystem: false
    };

    setVariables(prev => [...prev, variable]);
    setNewVariable({
      key: '',
      label: '',
      description: '',
      type: 'text',
      category: 'Custom',
      isSystem: false
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditVariable = (variable: CustomVariable) => {
    setEditingVariable(variable);
    setNewVariable(variable);
    setIsCreateDialogOpen(true);
  };

  const handleUpdateVariable = () => {
    if (!editingVariable || !newVariable.key || !newVariable.label) return;

    setVariables(prev => prev.map(v => 
      v.id === editingVariable.id 
        ? { ...v, ...newVariable } as CustomVariable
        : v
    ));
    
    setEditingVariable(null);
    setNewVariable({
      key: '',
      label: '',
      description: '',
      type: 'text',
      category: 'Custom',
      isSystem: false
    });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteVariable = (id: string) => {
    setVariables(prev => prev.filter(v => v.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝';
      case 'date': return '📅';
      case 'number': return '🔢';
      case 'boolean': return '✅';
      case 'select': return '📋';
      default: return '📝';
    }
  };

  const variablesByCategory = variables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, CustomVariable[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Template Variables</h2>
          <p className="text-gray-600">Manage custom variables for your templates</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Variable
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingVariable ? 'Edit Variable' : 'Create Custom Variable'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Variable Key</Label>
                  <Input
                    value={newVariable.key || ''}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="variableKey"
                  />
                </div>
                <div>
                  <Label>Display Label</Label>
                  <Input
                    value={newVariable.label || ''}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Variable Label"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newVariable.description || ''}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this variable represents..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select 
                    value={newVariable.type} 
                    onValueChange={(value) => setNewVariable(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="select">Select List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={newVariable.category || ''}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Category"
                  />
                </div>
              </div>

              <div>
                <Label>Default Value</Label>
                <Input
                  value={newVariable.defaultValue || ''}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, defaultValue: e.target.value }))}
                  placeholder="Default value (optional)"
                />
              </div>

              {newVariable.type === 'select' && (
                <div>
                  <Label>Options (comma-separated)</Label>
                  <Input
                    value={newVariable.options?.join(', ') || ''}
                    onChange={(e) => setNewVariable(prev => ({ 
                      ...prev, 
                      options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }))}
                    placeholder="Option 1, Option 2, Option 3"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingVariable ? handleUpdateVariable : handleCreateVariable}>
                  {editingVariable ? 'Update' : 'Create'} Variable
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.entries(variablesByCategory).map(([category, categoryVariables]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Variable className="w-5 h-5" />
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryVariables.map((variable) => (
                  <Card key={variable.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(variable.type)}</span>
                          <div>
                            <h4 className="font-medium">{variable.label}</h4>
                            <code className="text-xs text-blue-600 bg-blue-50 px-1 rounded">
                              {`{{${variable.key}}}`}
                            </code>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {variable.isSystem && (
                            <Badge variant="secondary" className="text-xs">System</Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {variable.description}
                      </p>

                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Type: {variable.type}</div>
                        {variable.defaultValue && (
                          <div>Default: {variable.defaultValue}</div>
                        )}
                        {variable.options && (
                          <div>Options: {variable.options.join(', ')}</div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(`{{${variable.key}}}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        {!variable.isSystem && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditVariable(variable)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteVariable(variable.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
