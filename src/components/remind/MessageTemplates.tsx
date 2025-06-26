
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Mail, Plus, Edit, Trash2 } from "lucide-react";
import { TemplateForm } from "./templates/TemplateForm";
import { useMessageTemplates, useDeleteMessageTemplate } from "@/hooks/useMessageTemplates";

export const MessageTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const { data: templates = [], isLoading } = useMessageTemplates();
  const deleteTemplate = useDeleteMessageTemplate();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading templates...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Message Templates</h3>
          <p className="text-sm text-gray-600">
            Create and manage reusable message templates for appointments
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
              <DialogDescription>
                {selectedTemplate 
                  ? 'Update your message template' 
                  : 'Create a new message template for appointment reminders'
                }
              </DialogDescription>
            </DialogHeader>
            <TemplateForm 
              template={selectedTemplate} 
              onClose={() => {
                setShowForm(false);
                setSelectedTemplate(null);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {template.type === 'email' ? (
                    <Mail className="w-4 h-4 text-blue-600" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  )}
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <Badge variant="outline" className="capitalize">
                  {template.type}
                </Badge>
              </div>
              {template.subject && (
                <CardDescription className="text-sm font-medium">
                  {template.subject}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {template.content}
              </p>
              
              {template.variables && template.variables.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowForm(true);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(template.id)}
                  disabled={deleteTemplate.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first message template to get started with automated reminders.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
