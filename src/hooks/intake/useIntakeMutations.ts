
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../use-toast';
import type { IntakeForm, IntakeSubmission } from '@/types/intake';

export const useIntakeMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return {
    createForm: createFormMutation.mutate,
    updateForm: updateFormMutation.mutate,
    deleteForm: deleteFormMutation.mutate,
    submitForm: submitFormMutation.mutate,
    isCreating: createFormMutation.isPending,
    isUpdating: updateFormMutation.isPending,
    isDeleting: deleteFormMutation.isPending,
    isSubmitting: submitFormMutation.isPending,
  };
};
