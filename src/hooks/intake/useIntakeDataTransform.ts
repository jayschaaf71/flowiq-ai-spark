
import { useState, useEffect } from 'react';
import type { IntakeForm, IntakeSubmission } from '@/types/intake';

export const useIntakeDataTransform = (
  fetchedForms: any[] | undefined,
  fetchedSubmissions: any[] | undefined,
  formsLoading: boolean,
  submissionsLoading: boolean
) => {
  const [forms, setForms] = useState<IntakeForm[]>([]);
  const [submissions, setSubmissions] = useState<IntakeSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fetchedForms) {
      // Transform the data to match our IntakeForm interface
      const transformedForms: IntakeForm[] = fetchedForms.map(form => ({
        id: form.id,
        title: form.title,
        description: form.description || undefined,
        form_fields: form.form_fields,
        is_active: form.is_active,
        tenant_id: form.tenant_id || undefined,
        created_at: form.created_at,
        updated_at: form.updated_at
      }));
      setForms(transformedForms);
    }
    
    if (fetchedSubmissions) {
      // Transform the data to match our IntakeSubmission interface
      const transformedSubmissions: IntakeSubmission[] = fetchedSubmissions.map(submission => ({
        id: submission.id,
        form_id: submission.form_id,
        form_data: submission.form_data,
        patient_name: submission.patient_name,
        patient_email: submission.patient_email,
        patient_phone: submission.patient_phone || undefined,
        ai_summary: submission.ai_summary || undefined,
        priority_level: submission.priority_level,
        status: submission.status,
        tenant_id: submission.tenant_id || undefined,
        created_at: submission.created_at,
        updated_at: submission.updated_at
      }));
      setSubmissions(transformedSubmissions);
    }
    
    setLoading(formsLoading || submissionsLoading);
  }, [fetchedForms, fetchedSubmissions, formsLoading, submissionsLoading]);

  return {
    forms,
    submissions,
    loading,
  };
};
