
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IntakeForm, useIntakeForms } from '@/hooks/useIntakeForms';
import { useTenantConfig } from '@/utils/tenantConfig';
import { EnhancedFormField } from './EnhancedFormField';
import { FormProgress } from './FormProgress';
import { FormNavigation } from './FormNavigation';
import { FormSuccessMessage } from './FormSuccessMessage';
import { MobileFormOptimizer } from './MobileFormOptimizer';
import { validateFields, calculateFormCompleteness } from './FormValidation';
import { IntakeFormProcessor } from '@/services/intakeFormProcessor';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface PatientFormRendererProps {
  form: IntakeForm;
  onSubmissionComplete?: (submission: Record<string, unknown>) => void;
}

export const PatientFormRenderer: React.FC<PatientFormRendererProps> = ({ 
  form, 
  onSubmissionComplete 
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [completeness, setCompleteness] = useState(0);
  
  const { trackFormEvent } = useIntakeForms();
  const tenantConfig = useTenantConfig();
  const { toast } = useToast();

  // Safely cast form_fields to array with proper type handling
  const fields: FormField[] = Array.isArray(form.form_fields) 
    ? (form.form_fields as unknown as FormField[]).filter((field: unknown): field is FormField => {
        return (
          typeof field === 'object' && 
          field !== null && 
          !Array.isArray(field) &&
          typeof (field as FormField).id === 'string' &&
          typeof (field as FormField).type === 'string' &&
          typeof (field as FormField).label === 'string'
        );
      })
    : [];
  
  const fieldsPerStep = 5;
  const totalSteps = Math.ceil(fields.length / fieldsPerStep);
  const currentFields = fields.slice(currentStep * fieldsPerStep, (currentStep + 1) * fieldsPerStep);

  // Calculate completeness whenever form data changes
  useEffect(() => {
    const newCompleteness = calculateFormCompleteness(fields, formData);
    setCompleteness(newCompleteness);
  }, [formData, fields]);

  useEffect(() => {
    trackFormEvent(form.id, 'form_viewed');
  }, [form.id, trackFormEvent]);

  const validateCurrentStep = (): boolean => {
    const newErrors = validateFields(currentFields, formData);
    setErrors(prev => ({ ...prev, ...newErrors }));
    
    // Clear errors for fields not in current step
    const currentFieldIds = currentFields.map(f => f.id);
    const clearedErrors = { ...errors };
    Object.keys(clearedErrors).forEach(fieldId => {
      if (!currentFieldIds.includes(fieldId)) {
        delete clearedErrors[fieldId];
      }
    });
    setErrors({ ...clearedErrors, ...newErrors });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user changes value
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleFieldBlur = (fieldId: string) => {
    setTouchedFields(prev => new Set([...prev, fieldId]));
    
    // Validate single field on blur
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const fieldErrors = validateFields([field], formData);
      if (fieldErrors[fieldId]) {
        setErrors(prev => ({ ...prev, [fieldId]: fieldErrors[fieldId] }));
      }
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === 0) {
        trackFormEvent(form.id, 'form_started');
      }
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    } else {
      toast({
        title: "Please check your entries",
        description: "Some fields need your attention before continuing.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Please check your entries",
        description: "Some required fields need to be completed.",
        variant: "destructive"
      });
      return;
    }

    // Validate all fields
    const allErrors = validateFields(fields, formData);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast({
        title: "Form incomplete",
        description: "Please complete all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await IntakeFormProcessor.processFormSubmission(
        form.id,
        fields,
        {
          patient_name: String(formData.full_name || `${formData.first_name || ''} ${formData.last_name || ''}`.trim() || 'Unknown Patient'),
          patient_email: String(formData.email || ''),
          patient_phone: String(formData.phone || ''),
          form_data: formData
        }
      );

      if (result.success) {
        setSubmitted(true);
        onSubmissionComplete?.(result as unknown as Record<string, unknown>);
        
        toast({
          title: "Form submitted successfully!",
          description: `Your form has been processed with ${result.completeness}% completeness.`,
        });

        // Track completion analytics
        await trackFormEvent(form.id, 'form_completed', {
          completeness: result.completeness,
          priority: result.priorityLevel
        });
      } else {
        throw new Error(result.errors?.join(', ') || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <FormSuccessMessage />;
  }

  const progressPercentage = totalSteps > 1 ? ((currentStep + 1) / totalSteps) * 100 : completeness;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <MobileFormOptimizer
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        <FormProgress
          title={form.title}
          description={form.description}
          currentStep={currentStep}
          totalSteps={totalSteps}
          primaryColor={tenantConfig.primaryColor}
          completeness={completeness}
        />

        {/* Form completeness indicator */}
        <Alert className="border-blue-200 bg-blue-50">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Form is {completeness}% complete
            {completeness < 100 && ` • ${Math.ceil((100 - completeness) / 20)} more fields to go`}
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="space-y-6 pt-6">
            {currentFields.map(field => (
              <EnhancedFormField
                key={field.id}
                field={field}
                value={formData[field.id]}
                error={errors[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
                onBlur={() => handleFieldBlur(field.id)}
                showValidation={touchedFields.has(field.id)}
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
          hasErrors={Object.keys(errors).length > 0}
          completeness={completeness}
        />
      </MobileFormOptimizer>
    </div>
  );
};
