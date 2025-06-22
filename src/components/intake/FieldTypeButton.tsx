
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, PenTool } from 'lucide-react';

interface FieldTypeButtonProps {
  type: {
    value: string;
    label: string;
  };
  onAddField: (type: string) => void;
}

export const FieldTypeButton: React.FC<FieldTypeButtonProps> = ({ type, onAddField }) => {
  return (
    <Button
      variant="outline"
      className="h-16 flex-col gap-1"
      onClick={() => onAddField(type.value)}
    >
      {type.value === 'file' && <Upload className="w-4 h-4" />}
      {type.value === 'signature' && <PenTool className="w-4 h-4" />}
      <span className="text-xs">{type.label}</span>
    </Button>
  );
};
