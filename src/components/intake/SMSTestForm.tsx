
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  content: string;
  variables: string[];
}

interface SMSTestFormProps {
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  customMessage: string;
  onCustomMessageChange: (value: string) => void;
  selectedTemplate: Template | null;
  variableValues: Record<string, string>;
  onVariableValueChange: (variable: string, value: string) => void;
}

export const SMSTestForm: React.FC<SMSTestFormProps> = ({
  phoneNumber,
  onPhoneNumberChange,
  customMessage,
  onCustomMessageChange,
  selectedTemplate,
  variableValues,
  onVariableValueChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Test Phone Number</Label>
        <Input
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          placeholder="+1 (555) 123-4567"
          type="tel"
        />
      </div>

      {selectedTemplate && selectedTemplate.variables.length > 0 && (
        <div className="space-y-3">
          <Label>Template Variables</Label>
          {selectedTemplate.variables.map(variable => (
            <div key={variable}>
              <Label className="text-xs text-gray-600">{variable}</Label>
              <Input
                value={variableValues[variable] || ''}
                onChange={(e) => onVariableValueChange(variable, e.target.value)}
                placeholder={`Enter ${variable}`}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      )}

      <div>
        <Label>Message Content</Label>
        <Textarea
          value={customMessage}
          onChange={(e) => onCustomMessageChange(e.target.value)}
          placeholder="Enter your SMS message..."
          rows={6}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
};
