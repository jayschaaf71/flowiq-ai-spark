
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { CustomVariableForm } from './components/CustomVariableForm';
import { VariablesByCategory } from './components/VariablesByCategory';
import { useCustomVariables, CustomVariable } from '@/hooks/useCustomVariables';
import { Skeleton } from '@/components/ui/skeleton';

export const TemplateVariableSystem: React.FC = () => {
  const {
    variables,
    variablesByCategory,
    isLoading,
    createVariable,
    updateVariable,
    deleteVariable,
    isCreating,
    isUpdating
  } = useCustomVariables();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<CustomVariable | null>(null);
  const [newVariable, setNewVariable] = useState<Partial<CustomVariable>>({
    key: '',
    label: '',
    description: '',
    type: 'text',
    category: 'Custom'
  });

  const handleCreateVariable = () => {
    if (!newVariable.key || !newVariable.label) return;

    const variable: Omit<CustomVariable, 'id' | 'isSystem' | 'createdAt' | 'updatedAt'> = {
      key: newVariable.key,
      label: newVariable.label,
      description: newVariable.description || '',
      type: newVariable.type || 'text',
      defaultValue: newVariable.defaultValue,
      options: newVariable.options,
      category: newVariable.category || 'Custom'
    };

    createVariable(variable);
    resetForm();
  };

  const handleEditVariable = (variable: CustomVariable) => {
    setEditingVariable(variable);
    setNewVariable(variable);
    setIsCreateDialogOpen(true);
  };

  const handleUpdateVariable = () => {
    if (!editingVariable || !newVariable.key || !newVariable.label) return;

    updateVariable({
      id: editingVariable.id,
      ...newVariable
    } as CustomVariable & { id: string });
    
    resetForm();
  };

  const handleDeleteVariable = (id: string) => {
    deleteVariable(id);
  };

  const resetForm = () => {
    setEditingVariable(null);
    setNewVariable({
      key: '',
      label: '',
      description: '',
      type: 'text',
      category: 'Custom'
    });
    setIsCreateDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-32 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
