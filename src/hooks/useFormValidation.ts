import { useState, useCallback } from 'react';
import { z } from 'zod';
import { sanitizeFormData } from '@/utils/validation';
import { useErrorHandler } from './useErrorHandler';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  sanitize?: boolean;
}

export const useFormValidation = <T>({
  schema,
  onSubmit,
  sanitize = true
}: UseFormValidationOptions<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError } = useErrorHandler();

  const validateField = useCallback((name: string, value: any): string | null => {
    try {
      // Validate individual field by creating a temporary object
      const tempData = { [name]: value };
      schema.parse(tempData);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(e => e.path.includes(name));
        return fieldError?.message || 'Invalid value';
      }
      return 'Validation error';
    }
  }, [schema]);

  const validateForm = useCallback((data: any): { isValid: boolean; errors: Record<string, string> } => {
    try {
      const processedData = sanitize ? sanitizeFormData(data) : data;
      schema.parse(processedData);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path.join('.');
          formErrors[field] = err.message;
        });
        return { isValid: false, errors: formErrors };
      }
      return { isValid: false, errors: { form: 'Validation failed' } };
    }
  }, [schema, sanitize]);

  const handleSubmit = useCallback(async (data: any) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const { isValid, errors: validationErrors } = validateForm(data);
      
      if (!isValid) {
        setErrors(validationErrors);
        return;
      }

      const processedData = sanitize ? sanitizeFormData(data) : data;
      const validatedData = schema.parse(processedData);
      
      await onSubmit(validatedData);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Form submission failed'));
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, schema, sanitize, handleError]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    isSubmitting,
    validateField,
    validateForm,
    handleSubmit,
    clearErrors,
    setFieldError,
    clearFieldError
  };
};