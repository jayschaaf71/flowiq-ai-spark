
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileJson } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Template } from '@/hooks/useTemplates';

interface TemplateExportSectionProps {
  templates: Template[];
}

export const TemplateExportSection: React.FC<TemplateExportSectionProps> = ({
  templates
}) => {
  const { toast } = useToast();

  const handleExportAll = () => {
    const customTemplates = templates.filter(t => !t.isBuiltIn);
    exportTemplates(customTemplates, 'all-templates');
  };

  const handleExportByType = (type: 'email' | 'sms') => {
    const filteredTemplates = templates.filter(t => !t.isBuiltIn && t.type === type);
    exportTemplates(filteredTemplates, `${type}-templates`);
  };

  const handleExportByCategory = (category: string) => {
    const filteredTemplates = templates.filter(t => !t.isBuiltIn && t.category === category);
    exportTemplates(filteredTemplates, `${category}-templates`);
  };

  const exportTemplates = (templatesToExport: Template[], filename: string) => {
    if (templatesToExport.length === 0) {
      toast({
        title: "No Templates",
        description: "No templates available for export with the selected criteria",
        variant: "destructive",
      });
      return;
    }

    // Prepare export data
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      exportType: filename,
      templates: templatesToExport.map(template => ({
        name: template.name,
        type: template.type,
        category: template.category,
        subject: template.subject,
        content: template.content,
        variables: template.variables,
        styling: template.styling,
        metadata: {
          ...template.metadata,
          originalId: template.id,
          exportedAt: new Date().toISOString()
        }
      })),
      count: templatesToExport.length,
      metadata: {
        exportedBy: "Template Management System",
        totalTemplates: templates.length,
        customTemplates: templates.filter(t => !t.isBuiltIn).length
      }
    };

    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Templates Exported",
      description: `Successfully exported ${templatesToExport.length} templates`,
    });
  };

  const customTemplatesCount = templates.filter(t => !t.isBuiltIn).length;
  const emailTemplatesCount = templates.filter(t => !t.isBuiltIn && t.type === 'email').length;
  const smsTemplatesCount = templates.filter(t => !t.isBuiltIn && t.type === 'sms').length;

  // Get unique categories from custom templates
  const categories = [...new Set(templates.filter(t => !t.isBuiltIn).map(t => t.category))];

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Export Templates</h3>
      <p className="text-sm text-gray-600">
        Download your custom templates as JSON files for backup or sharing.
      </p>

      <div className="space-y-3">
        {/* Export All */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4 text-blue-500" />
            <span className="font-medium">All Custom Templates</span>
            <Badge variant="secondary">{customTemplatesCount}</Badge>
          </div>
          <Button 
            onClick={handleExportAll}
            disabled={customTemplatesCount === 0}
            size="sm"
          >
            <Download className="w-4 h-4 mr-1" />
            Export All
          </Button>
        </div>

        {/* Export by Type */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Export by Type</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <span className="text-sm">Email Templates</span>
                <Badge variant="outline" className="text-xs">{emailTemplatesCount}</Badge>
              </div>
              <Button 
                onClick={() => handleExportByType('email')}
                disabled={emailTemplatesCount === 0}
                size="sm"
                variant="outline"
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <span className="text-sm">SMS Templates</span>
                <Badge variant="outline" className="text-xs">{smsTemplatesCount}</Badge>
              </div>
              <Button 
                onClick={() => handleExportByType('sms')}
                disabled={smsTemplatesCount === 0}
                size="sm"
                variant="outline"
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Export by Category */}
        {categories.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Export by Category</h4>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => {
                const count = templates.filter(t => !t.isBuiltIn && t.category === category).length;
                return (
                  <div key={category} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm capitalize">{category}</span>
                      <Badge variant="outline" className="text-xs">{count}</Badge>
                    </div>
                    <Button 
                      onClick={() => handleExportByCategory(category)}
                      disabled={count === 0}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>File format:</strong> JSON with metadata and version information</p>
        <p><strong>Note:</strong> Only custom templates are exported (built-in templates are excluded)</p>
      </div>
    </div>
  );
};
