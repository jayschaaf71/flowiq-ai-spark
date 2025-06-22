
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { TemplateEditor } from './TemplateEditor';
import { TemplateFilters } from './TemplateFilters';
import { TemplateGrid } from './TemplateGrid';
import { builtInTemplates, Template } from './BuiltInTemplates';

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
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
