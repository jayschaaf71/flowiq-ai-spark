
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { IntakeForm, IntakeSubmission } from '@/types/intake';

export const useIntakeForms = () => {
  const [forms, setForms] = useState<IntakeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch intake forms
  const { data: fetchedForms, isLoading } = useQuery({
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
    setLoading(isLoading);
  }, [fetchedForms, isLoading]);

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

  return {
    forms,
    loading,
    createForm: createFormMutation.mutate,
    updateForm: updateFormMutation.mutate,
    deleteForm: deleteFormMutation.mutate,
    isCreating: createFormMutation.isPending,
    isUpdating: updateFormMutation.isPending,
    isDeleting: deleteFormMutation.isPending,
  };
};
