
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  helpText?: string;
}

interface EnhancedFormFieldProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
  showValidation?: boolean;
}

export const EnhancedFormField: React.FC<EnhancedFormFieldProps> = ({ 
  field, 
  value, 
  error, 
  onChange,
  onBlur,
  showValidation = true
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setHasBeenTouched(true);
    onBlur?.();
  }, [onBlur]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const isValid = !error && hasBeenTouched && value;
  const showError = error && hasBeenTouched && !isFocused;
  const showSuccess = showValidation && isValid && !isFocused;

  const getFieldIcon = () => {
    if (showError) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (showSuccess) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    return null;
  };

  const fieldProps = {
    onFocus: handleFocus,
    onBlur: handleBlur,
    className: cn(
      'transition-colors',
      showError && 'border-red-500 focus:border-red-500',
      showSuccess && 'border-green-500',
      'pr-8'
    )
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div className="relative">
            <Input
              id={field.id}
              type={field.type}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              {...fieldProps}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {getFieldIcon()}
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div className="relative">
            <Textarea
              id={field.id}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              {...fieldProps}
            />
            <div className="absolute right-2 top-2">
              {getFieldIcon()}
            </div>
          </div>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  showError && 'border-red-500',
                  showSuccess && 'border-green-500'
                )}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : <span>{field.placeholder || "Pick a date"}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={onChange}
          >
            <SelectTrigger 
              className={cn(
                showError && 'border-red-500',
                showSuccess && 'border-green-500'
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
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
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value === true}
              onCheckedChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                showError && 'border-red-500',
                showSuccess && 'border-green-500'
              )}
            />
            <Label htmlFor={field.id} className="text-sm cursor-pointer">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={onChange}
            className={cn(
              'space-y-2',
              showError && 'border border-red-500 rounded p-2',
              showSuccess && 'border border-green-500 rounded p-2'
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  if (field.type === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderField()}
        {field.helpText && (
          <p className="text-xs text-gray-500">{field.helpText}</p>
        )}
        {showError && <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="flex items-center gap-1">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </Label>
      {renderField()}
      {field.helpText && (
        <p className="text-xs text-gray-500">{field.helpText}</p>
      )}
      {showError && <p className="text-red-500 text-sm flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>}
    </div>
  );
};
