
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IntakeForm, useIntakeForms } from '@/hooks/useIntakeForms';
import { useTenantConfig } from '@/utils/tenantConfig';
import { FormFieldComponent } from './FormField';
import { FormProgress } from './FormProgress';
import { FormNavigation } from './FormNavigation';
import { FormSuccessMessage } from './FormSuccessMessage';
import { validateFields } from './FormValidation';
import type { Json } from '@/integrations/supabase/types';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface PatientFormRendererProps {
  form: IntakeForm;
  onSubmissionComplete?: (submission: any) => void;
}

export const PatientFormRenderer: React.FC<PatientFormRendererProps> = ({ 
  form, 
  onSubmissionComplete 
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { submitForm, trackFormEvent } = useIntakeForms();
  const tenantConfig = useTenantConfig();

  // Safely cast form_fields to array with proper type handling
  const fields: FormField[] = Array.isArray(form.form_fields) 
    ? (form.form_fields as unknown as FormField[]).filter((field: any): field is FormField => {
        return (
          typeof field === 'object' && 
          field !== null && 
          !Array.isArray(field) &&
          typeof field.id === 'string' &&
          typeof field.type === 'string' &&
          typeof field.label === 'string'
        );
      })
    : [];
  
  const fieldsPerStep = 5;
  const totalSteps = Math.ceil(fields.length / fieldsPerStep);
  const currentFields = fields.slice(currentStep * fieldsPerStep, (currentStep + 1) * fieldsPerStep);

  useEffect(() => {
    trackFormEvent(form.id, 'form_viewed');
  }, [form.id]);

  const validateCurrentStep = (): boolean => {
    const newErrors = validateFields(currentFields, formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === 0) {
        trackFormEvent(form.id, 'form_started');
      }
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    // Validate all fields
    const allErrors = validateFields(fields, formData);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const submission = await submitForm(form.id, {
        patient_name: formData.full_name || 'Unknown',
        patient_email: formData.email || '',
        patient_phone: formData.phone || '',
        form_data: formData
      });

      setSubmitted(true);
      onSubmissionComplete?.(submission);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <FormSuccessMessage />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <FormProgress
        title={form.title}
        description={form.description}
        currentStep={currentStep}
        totalSteps={totalSteps}
        primaryColor={tenantConfig.primaryColor}
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
          {currentFields.map(field => (
            <FormFieldComponent
              key={field.id}
              field={field}
              value={formData[field.id]}
              error={errors[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
          ))}
        </CardContent>
      </Card>

      <FormNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        isSubmitting={isSubmitting}
        primaryColor={tenantConfig.primaryColor}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
