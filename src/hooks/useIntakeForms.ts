
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenantConfig } from '@/utils/tenantConfig';
import type { Json } from '@/integrations/supabase/types';

export interface IntakeForm {
  id: string;
  title: string;
  description: string | null;
  tenant_type: string;
  form_fields: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string | null;
  form_data: Json;
  ai_summary: string | null;
  priority_level: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useIntakeForms = () => {
  const [forms, setForms] = useState<IntakeForm[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const tenantConfig = useTenantConfig();

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from('intake_forms')
        .select('*')
        .eq('tenant_type', tenantConfig.name.toLowerCase())
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('intake_submissions')
        .select(`
          *,
          intake_forms!inner(tenant_type)
        `)
        .eq('intake_forms.tenant_type', tenantConfig.name.toLowerCase())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const createForm = async (formData: Omit<IntakeForm, 'id' | 'created_at' | 'updated_at' | 'tenant_type'>) => {
    try {
      const { data, error } = await supabase
        .from('intake_forms')
        .insert([{
          title: formData.title,
          description: formData.description,
          form_fields: formData.form_fields,
          is_active: formData.is_active,
          tenant_type: tenantConfig.name.toLowerCase()
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchForms();
      return data;
    } catch (error) {
      console.error('Error creating form:', error);
      throw error;
    }
  };

  const updateForm = async (id: string, updates: Partial<Omit<IntakeForm, 'id' | 'created_at' | 'updated_at' | 'tenant_type'>>) => {
    try {
      const { data, error } = await supabase
        .from('intake_forms')
        .update({
          ...(updates.title && { title: updates.title }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.form_fields && { form_fields: updates.form_fields }),
          ...(updates.is_active !== undefined && { is_active: updates.is_active })
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchForms();
      return data;
    } catch (error) {
      console.error('Error updating form:', error);
      throw error;
    }
  };

  const submitForm = async (formId: string, submissionData: {
    patient_name: string;
    patient_email: string;
    patient_phone?: string;
    form_data: Json;
  }) => {
    try {
      const { data, error } = await supabase
        .from('intake_submissions')
        .insert([{
          form_id: formId,
          patient_name: submissionData.patient_name,
          patient_email: submissionData.patient_email,
          patient_phone: submissionData.patient_phone || null,
          form_data: submissionData.form_data
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Track analytics
      await supabase
        .from('intake_analytics')
        .insert([{
          form_id: formId,
          submission_id: data.id,
          event_type: 'form_completed',
          tenant_type: tenantConfig.name.toLowerCase()
        }]);

      return data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  const trackFormEvent = async (formId: string, eventType: string, metadata?: Json) => {
    try {
      await supabase
        .from('intake_analytics')
        .insert([{
          form_id: formId,
          event_type: eventType,
          tenant_type: tenantConfig.name.toLowerCase(),
          metadata: metadata || {}
        }]);
    } catch (error) {
      console.error('Error tracking form event:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchForms(), fetchSubmissions()]);
      setLoading(false);
    };

    loadData();
  }, [tenantConfig.name]);

  return {
    forms,
    submissions,
    loading,
    createForm,
    updateForm,
    submitForm,
    trackFormEvent,
    refreshForms: fetchForms,
    refreshSubmissions: fetchSubmissions
  };
};
