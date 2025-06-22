
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Upload, 
  FileJson,
  Check,
  AlertCircle
} from 'lucide-react';
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

interface TemplateImportExportProps {
  templates: Template[];
  onImportTemplates: (templates: Template[]) => void;
}

export const TemplateImportExport: React.FC<TemplateImportExportProps> = ({
  templates,
  onImportTemplates
}) => {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
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

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      // Validate import data
      if (!importData.templates || !Array.isArray(importData.templates)) {
        throw new Error('Invalid template file format');
      }

      // Generate new IDs for imported templates to avoid conflicts
      const importedTemplates = importData.templates.map((template: any) => ({
        ...template,
        id: crypto.randomUUID(),
        isBuiltIn: false
      }));

      onImportTemplates(importedTemplates);
      
      setImportResult({
        success: true,
        message: `Successfully imported ${importedTemplates.length} templates`
      });

      toast({
        title: "Templates Imported",
        description: `Successfully imported ${importedTemplates.length} templates`,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import templates';
      setImportResult({
        success: false,
        message: errorMessage
      });

      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson className="w-5 h-5" />
          Import / Export Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Export Templates</h3>
            <p className="text-sm text-gray-600">
              Download your custom templates as a JSON file for backup or sharing.
            </p>
            <Button 
              onClick={handleExport}
              className="w-full flex items-center gap-2"
              disabled={templates.filter(t => !t.id.includes('built-in')).length === 0}
            >
              <Download className="w-4 h-4" />
              Export Custom Templates
            </Button>
            <p className="text-xs text-gray-500">
              {templates.filter(t => !t.id.includes('built-in')).length} custom templates available
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Import Templates</h3>
            <p className="text-sm text-gray-600">
              Upload a template file to import templates into your system.
            </p>
            <div>
              <Label htmlFor="template-import" className="sr-only">
                Import Template File
              </Label>
              <Input
                id="template-import"
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={importing}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {importing && (
              <p className="text-sm text-blue-600">Importing templates...</p>
            )}
          </div>
        </div>

        {importResult && (
          <Alert className={importResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {importResult.success ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={importResult.success ? "text-green-800" : "text-red-800"}>
              {importResult.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Import Guidelines</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Only JSON files exported from this system are supported</li>
            <li>• Imported templates will be assigned new IDs to prevent conflicts</li>
            <li>• Built-in templates cannot be overwritten</li>
            <li>• Large files may take a moment to process</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
