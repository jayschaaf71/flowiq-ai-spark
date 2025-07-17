
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { IntakeForm, IntakeSubmission } from '@/types/intake';

export const useIntakeQueries = () => {
  // Fetch intake forms with better error handling
  const { data: fetchedForms, isLoading: formsLoading, error: formsError } = useQuery({
    queryKey: ['intake-forms'],
    queryFn: async () => {
      console.log('Fetching intake forms...');
      try {
        const { data, error } = await supabase
          .from('intake_forms')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching intake forms:', error);
          // Return empty array instead of throwing to prevent error loop
          return [];
        }

        console.log('Successfully fetched intake forms:', data?.length);
        return data || [];
      } catch (err) {
        console.error('Unexpected error fetching intake forms:', err);
        // Return empty array instead of throwing to prevent error loop
        return [];
      }
    },
    retry: false, // Disable retries to prevent persistent errors
    refetchOnWindowFocus: false,
  });

  // Fetch intake submissions with better error handling
  const { data: fetchedSubmissions, isLoading: submissionsLoading, error: submissionsError } = useQuery({
    queryKey: ['intake-submissions'],
    queryFn: async () => {
      console.log('Fetching intake submissions...');
      try {
        const { data, error } = await supabase
          .from('intake_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching intake submissions:', error);
          // Return empty array instead of throwing to prevent error loop
          return [];
        }

        console.log('Successfully fetched intake submissions:', data?.length);
        return data || [];
      } catch (err) {
        console.error('Unexpected error fetching intake submissions:', err);
        // Return empty array instead of throwing to prevent error loop
        return [];
      }
    },
    retry: false, // Disable retries to prevent persistent errors
    refetchOnWindowFocus: false,
  });

  // Log any errors
  if (formsError) {
    console.error('Forms query error:', formsError);
  }
  if (submissionsError) {
    console.error('Submissions query error:', submissionsError);
  }

  return {
    fetchedForms,
    fetchedSubmissions,
    formsLoading,
    submissionsLoading,
    formsError,
    submissionsError,
  };
};
