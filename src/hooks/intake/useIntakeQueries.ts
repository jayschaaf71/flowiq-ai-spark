
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { IntakeForm, IntakeSubmission } from '@/types/intake';

export const useIntakeQueries = () => {
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

  return {
    fetchedForms,
    fetchedSubmissions,
    formsLoading,
    submissionsLoading,
  };
};
