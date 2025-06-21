
interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export const validateField = (field: FormField, value: any): string | null => {
  // Check required fields
  if (field.required && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
    return `${field.label} is required`;
  }

  // Skip further validation if field is empty and not required
  if (!value || value === '') {
    return null;
  }

  // Email validation
  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Please enter a valid email address';
  }

  // Phone validation - more flexible pattern
  if (field.type === 'phone' && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
    return 'Please enter a valid phone number';
  }

  // Date validation
  if (field.type === 'date') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    // Check if date is in the future for birth dates
    if (field.id.includes('birth') && date > new Date()) {
      return 'Birth date cannot be in the future';
    }
  }

  // Custom validation rules
  if (field.validation) {
    const { minLength, maxLength, pattern, min, max } = field.validation;

    if (minLength && value.length < minLength) {
      return `${field.label} must be at least ${minLength} characters long`;
    }

    if (maxLength && value.length > maxLength) {
      return `${field.label} must be no more than ${maxLength} characters long`;
    }

    if (pattern && !new RegExp(pattern).test(value)) {
      return `${field.label} format is invalid`;
    }

    if (typeof value === 'number') {
      if (min !== undefined && value < min) {
        return `${field.label} must be at least ${min}`;
      }
      if (max !== undefined && value > max) {
        return `${field.label} must be no more than ${max}`;
      }
    }
  }

  return null;
};

export const validateFields = (fields: FormField[], formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  fields.forEach(field => {
    const error = validateField(field, formData[field.id]);
    if (error) {
      errors[field.id] = error;
    }
  });

  return errors;
};

export const calculateFormCompleteness = (fields: FormField[], formData: Record<string, any>): number => {
  const totalFields = fields.length;
  const completedFields = fields.filter(field => {
    const value = formData[field.id];
    return value !== undefined && value !== null && value !== '';
  }).length;

  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};

export const getRequiredFieldsStatus = (fields: FormField[], formData: Record<string, any>) => {
  const requiredFields = fields.filter(field => field.required);
  const completedRequired = requiredFields.filter(field => {
    const value = formData[field.id];
    return value !== undefined && value !== null && value !== '';
  });

  return {
    total: requiredFields.length,
    completed: completedRequired.length,
    missing: requiredFields.filter(field => {
      const value = formData[field.id];
      return value === undefined || value === null || value === '';
    })
  };
};
