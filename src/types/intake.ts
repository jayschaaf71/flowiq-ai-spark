
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'number';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  [key: string]: unknown; // Database compatibility
}

// Use JSON-compatible type for database (using any for Supabase compatibility)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormFieldsJson = any;
export type FormDataJson = Record<string, unknown>; // Flexible form data structure

export interface IntakeForm {
  id: string;
  title: string;
  description?: string;
  form_fields: FormFieldsJson;
  is_active: boolean;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface IntakeSubmission {
  id: string;
  form_id: string;
  form_data: FormDataJson;
  patient_name: string;
  patient_email: string;
  patient_phone?: string;
  ai_summary?: string;
  priority_level: string;
  status: string;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}
