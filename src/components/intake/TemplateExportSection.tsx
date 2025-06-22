
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface TemplateExportSectionProps {
  templates: Template[];
}

export const TemplateExportSection: React.FC<TemplateExportSectionProps> = ({
  templates
}) => {
  const { toast } = useToast();

  const handleExport = () => {
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      templates: templates.filter(t => !t.id.includes('built-in')), // Only export custom templates
      count: templates.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `templates-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Templates Exported",
      description: `Successfully exported ${exportData.templates.length} custom templates`,
    });
  };

  const customTemplatesCount = templates.filter(t => !t.id.includes('built-in')).length;

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Export Templates</h3>
      <p className="text-sm text-gray-600">
        Download your custom templates as a JSON file for backup or sharing.
      </p>
      <Button 
        onClick={handleExport}
        className="w-full flex items-center gap-2"
        disabled={customTemplatesCount === 0}
      >
        <Download className="w-4 h-4" />
        Export Custom Templates
      </Button>
      <p className="text-xs text-gray-500">
        {customTemplatesCount} custom templates available
      </p>
    </div>
  );
};
