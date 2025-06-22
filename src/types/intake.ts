
export interface IntakeForm {
  id: string;
  title: string;
  description?: string;
  form_fields: any;
  is_active: boolean;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface IntakeSubmission {
  id: string;
  form_id: string;
  form_data: any;
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
