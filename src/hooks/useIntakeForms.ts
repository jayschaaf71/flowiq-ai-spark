
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { IntakeForm, IntakeSubmission } from '@/types/intake';

export { IntakeForm, IntakeSubmission } from '@/types/intake';

export const useIntakeForms = () => {
  const [forms, setForms] = useState<IntakeForm[]>([]);
  const [submissions, setSubmissions] = useState<IntakeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch intake forms
  const { data: fetchedForms, isLoading: formsLoading } = useQuery({
    queryKey: ['intake-forms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intake_forms')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching intake forms:', error);
        throw error;
      }

      return data;
    },
  });

  // Fetch intake submissions
  const { data: fetchedSubmissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ['intake-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intake_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching intake submissions:', error);
        throw error;
      }

      return data;
    },
  });

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

  // Create form mutation
  const createFormMutation = useMutation({
    mutationFn: async (formData: Omit<IntakeForm, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('intake_forms')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-forms'] });
      toast({ title: 'Form created successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error creating form', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  // Update form mutation
  const updateFormMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<IntakeForm> }) => {
      const { data, error } = await supabase
        .from('intake_forms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-forms'] });
      toast({ title: 'Form updated successfully' });
    },
  });

  // Delete form mutation
  const deleteFormMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('intake_forms')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-forms'] });
      toast({ title: 'Form deleted successfully' });
    },
  });

  // Submit form mutation
  const submitFormMutation = useMutation({
    mutationFn: async (submissionData: Omit<IntakeSubmission, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('intake_submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-submissions'] });
      toast({ title: 'Form submitted successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error submitting form', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  // Track form events for analytics
  const trackFormEvent = async (formId: string, eventType: string, metadata?: any) => {
    try {
      await supabase
        .from('intake_analytics')
        .insert([{
          form_id: formId,
          event_type: eventType,
          tenant_type: 'healthcare', // This could be dynamic based on tenant
          metadata: metadata || {}
        }]);
    } catch (error) {
      console.error('Error tracking form event:', error);
    }
  };

  return {
    forms,
    submissions,
    loading,
    createForm: createFormMutation.mutate,
    updateForm: updateFormMutation.mutate,
    deleteForm: deleteFormMutation.mutate,
    submitForm: submitFormMutation.mutate,
    trackFormEvent,
    isCreating: createFormMutation.isPending,
    isUpdating: updateFormMutation.isPending,
    isDeleting: deleteFormMutation.isPending,
    isSubmitting: submitFormMutation.isPending,
  };
};
