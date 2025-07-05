import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useCustomVariables, CustomVariable } from '@/hooks/useCustomVariables';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const TemplateVariableSystem: React.FC = () => {
  const {
    variables,
    loading,
    createVariable,
    refetch
  } = useCustomVariables();

  // Create variables by category from the variables array
  const variablesByCategory = variables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, CustomVariable[]>);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newVariable, setNewVariable] = useState<Partial<CustomVariable>>({
    key: '',
    label: '',
    description: '',
    type: 'text',
    category: 'Custom'
  });

  const handleCreateVariable = async () => {
    if (!newVariable.key || !newVariable.label) return;

    const variable: Omit<CustomVariable, 'id' | 'created_at' | 'updated_at'> = {
      key: newVariable.key,
      label: newVariable.label,
      description: newVariable.description || '',
      type: newVariable.type || 'text',
      default_value: newVariable.default_value,
      options: newVariable.options,
      category: newVariable.category || 'Custom',
      is_system: false
    };

    await createVariable(variable);
    resetForm();
  };

  const resetForm = () => {
    setNewVariable({
      key: '',
      label: '',
      description: '',
      type: 'text',
      category: 'Custom'
    });
    setIsCreateDialogOpen(false);
  };

  if (loading) {
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
              <DialogTitle>Create Custom Variable</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Key</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newVariable.key || ''}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="variable_key"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Label</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newVariable.label || ''}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Variable Label"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={newVariable.description || ''}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Variable description"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newVariable.type || 'text'}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="date">Date</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newVariable.category || 'Custom'}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Category"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleCreateVariable}>
                  Create Variable
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.entries(variablesByCategory).map(([category, categoryVariables]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryVariables.map((variable) => (
                <Card key={variable.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{variable.label}</CardTitle>
                      <Badge variant={variable.is_system ? 'default' : 'secondary'}>
                        {variable.is_system ? 'System' : 'Custom'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 font-mono">{variable.key}</p>
                      {variable.description && (
                        <p className="text-sm text-gray-600">{variable.description}</p>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {variable.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};