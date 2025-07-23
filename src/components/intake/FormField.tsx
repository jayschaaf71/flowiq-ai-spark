
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface FormFieldProps {
  field: FormField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

export const FormFieldComponent: React.FC<FormFieldProps> = ({ 
  field, 
  value, 
  error, 
  onChange 
}) => {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={field.id}
            type={field.type}
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Textarea
            id={field.id}
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={error ? 'border-red-500' : ''}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select
            value={String(value || '')}
            onValueChange={onChange}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value === true}
              onCheckedChange={onChange}
              className={error ? 'border-red-500' : ''}
            />
            <Label htmlFor={field.id} className="text-sm">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          <Label>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <RadioGroup
            value={String(value || '')}
            onValueChange={onChange}
            className={error ? 'border border-red-500 rounded p-2' : ''}
          >
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      );

    default:
      return null;
  }
};
