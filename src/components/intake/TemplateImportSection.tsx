
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle } from 'lucide-react';
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

interface TemplateImportSectionProps {
  onImportTemplates: (templates: Template[]) => void;
}

export const TemplateImportSection: React.FC<TemplateImportSectionProps> = ({
  onImportTemplates
}) => {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

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
    </div>
  );
};
