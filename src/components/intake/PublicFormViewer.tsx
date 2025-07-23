import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CheckCircle, AlertCircle, FileText, Loader2, Shield, Clock, Mic } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { VoiceEnabledFormField } from './VoiceEnabledFormField';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'email' | 'phone' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface PublicFormViewerProps {
  formId: string;
  className?: string;
  onSubmitSuccess?: () => void;
}

export const PublicFormViewer: React.FC<PublicFormViewerProps> = ({
  formId,
  className,
  onSubmitSuccess
}) => {
  const [form, setForm] = useState<{
    id: string;
    title: string;
    description?: string;
    form_fields: Array<{
      id: string;
      type: string;
      label: string;
      required?: boolean;
      options?: string[];
      validation?: Record<string, unknown>;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [formId]);

  useEffect(() => {
    if (form) {
      // Calculate progress based on filled fields
      const formFields = Array.isArray(form.form_fields) ? form.form_fields : [];
      const totalFields = formFields.length;
      const filledFields = formFields.filter((field: any) => {
        if (field && typeof field === 'object' && field.id) {
          const value = formData[field.id];
          return value !== '' && value !== false && value !== null && value !== undefined;
        }
        return false;
      }).length;
      
      setProgress(totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0);
    }
  }, [formData, form]);

  const fetchForm = async () => {
    try {
      const { data, error } = await supabase
        .from('intake_forms')
        .select('*')
        .eq('id', formId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching form:', error);
        toast.error('Form not found or is no longer available');
        return;
      }

      setForm({
        id: data.id,
        title: data.title,
        description: data.description,
        form_fields: Array.isArray(data.form_fields) ? data.form_fields as Array<{
          id: string;
          type: string;
          label: string;
          required?: boolean;
          options?: string[];
          validation?: Record<string, unknown>;
        }> : []
      });
      
      // Initialize form data with empty values
      const initialData: Record<string, any> = {};
      const formFields = Array.isArray(data.form_fields) ? data.form_fields : [];
      formFields.forEach((field: any) => {
        if (field && typeof field === 'object' && field.id && field.type) {
          initialData[field.id] = field.type === 'checkbox' ? false : '';
        }
      });
      setFormData(initialData);
    } catch (error) {
      console.error('Error loading form:', error);
      toast.error('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.type === 'phone' && value) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-()]/g, ''))) {
        return 'Please enter a valid phone number';
      }
    }

    return null;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form) return;

    // Validate all fields
    const formFields = Array.isArray(form.form_fields) ? form.form_fields : [];
    const newErrors: Record<string, string> = {};
    
    formFields.forEach((field: any) => {
      if (field && typeof field === 'object' && field.id && field.type) {
        const error = validateField(field as FormField, formData[field.id]);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Extract patient contact info from form data
      const emailField = formFields.find((f: any) => f && f.type === 'email');
      const phoneField = formFields.find((f: any) => f && f.type === 'phone');
      const nameField = formFields.find((f: any) => 
        f && f.label && (f.label.toLowerCase().includes('name') || f.id.toLowerCase().includes('name'))
      );

      const submissionData = {
        form_id: formId,
        patient_id: null,
        submission_data: JSON.parse(JSON.stringify(formData)),
        status: 'pending',
        priority_level: 'normal',
        ai_summary: null
      };

      const { data, error } = await supabase
        .from('intake_submissions')
        .insert(submissionData)
        .select()
        .single();

      if (error) {
        console.error('Submission error:', error);
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
      onSubmitSuccess?.();
      toast.success('Form submitted successfully! We will contact you soon.');

    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];
    const error = errors[field.id];
    const fieldId = `field-${field.id}`;

    const commonProps = {
      id: fieldId,
      className: cn(error && "border-red-500")
    };

    // Use voice-enabled fields for text inputs
    if (['text', 'email', 'phone', 'textarea'].includes(field.type)) {
      return (
        <div key={field.id} className="space-y-2">
          <VoiceEnabledFormField
            field={{
              name: field.id,
              label: field.label,
              type: field.type as 'text' | 'email' | 'phone' | 'textarea',
              required: field.required,
              placeholder: field.placeholder,
            }}
            value={String(value || '')}
            onChange={(newValue) => handleFieldChange(field.id, newValue)}
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      );
    }

    switch (field.type) {
      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="number"
              placeholder={field.placeholder}
              value={String(value || '')}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={String(value || '')} onValueChange={(val) => handleFieldChange(field.id, val)}>
              <SelectTrigger className={cn(error && "border-red-500")}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-3">
            <Label className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup
              value={String(value || '')}
              onValueChange={(val) => handleFieldChange(field.id, val)}
            >
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${fieldId}-${option}`} />
                  <Label htmlFor={`${fieldId}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={Boolean(value)}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              className={cn(error && "border-red-500")}
            />
            <Label htmlFor={fieldId} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            {error && <p className="text-sm text-red-500 ml-6">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground",
                    error && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(String(value)), 'PPP') : <span>{field.placeholder || 'Pick a date'}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background border shadow-md z-50" align="start">
                <Calendar
                  mode="single"
                  selected={value ? new Date(String(value)) : undefined}
                  onSelect={(date) => handleFieldChange(field.id, date?.toISOString().split('T')[0])}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading form...</p>
        </CardContent>
      </Card>
    );
  }

  if (!form) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Form not found or no longer available</p>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Form Submitted Successfully!</h3>
          <p className="text-muted-foreground">
            Thank you for completing the form. We have received your information and will contact you soon.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formFields = Array.isArray(form.form_fields) ? form.form_fields : [];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {form.title}
            </CardTitle>
            {form.description && (
              <CardDescription className="mt-2">
                {form.description}
              </CardDescription>
            )}
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {progress}% Complete
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Voice Input Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Voice Input Available</span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            You can speak your answers instead of typing. Just click the voice button next to any text field.
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Privacy & Security</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Your information is encrypted and secure. We will only use it to provide you with the best care possible.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formFields.map((field: any) => {
            if (field && typeof field === 'object' && field.id && field.type) {
              return renderField(field as FormField);
            }
            return null;
          })}

          <div className="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting || progress < 50} // Require at least 50% completion
              className="flex items-center gap-2"
              size="lg"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </div>

          {progress < 50 && (
            <p className="text-xs text-center text-muted-foreground">
              Please complete at least 50% of the form to submit
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};