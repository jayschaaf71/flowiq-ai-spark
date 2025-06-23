
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTemplates, Template } from '@/hooks/useTemplates';

interface TemplateImportSectionProps {
  onImportComplete?: () => void;
}

export const TemplateImportSection: React.FC<TemplateImportSectionProps> = ({
  onImportComplete
}) => {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();
  const { createTemplate } = useTemplates();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      // Validate import data structure
      if (!importData.templates || !Array.isArray(importData.templates)) {
        throw new Error('Invalid template file format. Expected templates array.');
      }

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Process each template
      for (const templateData of importData.templates) {
        try {
          // Validate required fields
          if (!templateData.name || !templateData.content || !templateData.type) {
            errors.push(`Template missing required fields: ${templateData.name || 'Unknown'}`);
            errorCount++;
            continue;
          }

          // Create template using our hook
          const newTemplate = {
            name: `${templateData.name} (Imported)`,
            type: templateData.type as 'email' | 'sms',
            category: templateData.category || 'imported',
            subject: templateData.subject || '',
            content: templateData.content,
            variables: templateData.variables || [],
            isActive: true,
            styling: templateData.styling || {},
            metadata: { ...templateData.metadata, imported: true, importedAt: new Date().toISOString() }
          };

          createTemplate(newTemplate);
          successCount++;
        } catch (error) {
          errors.push(`Failed to import ${templateData.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          errorCount++;
        }
      }

      // Show results
      const message = `Import completed: ${successCount} templates imported successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`;
      
      setImportResult({
        success: successCount > 0,
        message: errors.length > 0 ? `${message}. Errors: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}` : message
      });

      if (successCount > 0) {
        toast({
          title: "Templates Imported",
          description: `Successfully imported ${successCount} templates`,
        });
        onImportComplete?.();
      }

      if (errorCount > 0) {
        toast({
          title: "Import Issues",
          description: `${errorCount} templates failed to import`,
          variant: "destructive",
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse template file';
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
        Upload a template file to import templates into your system. Supports JSON format.
      </p>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <Label htmlFor="template-import" className="cursor-pointer">
          <span className="mt-2 block text-sm font-medium text-gray-900">
            Drop template file here or click to browse
          </span>
        </Label>
        <Input
          id="template-import"
          type="file"
          accept=".json"
          onChange={handleImport}
          disabled={importing}
          className="hidden"
        />
        {importing && (
          <p className="text-sm text-blue-600 mt-2">Importing templates...</p>
        )}
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

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Supported format:</strong> JSON files exported from this system</p>
        <p><strong>Note:</strong> Imported templates will be prefixed with "(Imported)" to avoid name conflicts</p>
      </div>
    </div>
  );
};
