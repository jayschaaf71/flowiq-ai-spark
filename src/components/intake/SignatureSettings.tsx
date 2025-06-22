
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface SignatureConfig {
  consentText?: string;
  signerNameRequired: boolean;
  dateRequired: boolean;
}

interface AdvancedField {
  id: string;
  signature?: SignatureConfig;
}

interface SignatureSettingsProps {
  field: AdvancedField;
  onUpdate: (fieldId: string, updates: Partial<AdvancedField>) => void;
  selectedFieldId: string;
}

export const SignatureSettings: React.FC<SignatureSettingsProps> = ({
  field,
  onUpdate,
  selectedFieldId
}) => {
  return (
    <div className="border-t pt-4 space-y-3">
      <Label className="text-sm font-medium">Signature Settings</Label>
      
      <div>
        <Label className="text-xs">Consent Text</Label>
        <Textarea
          value={field.signature?.consentText || ''}
          onChange={(e) => onUpdate(selectedFieldId, {
            signature: {
              ...field.signature!,
              consentText: e.target.value
            }
          })}
          placeholder="I agree to the terms and conditions..."
          rows={3}
          className="text-xs"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={field.signature?.signerNameRequired || false}
          onCheckedChange={(checked) => onUpdate(selectedFieldId, {
            signature: {
              ...field.signature!,
              signerNameRequired: checked
            }
          })}
        />
        <Label className="text-xs">Require signer name</Label>
      </div>
    </div>
  );
};
