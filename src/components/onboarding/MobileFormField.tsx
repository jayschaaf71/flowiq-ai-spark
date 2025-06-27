
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpCircle, AlertTriangle } from 'lucide-react';

interface MobileFormFieldProps {
  field: {
    id: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    description?: string;
    options?: Array<{ value: string; label: string }>;
  };
  value: any;
  onChange: (value: any) => void;
  error?: string;
  className?: string;
}

export const MobileFormField: React.FC<MobileFormFieldProps> = ({
  field,
  value,
  onChange,
  error,
  className = ''
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="h-12 text-base" // Larger touch targets
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="min-h-[120px] text-base"
            rows={4}
          />
        );

      case 'select':
        return (
          <div className="space-y-3">
            <RadioGroup
              value={value}
              onValueChange={onChange}
            >
              {field.options?.map((option) => (
                <Card 
                  key={option.value} 
                  className={`cursor-pointer transition-colors ${
                    value === option.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onChange(option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem 
                        value={option.value} 
                        id={option.value}
                        className="mt-0.5"
                      />
                      <Label 
                        htmlFor={option.value}
                        className="flex-1 text-base cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </div>
        );

      case 'boolean':
        return (
          <Card className="cursor-pointer" onClick={() => onChange(!value)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-base font-medium cursor-pointer">
                    {field.label}
                  </Label>
                  {field.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {field.description}
                    </p>
                  )}
                </div>
                <Switch
                  checked={value || false}
                  onCheckedChange={onChange}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'multiple':
        return (
          <div className="space-y-3">
            {field.options?.map((option) => {
              const isSelected = Array.isArray(value) && value.includes(option.value);
              return (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (isSelected) {
                      onChange(currentValues.filter(v => v !== option.value));
                    } else {
                      onChange([...currentValues, option.value]);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base cursor-pointer">
                        {option.label}
                      </Label>
                      {isSelected && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="h-12 text-base"
          />
        );
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {field.type !== 'boolean' && (
        <div className="flex items-center gap-2">
          <Label className="text-base font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {field.description && (
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </Button>
          )}
        </div>
      )}
      
      {field.description && field.type !== 'boolean' && (
        <p className="text-sm text-gray-600 -mt-1">
          {field.description}
        </p>
      )}
      
      {renderField()}
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
