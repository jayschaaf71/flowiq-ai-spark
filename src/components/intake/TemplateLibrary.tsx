
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { TemplateEditor } from './TemplateEditor';
import { TemplateFilters } from './TemplateFilters';
import { TemplateGrid } from './TemplateGrid';
import { useTemplates, Template } from '@/hooks/useTemplates';
import { Skeleton } from '@/components/ui/skeleton';

export const TemplateLibrary: React.FC = () => {
  const { 
    templates, 
    isLoading, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate,
    isCreating,
    isUpdating 
  } = useTemplates();
  
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
    const duplicated = {
      name: `${template.name} (Copy)`,
      type: template.type,
      category: template.category,
      subject: template.subject,
      content: template.content,
      variables: template.variables,
      isActive: true,
      styling: template.styling || {},
      metadata: template.metadata || {}
    };
    createTemplate(duplicated);
  };

  const handleDelete = (templateId: string) => {
    deleteTemplate(templateId);
  };

  const handleSaveTemplate = (templateData: Omit<Template, 'id' | 'isBuiltIn' | 'usageCount' | 'lastUsed' | 'createdAt' | 'updatedAt'>) => {
    if (editingTemplate) {
      updateTemplate({ 
        id: editingTemplate.id, 
        ...templateData 
      });
    } else {
      createTemplate(templateData);
    }
    setIsEditorOpen(false);
    setEditingTemplate(undefined);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

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
      <TemplateFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* Templates Grid */}
      <TemplateGrid
        templates={filteredTemplates}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />

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
            isEditing={!!editingTemplate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
