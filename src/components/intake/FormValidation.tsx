
interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
}

export const validateField = (field: FormField, value: any): string | null => {
  if (field.required && (!value || value === '')) {
    return `${field.label} is required`;
  }
  
  if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
    return 'Please enter a valid email address';
  }
  
  if (field.type === 'phone' && value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
    return 'Please enter a valid phone number';
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
