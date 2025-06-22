
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { CustomVariableForm } from './components/CustomVariableForm';
import { VariablesByCategory } from './components/VariablesByCategory';
import { CustomVariable, systemVariables } from './types/variableTypes';

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

  const variablesByCategory = variables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, CustomVariable[]>);

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
    resetForm();
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
    
    resetForm();
  };

  const handleDeleteVariable = (id: string) => {
    setVariables(prev => prev.filter(v => v.id !== id));
  };

  const resetForm = () => {
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
            
            <CustomVariableForm
              variable={newVariable}
              onChange={setNewVariable}
              onSave={editingVariable ? handleUpdateVariable : handleCreateVariable}
              onCancel={resetForm}
              isEditing={!!editingVariable}
            />
          </DialogContent>
        </Dialog>
      </div>

      <VariablesByCategory
        variablesByCategory={variablesByCategory}
        onEditVariable={handleEditVariable}
        onDeleteVariable={handleDeleteVariable}
      />
    </div>
  );
};
