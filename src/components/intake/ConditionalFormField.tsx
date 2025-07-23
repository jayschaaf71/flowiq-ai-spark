
import React from 'react';
import { EnhancedFormField } from './EnhancedFormField';

interface ConditionalRule {
  dependsOn: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: unknown;
}

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  conditionalRules?: ConditionalRule[];
}

interface ConditionalFormFieldProps {
  field: FormField;
  value: unknown;
  error?: string;
  formData: Record<string, unknown>;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  showValidation: boolean;
}

export const ConditionalFormField: React.FC<ConditionalFormFieldProps> = ({
  field,
  value,
  error,
  formData,
  onChange,
  onBlur,
  showValidation
}) => {
  // Check if field should be visible based on conditional rules
  const shouldShowField = (): boolean => {
    if (!field.conditionalRules || field.conditionalRules.length === 0) {
      return true;
    }

    return field.conditionalRules.every((rule: ConditionalRule) => {
      const dependentValue = formData[rule.dependsOn];
      
      switch (rule.operator) {
        case 'equals':
          return dependentValue === rule.value;
        case 'not_equals':
          return dependentValue !== rule.value;
        case 'contains':
          return Array.isArray(dependentValue) 
            ? dependentValue.includes(rule.value)
            : String(dependentValue || '').toLowerCase().includes(String(rule.value).toLowerCase());
        case 'greater_than':
          return Number(dependentValue) > Number(rule.value);
        case 'less_than':
          return Number(dependentValue) < Number(rule.value);
        default:
          return true;
      }
    });
  };

  if (!shouldShowField()) {
    return null;
  }

  return (
    <EnhancedFormField
      field={field}
      value={value}
      error={error}
      onChange={onChange}
      onBlur={onBlur}
      showValidation={showValidation}
    />
  );
};
