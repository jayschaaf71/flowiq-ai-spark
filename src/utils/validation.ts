import { z } from 'zod';

// Email validation schema
export const emailSchema = z.string().email('Invalid email format');

// Phone validation schema
export const phoneSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$|^\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
  'Invalid phone format'
);

// Age validation schema
export const ageSchema = z.number().min(0).max(150, 'Invalid age');

// Common form schemas
export const appointmentFormSchema = z.object({
  patient_name: z.string().min(1, 'Patient name is required').max(100),
  email: emailSchema.optional().or(z.literal('')),
  phone: phoneSchema.optional().or(z.literal('')),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  appointment_type: z.string().min(1, 'Appointment type is required'),
  duration: z.number().min(15).max(480, 'Duration must be between 15 minutes and 8 hours'),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

export const intakeFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  emergencyContact: z.string().max(100, 'Emergency contact must be less than 100 characters').optional(),
  medicalHistory: z.string().max(2000, 'Medical history must be less than 2000 characters').optional(),
});

// Sanitization function
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous characters and trim
  return input
    .trim()
    .slice(0, 1000) // Limit length
    .replace(/[<>'"`;\\]/g, ''); // Remove dangerous chars
};

// Sanitize object with string values
export const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Validation helpers
export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  try {
    phoneSchema.parse(phone);
    return true;
  } catch {
    return false;
  }
};

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
export type IntakeFormData = z.infer<typeof intakeFormSchema>;