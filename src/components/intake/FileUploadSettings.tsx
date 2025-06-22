
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FileUploadConfig {
  acceptedTypes: string[];
  maxSize: number;
  multiple: boolean;
}

interface AdvancedField {
  id: string;
  fileUpload?: FileUploadConfig;
}

interface FileUploadSettingsProps {
  field: AdvancedField;
  onUpdate: (fieldId: string, updates: Partial<AdvancedField>) => void;
  selectedFieldId: string;
}

export const FileUploadSettings: React.FC<FileUploadSettingsProps> = ({
  field,
  onUpdate,
  selectedFieldId
}) => {
  return (
    <div className="border-t pt-4 space-y-3">
      <Label className="text-sm font-medium">File Upload Settings</Label>
      
      <div>
        <Label className="text-xs">Accepted File Types</Label>
        <Input
          value={field.fileUpload?.acceptedTypes.join(', ') || ''}
          onChange={(e) => onUpdate(selectedFieldId, {
            fileUpload: {
              ...field.fileUpload!,
              acceptedTypes: e.target.value.split(',').map(s => s.trim())
            }
          })}
          placeholder="image/*, .pdf, .doc"
          className="text-xs"
        />
      </div>

      <div>
        <Label className="text-xs">Max File Size (MB)</Label>
        <Input
          type="number"
          value={field.fileUpload?.maxSize || 10}
          onChange={(e) => onUpdate(selectedFieldId, {
            fileUpload: {
              ...field.fileUpload!,
              maxSize: parseInt(e.target.value) || 10
            }
          })}
          className="text-xs"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={field.fileUpload?.multiple || false}
          onCheckedChange={(checked) => onUpdate(selectedFieldId, {
            fileUpload: {
              ...field.fileUpload!,
              multiple: checked
            }
          })}
        />
        <Label className="text-xs">Allow multiple files</Label>
      </div>
    </div>
  );
};
